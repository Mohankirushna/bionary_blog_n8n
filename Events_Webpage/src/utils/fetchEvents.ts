import { Event } from '../data/mockEvents';

const SHEET_ID = "1b67j1jYOSKzbUViNIqAHESaoZ31HVUQTsXSK3C5ESqU";
const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=0`;

function normalizeImageUrl(v: string | null | undefined): string | null {
  if (!v) return null;
  v = String(v).trim();

  // Extract file id from either: ...?id=FILE_ID  OR  .../file/d/FILE_ID/...
  const m = v.match(/[?&]id=([\w-]+)/) || v.match(/\/file\/d\/([\w-]+)/);
  if (!m) return v.startsWith("http") ? v : null;

  // Direct-ish image URL used by many apps for Drive images
  return `https://lh3.googleusercontent.com/d/${m[1]}`;
}

interface SheetRow {
  c: Array<{ v: any; f?: string } | null>;
}

interface SheetResponse {
  table: {
    cols: Array<{ label: string; type: string }>;
    rows: SheetRow[];
  };
}

export async function fetchEventsFromSheet(): Promise<Event[]> {
  try {
    const response = await fetch(GVIZ_URL);
    const text = await response.text();
    
    // Google Visualization API returns JSONP, need to extract JSON
    const jsonString = text.substring(47).slice(0, -2);
    const data: SheetResponse = JSON.parse(jsonString);
    
    const rows = data.table.rows;
    const cols = data.table.cols;
    
    // Map column labels to indices for easier access
    const getColIndex = (label: string) => 
      cols.findIndex(col => col.label.toLowerCase().includes(label.toLowerCase()));
    
    const events: Event[] = rows.map((row, index) => {
      const getCell = (labelPart: string) => {
        const idx = getColIndex(labelPart);
        return idx >= 0 && row.c[idx] ? row.c[idx]?.v : null;
      };

      // Extract data from cells
      const id = String(index + 1);
      const eventCode = getCell('event code') || getCell('code') || '';
      const title = getCell('title') || getCell('name') || getCell('event') || 'Untitled Event';
      const description = getCell('description') || getCell('about') || '';
      const date = getCell('date') || '';
      const time = getCell('time') || '';
      const venue = getCell('venue') || getCell('location') || getCell('place') || '';
      const category = getCell('category') || getCell('type') || 'General';
      const club = getCell('club') || getCell('organizer') || getCell('organisation') || '';
      const organizer = getCell('organizer') || getCell('organized by') || getCell('contact person') || club || '';
      
      // Handle tags (could be comma-separated)
      const tagsRaw = getCell('tags') || getCell('tag') || '';
      const tags = tagsRaw ? String(tagsRaw).split(',').map((t: string) => t.trim()) : [category];
      
      // Registration info
      const registrationStatus = getCell('registration') || getCell('status') || 'open';
      const registrationDeadline = getCell('registration deadline') || getCell('deadline') || '';
      const maxParticipants = getCell('max participants') || getCell('capacity') || null;
      const currentParticipants = getCell('current participants') || getCell('registered') || 0;
      
      // Image handling
      const imageUrl = getCell('image') || getCell('poster') || getCell('img') || '';
      const normalizedImage = normalizeImageUrl(imageUrl);
      
      // Contact info
      const contactEmail = getCell('email') || getCell('contact email') || '';
      const contactPhone = getCell('phone') || getCell('contact phone') || '';
      
      // Additional info
      const fees = getCell('fees') || getCell('fee') || getCell('price') || '';
      const prize = getCell('prize') || getCell('prizes') || getCell('rewards') || '';
      
      // Schedule and rounds (if provided as JSON or structured text)
      const scheduleRaw = getCell('schedule');
      const schedule = scheduleRaw ? parseSchedule(scheduleRaw) : undefined;
      
      const roundsRaw = getCell('rounds');
      const rounds = roundsRaw ? parseRounds(roundsRaw) : undefined;
      
      const rulesRaw = getCell('rules');
      const rules = rulesRaw ? parseRules(rulesRaw) : undefined;

      // Normalize date format
      const normalizedDate = normalizeDate(date);
      
      // Determine registration status based on date if not explicitly provided
      const status = determineStatus(registrationStatus, normalizedDate);

      return {
        id,
        eventCode,
        title,
        date: normalizedDate,
        time,
        venue,
        club,
        category,
        description,
        tags,
        organizer,
        registrationStatus: status,
        registrationDeadline: registrationDeadline ? normalizeDate(registrationDeadline) : undefined,
        maxParticipants: maxParticipants ? Number(maxParticipants) : undefined,
        currentParticipants: currentParticipants ? Number(currentParticipants) : undefined,
        schedule,
        rounds,
        rules,
        contactEmail,
        contactPhone,
        prize,
        fees,
        imageUrl: normalizedImage || undefined,
      } as Event;
    }).filter(event => {
      // Filter out empty rows
      if (!event.title || event.title === 'Untitled Event') return false;
      
      // Filter out events with title that is purely dashes (e.g., "---", "-")
      if (/^-+$/.test(String(event.title).trim())) return false;
      
      // Filter out events with event code that is purely dashes (e.g., "---", "-")
      if (event.eventCode && /^-+$/.test(String(event.eventCode).trim())) return false;
      
      return true;
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching events from sheet:', error);
    return [];
  }
}

// Helper functions to parse structured data
function parseSchedule(raw: any): Array<{ time: string; activity: string }> | undefined {
  if (!raw) return undefined;
  try {
    // Try JSON first
    if (typeof raw === 'string' && raw.startsWith('[')) {
      return JSON.parse(raw);
    }
    // Try line-by-line format: "10:00 AM - Activity"
    const lines = String(raw).split(/\n|;|\|/).map(l => l.trim()).filter(Boolean);
    return lines.map(line => {
      const parts = line.split(/[-–—:](.+)/);
      return {
        time: parts[0]?.trim() || '',
        activity: parts[1]?.trim() || line
      };
    });
  } catch {
    return undefined;
  }
}

function parseRounds(raw: any): Array<{ name: string; description: string }> | undefined {
  if (!raw) return undefined;
  try {
    // Try JSON first
    if (typeof raw === 'string' && raw.startsWith('[')) {
      return JSON.parse(raw);
    }
    // Try line-by-line format
    const lines = String(raw).split(/\n|;|\|/).map(l => l.trim()).filter(Boolean);
    return lines.map(line => ({
      name: line,
      description: ''
    }));
  } catch {
    return undefined;
  }
}

function parseRules(raw: any): string[] | undefined {
  if (!raw) return undefined;
  try {
    // Try JSON first
    if (typeof raw === 'string' && raw.startsWith('[')) {
      return JSON.parse(raw);
    }
    // Split by newlines, semicolons, or pipes
    return String(raw).split(/\n|;|\|/).map(r => r.trim()).filter(Boolean);
  } catch {
    return undefined;
  }
}

function normalizeDate(dateStr: any): string {
  if (!dateStr) return '';
  
  // If it's already in YYYY-MM-DD format, return it
  if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  try {
    // Try to parse as a date
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch {
    // If parsing fails, return as-is
  }
  
  return String(dateStr);
}

function determineStatus(statusRaw: any, dateStr: string): 'open' | 'closed' | 'upcoming' {
  // If explicitly provided, use it
  if (statusRaw) {
    const status = String(statusRaw).toLowerCase().trim();
    if (status.includes('open')) return 'open';
    if (status.includes('closed')) return 'closed';
    if (status.includes('upcoming') || status.includes('soon')) return 'upcoming';
  }
  
  // Otherwise, determine from date
  try {
    const eventDate = new Date(dateStr);
    const now = new Date();
    const daysDiff = Math.floor((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return 'closed'; // Past event
    if (daysDiff > 30) return 'upcoming'; // More than 30 days away
    return 'open'; // Within 30 days
  } catch {
    return 'open'; // Default to open if we can't determine
  }
}
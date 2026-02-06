import { Event } from '../data/mockEvents';

const EXPORT_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTouohnGGXpsh61xSxwiW7md1YOdtTYi9_qRxHf5jqdqQCZX-m2GRGI80f476J4j-Kze-CeLPsEHKNM/pub?output=csv";

function normalizeImageUrl(v: string | null | undefined): string | null {
  if (!v) return null;
  v = String(v).trim();

  // Extract file id from either: ...?id=FILE_ID  OR  .../file/d/FILE_ID/...
  const m = v.match(/[?&]id=([\w-]+)/) || v.match(/\/file\/d\/([\w-]+)/);
  if (!m) return v.startsWith("http") ? v : null;

  // Direct-ish image URL used by many apps for Drive images
  return `https://lh3.googleusercontent.com/d/${m[1]}`;
}

// Helper to parse CSV line handling quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result.map(field => field.replace(/^"|"$/g, ''));
}

export async function fetchEventsFromSheet(): Promise<Event[]> {
  try {
    const response = await fetch(EXPORT_URL);
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return [];
    }

    const csvText = await response.text();
    const lines = csvText.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      console.warn('No data rows in CSV');
      return [];
    }

    // Parse header row
    const headers = parseCSVLine(lines[0]);

    // Parse data rows
    return lines.slice(1).map((line, index) => {
      const values = parseCSVLine(line);

      const getCell = (labelPart: string) => {
        const idx = headers.findIndex(h => h.toLowerCase().includes(labelPart.toLowerCase()));
        return idx >= 0 && values[idx] ? values[idx].trim() : null;
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
      // Also filter out events with event code that is purely dashes
      if (/^-+$/.test(String(event.title).trim()) ||
          (event.eventCode && /^-+$/.test(String(event.eventCode).trim()))) return false;

      return true;
    });
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
    const lines = String(raw).split(/[\n;|]/).map(l => l.trim()).filter(Boolean);
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
    const lines = String(raw).split(/[\n;|]/).map(l => l.trim()).filter(Boolean);
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
    return String(raw).split(/[\n;|]/).map(r => r.trim()).filter(Boolean);
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
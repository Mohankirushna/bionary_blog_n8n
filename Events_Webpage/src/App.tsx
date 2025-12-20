import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { EventsList } from './components/EventsList';
import { EventDetails } from './components/EventDetails';
import { mockEvents, Event } from './data/mockEvents';
import { fetchEventsFromSheet } from './utils/fetchEvents';

type Page = 'list' | 'details';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('list');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>(mockEvents); // Start with mock data as fallback
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events from Google Sheets on mount
  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true);
      try {
        const sheetEvents = await fetchEventsFromSheet();
        if (sheetEvents.length > 0) {
          setEvents(sheetEvents);
        } else {
          // If no events from sheet, use mock data
          setEvents(mockEvents);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        // Fallback to mock data on error
        setEvents(mockEvents);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  const selectedEvent = events.find(event => event.id === selectedEventId);

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentPage('list');
    setSelectedEventId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentPage={currentPage}
        />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--muted)] border-t-[var(--primary)]"></div>
          <p className="mt-4 text-[var(--muted-foreground)]">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentPage={currentPage}
      />

      {currentPage === 'list' ? (
        <EventsList
          events={events}
          searchQuery={searchQuery}
          onEventClick={handleEventClick}
        />
      ) : selectedEvent ? (
        <EventDetails event={selectedEvent} onBack={handleBack} />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-[var(--muted-foreground)]">Event not found</p>
          <button
            onClick={handleBack}
            className="mt-4 px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg"
          >
            Back to Events
          </button>
        </div>
      )}
    </div>
  );
}
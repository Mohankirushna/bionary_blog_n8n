import { useState, useMemo } from 'react';
import { Calendar, MapPin, Tag, Users, Clock, ArrowRight, ImageIcon } from 'lucide-react';
import { Event } from '../data/mockEvents';

interface EventsListProps {
  events: Event[];
  searchQuery: string;
  onEventClick: (eventId: string) => void;
}

type FilterType = 'all' | 'upcoming' | 'past';

export function EventsList({ events, searchQuery, onEventClick }: EventsListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredEvents = useMemo(() => {
    const now = new Date();
    
    return events.filter(event => {
      // Search filter
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Time filter
      const eventDate = new Date(event.date);
      
      if (activeFilter === 'upcoming') {
        return eventDate >= now;
      } else if (activeFilter === 'past') {
        return eventDate < now;
      }
      
      return true;
    });
  }, [events, searchQuery, activeFilter]);

  const getStatusBadge = (status: string) => {
    const styles = {
      open: 'bg-[var(--primary)] text-[var(--primary-foreground)]',
      closed: 'bg-[var(--muted)] text-[var(--muted-foreground)]',
      upcoming: 'bg-[var(--accent)] text-[var(--accent-foreground)]'
    };
    
    return styles[status as keyof typeof styles] || styles.open;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[var(--card)] to-[var(--background)] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
            Discover Amazing Events
          </h1>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Join workshops, competitions, and cultural celebrations. Connect with your community and create unforgettable experiences.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {(['all', 'upcoming', 'past'] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full capitalize transition-all whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                    : 'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--muted)]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[var(--muted-foreground)]">
                No events found. Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <article
                  key={event.id}
                  className="bg-[var(--card)] rounded-xl shadow-sm hover:shadow-lg transition-all border border-[var(--border)] overflow-hidden group"
                >
                  {/* Event Image */}
                  {event.imageUrl && (
                    <div className="w-full h-48 overflow-hidden bg-[var(--muted)]">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Hide image if it fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="flex-1 group-hover:text-[var(--primary)] transition-colors">
                        {event.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadge(
                          event.registrationStatus
                        )}`}
                      >
                        {event.registrationStatus}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-[var(--muted-foreground)] text-sm">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-2 text-[var(--muted-foreground)] text-sm">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      {event.venue && (
                        <div className="flex items-center gap-2 text-[var(--muted-foreground)] text-sm">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{event.venue}</span>
                        </div>
                      )}
                      {event.club && (
                        <div className="flex items-center gap-2 text-[var(--muted-foreground)] text-sm">
                          <Users className="w-4 h-4 flex-shrink-0" />
                          <span>{event.club}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {event.description && (
                      <p className="text-[var(--muted-foreground)] text-sm mb-4 line-clamp-3">
                        {event.description}
                      </p>
                    )}

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--secondary)] text-[var(--secondary-foreground)] text-xs"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 pb-6">
                    <button
                      onClick={() => onEventClick(event.id)}
                      className="w-full py-3 px-4 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] rounded-lg transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
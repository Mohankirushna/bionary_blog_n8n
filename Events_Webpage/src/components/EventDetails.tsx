import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  Tag, 
  Mail, 
  Phone,
  Trophy,
  DollarSign,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Event } from '../data/mockEvents';

interface EventDetailsProps {
  event: Event;
  onBack: () => void;
}

export function EventDetails({ event, onBack }: EventDetailsProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusInfo = () => {
    switch (event.registrationStatus) {
      case 'open':
        return {
          icon: CheckCircle,
          text: 'Registration Open',
          color: 'text-[var(--primary)]',
          bgColor: 'bg-[var(--primary)]/10'
        };
      case 'closed':
        return {
          icon: AlertCircle,
          text: 'Registration Closed',
          color: 'text-[var(--muted-foreground)]',
          bgColor: 'bg-[var(--muted)]'
        };
      case 'upcoming':
        return {
          icon: Clock,
          text: 'Registration Opens Soon',
          color: 'text-[var(--accent)]',
          bgColor: 'bg-[var(--accent)]/10'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Back Button */}
      <div className="bg-[var(--card)] border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Events</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Event Image */}
        {event.imageUrl && (
          <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8 bg-[var(--muted)]">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Hide image if it fails to load
                e.currentTarget.parentElement!.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Header Section */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-4 py-1.5 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm">
              {event.category}
            </span>
            {event.club && (
              <span className="px-4 py-1.5 rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)] text-sm">
                {event.club}
              </span>
            )}
            {event.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-1.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mb-6">{event.title}</h1>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${statusInfo.bgColor}`}>
            <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
            <span className={statusInfo.color}>{statusInfo.text}</span>
          </div>
        </header>

        {/* Key Info Card */}
        <section className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-6 md:p-8 mb-8">
          <h3 className="mb-6">Key Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-[var(--muted-foreground)] mb-1">Date</p>
                <p className="text-[var(--foreground)]">{formatDate(event.date)}</p>
              </div>
            </div>

            {event.time && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Time</p>
                  <p className="text-[var(--foreground)]">{event.time}</p>
                </div>
              </div>
            )}

            {event.venue && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Venue</p>
                  <p className="text-[var(--foreground)]">{event.venue}</p>
                </div>
              </div>
            )}

            {event.organizer && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Organizer</p>
                  <p className="text-[var(--foreground)]">{event.organizer}</p>
                </div>
              </div>
            )}

            {event.registrationDeadline && (
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Registration Deadline</p>
                  <p className="text-[var(--foreground)]">{formatDate(event.registrationDeadline)}</p>
                </div>
              </div>
            )}

            {event.maxParticipants && (
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Participants</p>
                  <p className="text-[var(--foreground)]">
                    {event.currentParticipants || 0} / {event.maxParticipants}
                  </p>
                  <div className="mt-2 w-full bg-[var(--muted)] rounded-full h-2">
                    <div
                      className="bg-[var(--primary)] h-2 rounded-full transition-all"
                      style={{
                        width: `${((event.currentParticipants || 0) / event.maxParticipants) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {event.fees && (
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Fees</p>
                  <p className="text-[var(--foreground)]">{event.fees}</p>
                </div>
              </div>
            )}

            {event.prize && (
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Prize</p>
                  <p className="text-[var(--foreground)]">{event.prize}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Description */}
        {event.description && (
          <section className="mb-8">
            <h3 className="mb-4">About This Event</h3>
            <p className="text-[var(--muted-foreground)]">
              {event.description}
            </p>
          </section>
        )}

        {/* Schedule */}
        {event.schedule && event.schedule.length > 0 && (
          <section className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-6 md:p-8 mb-8">
            <h3 className="mb-6">Event Schedule</h3>
            <div className="space-y-4">
              {event.schedule.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-24 text-[var(--primary)]">
                    {item.time}
                  </div>
                  <div className="flex-1 text-[var(--foreground)]">
                    {item.activity}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rounds */}
        {event.rounds && event.rounds.length > 0 && (
          <section className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-6 md:p-8 mb-8">
            <h3 className="mb-6">Competition Rounds</h3>
            <div className="space-y-4">
              {event.rounds.map((round, index) => (
                <div key={index}>
                  <h4 className="text-[var(--foreground)] mb-2">
                    {round.name}
                  </h4>
                  {round.description && (
                    <p className="text-[var(--muted-foreground)]">
                      {round.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rules */}
        {event.rules && event.rules.length > 0 && (
          <section className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-6 md:p-8 mb-8">
            <h3 className="mb-6">Rules & Guidelines</h3>
            <ul className="space-y-3">
              {event.rules.map((rule, index) => (
                <li key={index} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--foreground)]">{rule}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Contact Information */}
        {(event.contactEmail || event.contactPhone) && (
          <section className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-6 md:p-8 mb-8">
            <h3 className="mb-6">Contact Information</h3>
            <div className="space-y-3">
              {event.contactEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--primary)]" />
                  <a
                    href={`mailto:${event.contactEmail}`}
                    className="text-[var(--primary)] hover:underline"
                  >
                    {event.contactEmail}
                  </a>
                </div>
              )}
              {event.contactPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--primary)]" />
                  <a
                    href={`tel:${event.contactPhone}`}
                    className="text-[var(--primary)] hover:underline"
                  >
                    {event.contactPhone}
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {/* CTA Button */}
        <div className="flex gap-4">
          <button
            className={`flex-1 py-4 px-6 rounded-xl transition-all ${
              event.registrationStatus === 'open'
                ? 'bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)]'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed'
            }`}
            disabled={event.registrationStatus !== 'open'}
          >
            {event.registrationStatus === 'open' ? 'Register Now' : 'Registration Closed'}
          </button>
          <button className="px-6 py-4 rounded-xl border-2 border-[var(--border)] hover:bg-[var(--secondary)] transition-all text-[var(--foreground)]">
            Share Event
          </button>
        </div>
      </div>
    </div>
  );
}
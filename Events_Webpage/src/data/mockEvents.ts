export interface Event {
  id: string;
  eventCode?: string; // Event code field
  title: string;
  date: string;
  time: string;
  venue: string;
  club?: string;
  category: string;
  description: string;
  tags: string[];
  organizer: string;
  registrationStatus: 'open' | 'closed' | 'upcoming';
  registrationDeadline?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  schedule?: {
    time: string;
    activity: string;
  }[];
  rounds?: {
    name: string;
    description: string;
  }[];
  rules?: string[];
  contactEmail?: string;
  contactPhone?: string;
  prize?: string;
  fees?: string;
  imageUrl?: string; // Added for Google Drive images
}

export const mockEvents: Event[] = [
  {
    id: '1',
    eventCode: 'TS2025',
    title: 'Tech Symposium 2025',
    date: '2025-01-15',
    time: '10:00 AM - 5:00 PM',
    venue: 'Main Auditorium',
    club: 'Computer Science Club',
    category: 'Technical',
    description: 'Join us for an exciting day of technology talks, workshops, and networking. Leading industry experts will share insights on AI, Machine Learning, and the future of software development.',
    tags: ['Technology', 'AI', 'Workshop'],
    organizer: 'Dr. Sarah Chen',
    registrationStatus: 'open',
    registrationDeadline: '2025-01-10',
    maxParticipants: 200,
    currentParticipants: 147,
    schedule: [
      { time: '10:00 AM', activity: 'Registration & Welcome Coffee' },
      { time: '11:00 AM', activity: 'Keynote: The Future of AI' },
      { time: '1:00 PM', activity: 'Lunch Break' },
      { time: '2:00 PM', activity: 'Workshop Sessions' },
      { time: '4:30 PM', activity: 'Panel Discussion & Q&A' }
    ],
    rules: [
      'Valid student ID required for entry',
      'Laptops recommended for workshop sessions',
      'Professional conduct expected throughout the event'
    ],
    contactEmail: 'tech.symposium@university.edu',
    contactPhone: '+1 (555) 123-4567',
    prize: 'Certificates and swag for all participants',
    fees: 'Free for students'
  },
  {
    id: '2',
    eventCode: 'ADC2025',
    title: 'Annual Debate Championship',
    date: '2025-01-20',
    time: '2:00 PM - 6:00 PM',
    venue: 'Conference Hall B',
    club: 'Debate Society',
    category: 'Cultural',
    description: 'Witness the art of eloquence and critical thinking as teams compete in our prestigious annual debate championship. Open to all university students.',
    tags: ['Debate', 'Competition', 'Public Speaking'],
    organizer: 'Prof. Michael Roberts',
    registrationStatus: 'open',
    registrationDeadline: '2025-01-18',
    maxParticipants: 50,
    currentParticipants: 38,
    rounds: [
      { name: 'Preliminary Round', description: 'All teams compete in assigned topics' },
      { name: 'Quarter Finals', description: 'Top 8 teams advance' },
      { name: 'Semi Finals', description: 'Top 4 teams compete' },
      { name: 'Grand Finals', description: 'Championship round' }
    ],
    rules: [
      'Teams of 2-3 members',
      'Each speaker gets 5 minutes',
      'Rebuttals limited to 2 minutes',
      'Judges decision is final'
    ],
    contactEmail: 'debate@university.edu',
    prize: 'Winner: $500, Runner-up: $250, Certificates for all',
    fees: '$10 per team'
  },
  {
    id: '3',
    eventCode: 'EW2025',
    title: 'Entrepreneurship Workshop',
    date: '2025-02-05',
    time: '9:00 AM - 4:00 PM',
    venue: 'Innovation Lab',
    club: 'Entrepreneurship Cell',
    category: 'Workshop',
    description: 'Learn the fundamentals of starting and scaling your own business. Industry veterans will guide you through ideation, funding, and execution strategies.',
    tags: ['Business', 'Startup', 'Innovation'],
    organizer: 'Emma Thompson',
    registrationStatus: 'upcoming',
    registrationDeadline: '2025-02-01',
    maxParticipants: 100,
    currentParticipants: 0,
    schedule: [
      { time: '9:00 AM', activity: 'Registration' },
      { time: '9:30 AM', activity: 'Introduction to Entrepreneurship' },
      { time: '11:00 AM', activity: 'Business Model Canvas Workshop' },
      { time: '1:00 PM', activity: 'Networking Lunch' },
      { time: '2:00 PM', activity: 'Pitch Practice Sessions' },
      { time: '3:30 PM', activity: 'Q&A with Successful Founders' }
    ],
    contactEmail: 'ecell@university.edu',
    contactPhone: '+1 (555) 987-6543',
    fees: 'Free'
  },
  {
    id: '4',
    eventCode: 'SMF2025',
    title: 'Spring Music Festival',
    date: '2025-03-15',
    time: '5:00 PM - 10:00 PM',
    venue: 'Open Air Theater',
    club: 'Music Society',
    category: 'Cultural',
    description: 'Experience an evening of live music featuring student bands, solo performers, and guest artists. All genres welcome!',
    tags: ['Music', 'Performance', 'Entertainment'],
    organizer: 'David Martinez',
    registrationStatus: 'open',
    maxParticipants: 500,
    currentParticipants: 234,
    schedule: [
      { time: '5:00 PM', activity: 'Gates Open' },
      { time: '6:00 PM', activity: 'Opening Acts' },
      { time: '7:30 PM', activity: 'Headliner Performance' },
      { time: '9:00 PM', activity: 'Jam Session' }
    ],
    contactEmail: 'music@university.edu',
    fees: '$5 entry'
  },
  {
    id: '5',
    eventCode: 'H2025',
    title: 'Hackathon 2025: Code for Change',
    date: '2024-12-10',
    time: '8:00 AM - 8:00 PM',
    venue: 'Computer Lab 301-305',
    club: 'Developer Student Club',
    category: 'Technical',
    description: 'Past event: 24-hour coding marathon where teams built solutions for real-world problems. Over 150 participants competed for prizes.',
    tags: ['Coding', 'Competition', 'Innovation'],
    organizer: 'Alex Kumar',
    registrationStatus: 'closed',
    maxParticipants: 150,
    currentParticipants: 150,
    prize: 'Winner: $1000, Runner-up: $500, 3rd Place: $250',
    fees: 'Free'
  },
  {
    id: '6',
    eventCode: 'PE2025',
    title: 'Photography Exhibition',
    date: '2025-02-20',
    time: '11:00 AM - 7:00 PM',
    venue: 'Art Gallery',
    club: 'Photography Club',
    category: 'Exhibition',
    description: 'Showcase of stunning photographs captured by talented student photographers. Themes include nature, portrait, street, and abstract photography.',
    tags: ['Photography', 'Art', 'Exhibition'],
    organizer: 'Lisa Anderson',
    registrationStatus: 'open',
    contactEmail: 'photo@university.edu',
    fees: 'Free entry'
  },
  {
    id: '7',
    eventCode: 'CF2025',
    title: 'Career Fair 2025',
    date: '2025-03-01',
    time: '10:00 AM - 5:00 PM',
    venue: 'University Sports Complex',
    category: 'Professional',
    description: 'Connect with top employers, explore career opportunities, and attend professional development workshops. Over 80 companies expected to participate.',
    tags: ['Career', 'Networking', 'Jobs'],
    organizer: 'Career Services Office',
    registrationStatus: 'upcoming',
    registrationDeadline: '2025-02-25',
    contactEmail: 'careers@university.edu',
    contactPhone: '+1 (555) 246-8135',
    fees: 'Free for students'
  },
  {
    id: '8',
    eventCode: 'IFF2025',
    title: 'International Food Festival',
    date: '2025-02-14',
    time: '12:00 PM - 8:00 PM',
    venue: 'Central Lawn',
    club: 'International Students Association',
    category: 'Cultural',
    description: 'Celebrate diversity through cuisine! Sample authentic dishes from around the world prepared by international students and local chefs.',
    tags: ['Food', 'Culture', 'Festival'],
    organizer: 'Maria Garcia',
    registrationStatus: 'open',
    maxParticipants: 1000,
    currentParticipants: 567,
    contactEmail: 'isa@university.edu',
    fees: 'Pay per dish'
  }
];
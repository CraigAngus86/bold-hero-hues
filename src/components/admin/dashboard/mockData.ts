
import { FileText, Users, CalendarIcon } from 'lucide-react';
import type { SystemStatusItemProps } from './EnhancedSystemStatus';

// Content status items
export const contentStatusItems = [
  {
    name: 'News Articles',
    count: 24,
    color: 'blue',
    icon: <FileText className="h-4 w-4" />,
    viewAllLink: '/admin/news'
  },
  {
    name: 'Fixture Updates',
    count: 8,
    color: 'green',
    icon: <CalendarIcon className="h-4 w-4" />,
    viewAllLink: '/admin/fixtures'
  },
  {
    name: 'User Signups',
    count: 12,
    color: 'orange',
    icon: <Users className="h-4 w-4" />,
    viewAllLink: '/admin/users'
  }
];

// Mock calendar events
export const mockEvents = [
  {
    id: '1',
    title: 'Board Meeting',
    date: '2025-04-10',
    time: '19:00',
    type: 'meeting'
  },
  {
    id: '2',
    title: 'Player Registration Deadline',
    date: '2025-04-12',
    time: '17:00',
    type: 'deadline'
  },
  {
    id: '3',
    title: 'Community Outreach',
    date: '2025-04-15',
    time: '14:00',
    type: 'event'
  },
  {
    id: '4',
    title: 'Season Tickets Sale',
    date: '2025-04-21',
    time: '09:00',
    type: 'sale'
  }
];

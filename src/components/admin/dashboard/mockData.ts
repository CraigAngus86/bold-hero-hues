import { AlertTriangle, CalendarDays, FileText, MessageSquare, TicketIcon, UsersRound } from "lucide-react";
import { SystemStatusItemProps } from "@/types/system";

// Content status items
export const contentStatusItems = [
  {
    name: 'News Articles',
    count: 24,
    color: 'blue',
    icon: FileText,
    viewAllLink: '/admin/news'
  },
  {
    name: 'Fixture Updates',
    count: 8,
    color: 'green',
    icon: CalendarDays,
    viewAllLink: '/admin/fixtures'
  },
  {
    name: 'User Signups',
    count: 12,
    color: 'orange',
    icon: UsersRound,
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

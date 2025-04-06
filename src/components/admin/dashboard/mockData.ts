
import { ActivityItemProps } from './ActivityItem';
import { SystemStatusItemProps } from './EnhancedSystemStatus';

// Mock activities for testing
export const mockActivities: ActivityItemProps[] = [
  {
    id: '1',
    type: 'create',
    title: 'New match fixture added vs Aberdeen FC',
    user: 'John Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    entityType: 'fixture',
    entityId: 'fix-1',
    editLink: '/admin/fixtures'
  },
  {
    id: '2',
    type: 'update',
    title: 'Updated team roster and player info',
    user: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    entityType: 'team',
    entityId: 'team-1',
    editLink: '/admin/team'
  },
  {
    id: '3',
    type: 'publish',
    title: 'Published news article: "Weekend Victory"',
    user: 'Mike Wilson',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    entityType: 'news',
    entityId: 'news-1',
    editLink: '/admin/news'
  },
  {
    id: '4',
    type: 'update',
    title: 'Updated league table standings',
    user: 'John Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    entityType: 'league table',
    entityId: 'league-1',
    editLink: '/admin/league-table-management'
  },
  {
    id: '5',
    type: 'create',
    title: 'Added new sponsor: Local Business Ltd',
    user: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    entityType: 'sponsor',
    entityId: 'sponsor-1',
    editLink: '/admin/sponsors'
  }
];

// Mock events for calendar
export const mockEvents = [
  {
    id: '1',
    title: 'Home Match vs Buckie Thistle',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
    type: 'fixture'
  },
  {
    id: '2',
    title: 'Away Match vs Formartine United',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days from now
    type: 'fixture'
  },
  {
    id: '3',
    title: 'Monthly Board Meeting',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
    type: 'meeting'
  },
  {
    id: '4',
    title: 'Season Ticket Renewal Deadline',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14 days from now
    type: 'deadline'
  }
];

// Content status items for the status summary component
export const contentStatusItems = [
  {
    id: '1',
    title: 'Outdated League Table',
    status: 'warning' as const,
    link: '/admin/league-table-management',
    description: 'League table data hasn\'t been updated in 3 days'
  },
  {
    id: '2',
    title: 'BBC Fixture Scraper Error',
    status: 'error' as const,
    link: '/admin/settings',
    description: 'The fixture scraper encountered an error on its last run'
  },
  {
    id: '3',
    title: '5 Draft Articles',
    status: 'info' as const,
    link: '/admin/news',
    description: 'There are 5 unpublished news articles in draft status'
  },
  {
    id: '4',
    title: 'Storage Space Low',
    status: 'warning' as const,
    link: '/admin/settings',
    description: 'Image storage is at 85% capacity'
  }
];

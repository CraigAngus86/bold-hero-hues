
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ActivityItem } from './ActivityItem';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

// Mock data for recent activities (in a real app, this would come from an API)
export const mockActivities = [
  {
    id: '1',
    type: 'create' as const,
    title: 'New match fixture added vs Aberdeen FC',
    user: 'John Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    entityType: 'fixture',
    entityId: 'fix-1',
    editLink: '/admin/fixtures'
  },
  {
    id: '2',
    type: 'update' as const,
    title: 'Updated team roster and player info',
    user: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    entityType: 'team',
    entityId: 'team-1',
    editLink: '/admin/team'
  },
  {
    id: '3',
    type: 'publish' as const,
    title: 'Published news article: "Weekend Victory"',
    user: 'Mike Wilson',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    entityType: 'news',
    entityId: 'news-1',
    editLink: '/admin/news'
  },
  {
    id: '4',
    type: 'update' as const,
    title: 'Updated league table standings',
    user: 'John Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    entityType: 'league table',
    entityId: 'league-1',
    editLink: '/admin/league-table-management'
  },
  {
    id: '5',
    type: 'create' as const,
    title: 'Added new sponsor: Local Business Ltd',
    user: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    entityType: 'sponsor',
    entityId: 'sponsor-1',
    editLink: '/admin/sponsors'
  }
];

export interface ActivityFeedProps {
  activities?: typeof mockActivities;
  maxItems?: number;
}

export function ActivityFeed({ activities = mockActivities, maxItems = 5 }: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest actions across the site</CardDescription>
          </div>
          <div className="flex flex-wrap gap-1">
            <Button variant="outline" size="sm" className="h-7">All</Button>
            <Button variant="ghost" size="sm" className="h-7">News</Button>
            <Button variant="ghost" size="sm" className="h-7">Fixtures</Button>
            <Button variant="ghost" size="sm" className="h-7">Team</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="divide-y">
        {displayedActivities.map((activity) => (
          <ActivityItem key={activity.id} {...activity} />
        ))}
        <div className="pt-3">
          <Button variant="link" size="sm" className="w-full">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

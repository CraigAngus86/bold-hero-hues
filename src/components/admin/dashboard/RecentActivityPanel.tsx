
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { 
  FileText, User, Calendar, Settings, 
  Image, AlertCircle, CheckCircle, 
  Clock, Users, Mail
} from 'lucide-react';

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  user: string;
  timestamp: Date;
  section: string;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'article':
      return <FileText className="h-4 w-4" />;
    case 'user':
      return <User className="h-4 w-4" />;
    case 'event':
      return <Calendar className="h-4 w-4" />;
    case 'settings':
      return <Settings className="h-4 w-4" />;
    case 'media':
      return <Image className="h-4 w-4" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'team':
      return <Users className="h-4 w-4" />;
    case 'email':
      return <Mail className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const formatTime = (date: string | Date) => {
  const activityDate = new Date(date);
  return activityDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'article',
    title: 'Article published',
    description: 'New match report published',
    user: 'admin',
    timestamp: new Date(Date.now() - 15 * 60000), // 15 mins ago
    section: 'News'
  },
  {
    id: '2',
    type: 'media',
    title: 'Image uploaded',
    description: 'Match photos uploaded',
    user: 'editor',
    timestamp: new Date(Date.now() - 45 * 60000), // 45 mins ago
    section: 'Media'
  },
  {
    id: '3',
    type: 'event',
    title: 'Fixture added',
    description: 'New fixture added to schedule',
    user: 'admin',
    timestamp: new Date(Date.now() - 120 * 60000), // 2 hours ago
    section: 'Fixtures'
  },
  {
    id: '4',
    type: 'settings',
    title: 'Settings updated',
    description: 'System settings updated',
    user: 'admin',
    timestamp: new Date(Date.now() - 180 * 60000), // 3 hours ago
    section: 'Settings'
  }
];

const RecentActivityPanel = () => {
  // In a real app, we'd fetch activities from an API
  const { data: activities, isLoading } = { data: mockActivities, isLoading: false };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-auto">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center animate-pulse">
                </div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-100 rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-4">
            {(activities || []).map((activity) => (
              <li key={activity.id} className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-700">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.user ? `${activity.user} • ` : ''}
                    {activity.section}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTime(activity.timestamp)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityPanel;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  FileText, 
  Image, 
  Users, 
  Calendar, 
  Settings, 
  ShieldAlert,
  Clock
} from 'lucide-react';

// This would typically come from an API
const recentActivities = [
  {
    id: '1',
    user: 'Admin',
    action: 'created a new news article',
    resource: 'Club Announces New Signing',
    resourceType: 'article',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minutes ago
  },
  {
    id: '2',
    user: 'Editor',
    action: 'uploaded a new image',
    resource: 'team_photo_2023.jpg',
    resourceType: 'image',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '3',
    user: 'Admin',
    action: 'updated player details',
    resource: 'John Smith',
    resourceType: 'player',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: '4',
    user: 'Editor',
    action: 'added a new fixture',
    resource: 'Banks O\' Dee vs Aberdeen FC',
    resourceType: 'fixture',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: '5',
    user: 'Admin',
    action: 'changed system settings',
    resource: 'Email Notifications',
    resourceType: 'settings',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), // 30 hours ago
  },
  {
    id: '6',
    user: 'Security',
    action: 'detected suspicious login attempt',
    resource: 'System Security',
    resourceType: 'security',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  }
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'article':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'image':
      return <Image className="h-4 w-4 text-purple-500" />;
    case 'player':
      return <Users className="h-4 w-4 text-green-500" />;
    case 'fixture':
      return <Calendar className="h-4 w-4 text-orange-500" />;
    case 'settings':
      return <Settings className="h-4 w-4 text-gray-500" />;
    case 'security':
      return <ShieldAlert className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSecs < 60) {
    return `${diffSecs} second${diffSecs !== 1 ? 's' : ''} ago`;
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
};

const RecentActivityPanel = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary-foreground text-xs">
                  {activity.user.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-bold">{activity.user}</span> {activity.action}
                </p>
                <div className="flex items-center pt-1">
                  {getActivityIcon(activity.resourceType)}
                  <span className="ml-1 text-sm text-muted-foreground">
                    {activity.resource}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityPanel;

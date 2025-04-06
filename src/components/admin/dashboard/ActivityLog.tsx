
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatTimeAgo } from '@/utils/date';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileText, User, CalendarRange, Clock, Tag } from 'lucide-react';

interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  description: string;
  timestamp: string;
  type: 'news' | 'fixture' | 'user' | 'system' | 'sponsor';
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'news':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'fixture':
      return <CalendarRange className="h-4 w-4 text-green-500" />;
    case 'user':
      return <User className="h-4 w-4 text-purple-500" />;
    case 'sponsor':
      return <Tag className="h-4 w-4 text-amber-500" />;
    case 'system':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
  }
};

const ActivityLog: React.FC = () => {
  // Mock data - in a real app, this would come from an API or context
  const activities: Activity[] = [
    {
      id: '1',
      user: {
        name: 'John Admin',
        avatar: 'https://github.com/shadcn.png',
      },
      action: 'created a news article',
      description: 'Match Preview: Banks O\'Dee vs Aberdeen',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      type: 'news',
    },
    {
      id: '2',
      user: {
        name: 'Sarah Jones',
        avatar: 'https://github.com/shadcn.png',
      },
      action: 'updated a fixture',
      description: 'Changed venue for upcoming match',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      type: 'fixture',
    },
    {
      id: '3',
      user: {
        name: 'System',
      },
      action: 'performed backup',
      description: 'Weekly database backup completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      type: 'system',
    },
    {
      id: '4',
      user: {
        name: 'Mike Wilson',
        avatar: 'https://github.com/shadcn.png',
      },
      action: 'added new sponsor',
      description: 'Aberdeen Engineering Ltd. added as Gold Sponsor',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      type: 'sponsor',
    },
  ];

  return (
    <div className="space-y-6 -mt-2">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {activity.user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-medium">{activity.user.name}</span>
              <span className="text-xs text-muted-foreground">{activity.action}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {getActivityIcon(activity.type)}
              <p className="text-xs text-gray-600 truncate">{activity.description}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      <Button variant="link" className="w-full justify-center" size="sm">
        View All Activity
      </Button>
    </div>
  );
};

export default ActivityLog;

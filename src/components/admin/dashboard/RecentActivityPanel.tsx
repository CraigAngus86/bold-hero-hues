
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Image, Calendar, User, FileText, Settings, Clock } from 'lucide-react';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItemProps {
  type: string;
  title: string;
  description: string;
  user: string;
  timestamp: Date;
  section: string;
}

const ActivityItem = ({ type, title, description, user, timestamp, section }: ActivityItemProps) => {
  const getIcon = () => {
    switch (type) {
      case 'article': return <FileText className="h-4 w-4" />;
      case 'media': return <Image className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'user': return <User className="h-4 w-4" />;
      case 'settings': return <Settings className="h-4 w-4" />;
      case 'edit': return <Pencil className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'article': return 'bg-blue-500';
      case 'media': return 'bg-purple-500';
      case 'event': return 'bg-yellow-500';
      case 'user': return 'bg-green-500';
      case 'settings': return 'bg-gray-500';
      case 'edit': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getSectionBadge = () => {
    switch (section) {
      case 'News': return 'bg-blue-100 text-blue-800';
      case 'Media': return 'bg-purple-100 text-purple-800';
      case 'Fixtures': return 'bg-yellow-100 text-yellow-800';
      case 'Users': return 'bg-green-100 text-green-800';
      case 'Settings': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex gap-3 py-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${getTypeColor()}`}>
        {getIcon()}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center">
          <p className="text-sm font-medium leading-none">{title}</p>
          <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${getSectionBadge()}`}>
            {section}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex items-center text-xs text-muted-foreground gap-1">
          <span>{user}</span>
          <span>·</span>
          <Clock className="h-3 w-3" />
          <span>{formatDistanceToNow(timestamp, { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
};

const RecentActivityPanel = () => {
  const { data, isLoading, error } = useActivityFeed(5);

  return (
    <Card className="col-span-3">
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-9 w-9 rounded-lg bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Failed to load activity feed
          </div>
        ) : (
          <div className="space-y-2 divide-y">
            {data.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                type={activity.type}
                title={activity.title}
                description={activity.description}
                user={activity.user}
                timestamp={activity.timestamp}
                section={activity.section}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityPanel;

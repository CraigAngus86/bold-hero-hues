
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { FileText, UserPlus, Settings, MessageSquare, FileEdit, FilePlus2, User, CircleCheck } from 'lucide-react';

const getIcon = (type: string) => {
  switch (type) {
    case 'article':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'user':
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case 'settings':
      return <Settings className="h-4 w-4 text-yellow-500" />;
    case 'comment':
      return <MessageSquare className="h-4 w-4 text-purple-500" />;
    case 'edit':
      return <FileEdit className="h-4 w-4 text-blue-500" />;
    case 'create':
      return <FilePlus2 className="h-4 w-4 text-green-500" />;
    case 'profile':
      return <User className="h-4 w-4 text-gray-500" />;
    case 'system':
      return <CircleCheck className="h-4 w-4 text-green-500" />;
    default:
      return <FileText className="h-4 w-4 text-blue-500" />;
  }
};

const formatTime = (timestamp: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffMinutes < 1440) {
    const hours = Math.floor(diffMinutes / 60);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    const days = Math.floor(diffMinutes / 1440);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
};

const RecentActivityWidget = () => {
  const { data, isLoading } = useActivityFeed(8);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="bg-gray-200 p-2 rounded-full w-8 h-8"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="flex justify-between mt-1">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start space-x-3 border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div className="bg-gray-100 p-2 rounded-full">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{activity.user}</span>
                    <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityWidget;

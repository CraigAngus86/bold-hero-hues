
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

type ActivityType = 'create' | 'update' | 'delete' | 'publish' | 'login' | 'other';

interface ActivityItemProps {
  id: string;
  type: ActivityType;
  title: string;
  user: string;
  timestamp: Date;
  entityType: string;
  entityId: string;
  editLink?: string;
}

export function ActivityItem({ 
  type, 
  title, 
  user, 
  timestamp, 
  entityType, 
  editLink 
}: ActivityItemProps) {
  const getActivityIcon = () => {
    const baseClasses = "h-8 w-8 rounded-full flex items-center justify-center";
    
    switch (type) {
      case 'create':
        return <div className={cn(baseClasses, "bg-green-100 text-green-600")}>+</div>;
      case 'update':
        return <div className={cn(baseClasses, "bg-blue-100 text-blue-600")}>↑</div>;
      case 'delete':
        return <div className={cn(baseClasses, "bg-red-100 text-red-600")}>×</div>;
      case 'publish':
        return <div className={cn(baseClasses, "bg-purple-100 text-purple-600")}>↗</div>;
      case 'login':
        return <div className={cn(baseClasses, "bg-yellow-100 text-yellow-600")}>→</div>;
      default:
        return <div className={cn(baseClasses, "bg-gray-100 text-gray-600")}>•</div>;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'create': return 'Created';
      case 'update': return 'Updated';
      case 'delete': return 'Deleted';
      case 'publish': return 'Published';
      case 'login': return 'Logged in';
      default: return 'Action';
    }
  };

  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

  return (
    <div className="flex gap-4 py-3">
      <div className="flex-shrink-0">
        {getActivityIcon()}
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium text-sm">{getTypeLabel()} <span className="text-gray-600">{entityType}</span></p>
            <p className="text-sm truncate">{title}</p>
          </div>
          {editLink && (
            <Button asChild variant="ghost" size="sm" className="h-7 px-2">
              <Link to={editLink}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
        <div className="mt-1 flex items-center text-xs text-muted-foreground">
          <span>{user}</span>
          <span className="mx-1">•</span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
}

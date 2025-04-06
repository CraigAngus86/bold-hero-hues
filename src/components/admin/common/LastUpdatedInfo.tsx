
import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface LastUpdatedInfoProps {
  lastUpdated: Date | string | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  variant?: 'default' | 'inline' | 'badge';
  className?: string;
}

export const LastUpdatedInfo: React.FC<LastUpdatedInfoProps> = ({
  lastUpdated,
  isLoading = false,
  onRefresh,
  variant = 'default',
  className,
}) => {
  // Calculate time ago text
  let timeAgoText = 'Never updated';
  let formattedTime = '';
  
  if (lastUpdated) {
    const date = typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated;
    try {
      timeAgoText = formatDistanceToNow(date, { addSuffix: true });
      formattedTime = date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
    }
  }
  
  if (variant === 'inline') {
    return (
      <span className={cn("text-xs text-gray-500 flex items-center gap-1", className)}>
        <Clock className="h-3 w-3" />
        {lastUpdated ? timeAgoText : 'Not updated yet'}
        {onRefresh && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5 p-0" 
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
          </Button>
        )}
      </span>
    );
  }
  
  if (variant === 'badge') {
    return (
      <div className={cn("inline-flex items-center gap-1 bg-gray-100 text-xs px-2 py-0.5 rounded-full", className)}>
        <Clock className="h-3 w-3 text-primary-800" />
        <span>{lastUpdated ? timeAgoText : 'Not updated'}</span>
      </div>
    );
  }
  
  // Default variant
  return (
    <div className={cn("flex items-center justify-between text-sm rounded-md", className)}>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary-800" />
        <span className="font-medium text-gray-700">
          {lastUpdated ? (
            <>
              Last updated: <span className="text-gray-900">{formattedTime}</span>
              <span className="text-gray-500 ml-1">({timeAgoText})</span>
            </>
          ) : (
            'Not updated yet'
          )}
        </span>
      </div>
      
      {onRefresh && (
        <Button 
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-7 px-2 py-0"
        >
          <RefreshCw className={cn("h-3.5 w-3.5 mr-1", isLoading && "animate-spin")} />
          Refresh
        </Button>
      )}
    </div>
  );
};

export default LastUpdatedInfo;

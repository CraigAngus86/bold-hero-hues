
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface LastUpdatedInfoProps {
  lastUpdated: string | null;
}

const LastUpdatedInfo: React.FC<LastUpdatedInfoProps> = ({ lastUpdated }) => {
  const formatUpdatedTime = () => {
    if (!lastUpdated) return 'Never';
    try {
      return formatDistanceToNow(new Date(lastUpdated), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="text-sm text-muted-foreground mb-4">
      <span className={cn(
        "font-medium",
        !lastUpdated ? "text-amber-500" : "text-gray-600"
      )}>
        Last updated:
      </span> {formatUpdatedTime()}
    </div>
  );
};

export default LastUpdatedInfo;

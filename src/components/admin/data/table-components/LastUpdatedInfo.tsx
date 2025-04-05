
import React from 'react';
import { Clock } from 'lucide-react';

interface LastUpdatedInfoProps {
  lastUpdated: string | null;
}

/**
 * Component displaying when the data was last updated
 */
export const LastUpdatedInfo: React.FC<LastUpdatedInfoProps> = ({ lastUpdated }) => {
  if (!lastUpdated) return null;
  
  return (
    <div className="text-sm text-muted-foreground mb-4 flex items-center">
      <Clock className="h-4 w-4 mr-1.5 text-muted-foreground/70" />
      <span>
        Last updated: {new Date(lastUpdated).toLocaleString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </span>
    </div>
  );
};

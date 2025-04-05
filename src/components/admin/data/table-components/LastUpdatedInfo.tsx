
import React from 'react';

interface LastUpdatedInfoProps {
  lastUpdated: string | null;
}

/**
 * Component displaying when the data was last updated
 */
export const LastUpdatedInfo: React.FC<LastUpdatedInfoProps> = ({ lastUpdated }) => {
  if (!lastUpdated) return null;
  
  return (
    <div className="text-sm text-muted-foreground mb-4">
      Last updated: {new Date(lastUpdated).toLocaleString()}
    </div>
  );
};


import React from 'react';
import { format, parseISO } from 'date-fns';
import { Clock } from 'lucide-react';

interface LastUpdatedInfoProps {
  lastUpdated: string | null;
}

const LastUpdatedInfo: React.FC<LastUpdatedInfoProps> = ({ lastUpdated }) => {
  if (!lastUpdated) {
    return (
      <div className="text-sm text-muted-foreground flex items-center mb-4">
        <Clock className="mr-1 h-4 w-4" />
        No recent updates recorded
      </div>
    );
  }

  try {
    const date = parseISO(lastUpdated);
    const formattedDate = format(date, 'PPpp');
    
    return (
      <div className="text-sm text-muted-foreground flex items-center mb-4">
        <Clock className="mr-1 h-4 w-4" />
        Last updated: {formattedDate}
      </div>
    );
  } catch (error) {
    console.error('Error parsing date:', error);
    return (
      <div className="text-sm text-muted-foreground flex items-center mb-4">
        <Clock className="mr-1 h-4 w-4" />
        Last updated: {lastUpdated}
      </div>
    );
  }
};

export default LastUpdatedInfo;

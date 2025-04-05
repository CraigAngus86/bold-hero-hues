
import React from 'react';
import { Clock } from 'lucide-react';

interface LastUpdatedInfoProps {
  lastUpdated: string | null;
}

/**
 * Component displaying when the data was last updated
 */
export const LastUpdatedInfo: React.FC<LastUpdatedInfoProps> = ({ lastUpdated }) => {
  const now = new Date();
  const currentDate = now.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <div className="text-sm bg-gray-50 rounded-md px-3 py-2 mb-5 inline-flex items-center border border-gray-200">
      <Clock className="h-4 w-4 mr-2 text-team-blue" />
      <span className="font-medium text-gray-700">
        {lastUpdated ? (
          <>Last updated: {new Date(lastUpdated).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</>
        ) : (
          <>Current date: {currentDate}</>
        )}
      </span>
    </div>
  );
};


import React from 'react';
import { Clock } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface LastUpdateInfoProps {
  lastUpdated: string | null;
}

const LastUpdateInfo: React.FC<LastUpdateInfoProps> = ({ lastUpdated }) => {
  if (!lastUpdated) return null;
  
  const formattedDate = new Date(lastUpdated).toLocaleString();
  let timeAgo;
  
  try {
    timeAgo = formatDistanceToNow(parseISO(lastUpdated), { addSuffix: true });
  } catch (error) {
    timeAgo = 'recently';
  }
  
  return (
    <div className="flex items-center mb-4 text-gray-600">
      <Clock className="h-4 w-4 mr-2" />
      <span>
        Last updated: <span className="font-medium">{formattedDate}</span> ({timeAgo})
      </span>
    </div>
  );
};

export default LastUpdateInfo;

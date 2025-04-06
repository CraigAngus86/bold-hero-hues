
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';

interface LastUpdatedInfoProps {
  date: Date | string | null;
  label?: string;
  hideIfNull?: boolean;
}

const LastUpdatedInfo: React.FC<LastUpdatedInfoProps> = ({ 
  date, 
  label = "Last updated", 
  hideIfNull = false
}) => {
  if (!date && hideIfNull) {
    return null;
  }

  const formattedDate = date 
    ? formatDistanceToNow(new Date(date), { addSuffix: true })
    : 'never';

  return (
    <div className="flex items-center text-xs text-muted-foreground">
      <Clock className="mr-1 h-3 w-3" />
      <span>
        {label}: <span className="font-medium">{formattedDate}</span>
      </span>
    </div>
  );
};

export default LastUpdatedInfo;


import React from 'react';
import { Card } from '@/components/ui/card';
import { SystemStatusType } from '@/types/system/status';

interface StatusItemProps {
  name: string;
  status: SystemStatusType;
  metricValue?: string | number;
  icon?: React.ElementType;
  tooltip?: string;
  lastChecked?: string;
  color?: string;
  viewAllLink?: string;
}

const StatusItem: React.FC<StatusItemProps> = ({
  name,
  status,
  metricValue,
  icon: Icon,
  tooltip,
  color,
  viewAllLink
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <Card className={`relative ${color || 'bg-white'} overflow-hidden hover:shadow-md transition-shadow`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {Icon && <Icon className="h-5 w-5 text-gray-500" />}
            <span className="font-medium text-sm">{name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`h-2 w-2 rounded-full ${getStatusColor()}`}></div>
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold">{metricValue || '-'}</div>
        </div>
        {tooltip && (
          <div className="text-xs text-gray-500 mt-1">{tooltip}</div>
        )}
        {viewAllLink && (
          <div className="absolute bottom-2 right-3">
            <a href={viewAllLink} className="text-xs text-blue-600 hover:underline">View all</a>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatusItem;

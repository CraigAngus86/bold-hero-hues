
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SystemStatusItemProps } from '@/types/system/status';
import { LucideIcon } from 'lucide-react';

interface StatusItemProps extends Omit<SystemStatusItemProps, 'icon'> {
  icon?: React.ElementType;
}

const StatusItem: React.FC<StatusItemProps> = ({
  name,
  status,
  metricValue,
  count,
  icon: Icon,
  color,
  viewAllLink
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
      case 'active':
      case 'online':
        return 'bg-green-500';
      case 'warning':
      case 'degraded':
        return 'bg-yellow-400';
      case 'error':
      case 'offline':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-400';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <Card className={cn(
      "p-4 transition-all border hover:border-gray-300",
      color ? color : "bg-white"
    )}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-sm text-gray-900 mb-1">{name}</h3>
          {count !== undefined && (
            <div className="font-semibold text-lg">{count}</div>
          )}
          {metricValue && (
            <div className="font-semibold text-lg">{metricValue}</div>
          )}
        </div>
        {Icon && <Icon className="h-5 w-5 text-gray-500" />}
      </div>
      
      <div className="flex items-center justify-between mt-3">
        {status && (
          <Badge variant="outline" className={cn(
            "text-xs font-normal capitalize border-none", 
            status === "info" ? "text-blue-600" : ""
          )}>
            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusColor()}`}></div>
            {status}
          </Badge>
        )}
        
        {viewAllLink && (
          <span className="text-xs text-blue-600">View all</span>
        )}
      </div>
    </Card>
  );
};

export default StatusItem;

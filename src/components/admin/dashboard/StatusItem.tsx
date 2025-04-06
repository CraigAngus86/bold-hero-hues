
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SystemStatusItemProps } from '@/types/system/status';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export const StatusItem: React.FC<SystemStatusItemProps> = ({
  name,
  status,
  lastChecked,
  metricValue,
  icon: Icon,
  tooltip,
  count,
  color = 'bg-gray-100',
  viewAllLink
}) => {
  // Determine status color
  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'degraded':
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={cn("flex p-4 space-x-4 overflow-hidden border shadow-sm", color)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex-1">
              <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                  {Icon && <Icon className="w-5 h-5 text-gray-500" />}
                  <h3 className="font-medium text-sm">{name}</h3>
                </div>
                
                <div className="flex items-center">
                  {status && (
                    <Badge variant="secondary" className={cn("text-xs", getStatusColor())}>
                      {status}
                    </Badge>
                  )}
                  
                  {count !== undefined && (
                    <span className="ml-2 text-sm font-semibold">{count}</span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-end mt-2">
                <div className="text-sm text-gray-500">
                  {lastChecked && <div className="text-xs mt-1">Updated: {lastChecked}</div>}
                </div>
                
                {metricValue && <div className="text-xl font-bold">{metricValue}</div>}
                
                {viewAllLink && (
                  <a 
                    href={viewAllLink} 
                    className="text-xs text-blue-600 hover:underline flex items-center"
                  >
                    View all
                  </a>
                )}
              </div>
            </div>
          </TooltipTrigger>
          {tooltip && (
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </Card>
  );
};

export default StatusItem;

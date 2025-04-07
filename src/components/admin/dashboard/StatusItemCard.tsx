
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatTimeAgo } from '@/utils/date';
import { SystemStatusName } from '@/types/system/status';

export interface StatusItemProps {
  name: string;
  status: SystemStatusName;
  value: string | React.ReactNode;
  metricValue: string | React.ReactNode;
  tooltip?: string;
  lastChecked: string | Date;
  icon: React.ComponentType<any>;
  color: string;
  viewAllLink?: string;
}

const StatusItemCard: React.FC<StatusItemProps> = ({ 
  name, 
  status, 
  value, 
  metricValue, 
  tooltip, 
  lastChecked, 
  icon: IconComponent, 
  color,
  viewAllLink 
}) => {
  const statusColors = {
    healthy: 'bg-green-500',
    warning: 'bg-amber-500',
    degraded: 'bg-amber-300',
    critical: 'bg-red-500',
    unknown: 'bg-gray-500'
  };

  const colorVariants = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const lastCheckedDate = typeof lastChecked === 'string' ? new Date(lastChecked) : lastChecked;
  const formattedLastChecked = formatTimeAgo(typeof lastCheckedDate === 'string' ? lastCheckedDate : lastCheckedDate.toISOString());
  
  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: `var(--${color}-500)` }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${colorVariants[color as keyof typeof colorVariants] || colorVariants.gray}`}>
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-sm">{name}</h3>
              
              <div className="flex items-center mt-0.5">
                <div className={`h-2 w-2 rounded-full mr-1.5 ${statusColors[status] || 'bg-gray-500'}`} />
                <p className="text-lg font-semibold">{value}</p>
              </div>
            </div>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">{metricValue}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formattedLastChecked}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{tooltip || `Last checked ${formattedLastChecked}`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusItemCard;

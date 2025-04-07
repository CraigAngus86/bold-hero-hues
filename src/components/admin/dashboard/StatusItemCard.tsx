
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusItemProps } from '@/types/system/status';
import { cn } from '@/lib/utils';

const StatusItemCard: React.FC<StatusItemProps> = ({ 
  name, 
  status, 
  value,
  metricValue,
  tooltip,
  lastChecked,
  icon: Icon,
  color,
  viewAllLink,
  details
}) => {
  const statusColors = {
    healthy: "text-green-500",
    warning: "text-amber-500",
    critical: "text-red-500",
    unknown: "text-gray-400"
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3 items-center">
            {Icon && <div className={cn("p-2 rounded-lg", color ? `bg-${color}-100 text-${color}-500` : "bg-gray-100")}><Icon className="h-5 w-5" /></div>}
            <div>
              <h3 className="font-medium">{name}</h3>
              <p className={`text-sm ${statusColors[status] || "text-gray-500"}`}>
                {value}
              </p>
              {metricValue && (
                <p className="text-xs text-muted-foreground mt-1">
                  {metricValue} {tooltip && <span className="text-muted-foreground">{tooltip}</span>}
                </p>
              )}
              {lastChecked && (
                <p className="text-xs text-muted-foreground mt-1">
                  Last checked: {typeof lastChecked === 'string' ? lastChecked : lastChecked.toLocaleString()}
                </p>
              )}
            </div>
          </div>
          {details && (
            <div className="text-xs text-muted-foreground">
              {details}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusItemCard;

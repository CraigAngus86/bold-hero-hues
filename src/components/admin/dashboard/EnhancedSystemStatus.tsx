
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import { SystemStatusProps, SystemStatusItem } from '@/types/system/status';

export const EnhancedSystemStatus: React.FC<SystemStatusProps> = ({ systems, isLoading, lastUpdated, onRefresh }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'degraded':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-amber-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">System Status</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {systems.map((system: SystemStatusItem) => (
            <TooltipProvider key={system.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-between p-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      {system.icon && (
                        <div className="flex-shrink-0">
                          {React.createElement(system.icon as React.ElementType, { className: "h-4 w-4" })}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{system.name}</p>
                        <p className="text-xs text-gray-500">{system.metricValue}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={`text-xs ${getStatusColor(system.status)}`}>
                        <span className={`mr-1 inline-block h-2 w-2 rounded-full ${getStatusDot(system.status)}`}></span>
                        {system.status.charAt(0).toUpperCase() + system.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="text-xs">
                    <p>{system.tooltip || `Status information for ${system.name}`}</p>
                    {system.lastChecked && (
                      <p className="text-gray-500 mt-1">
                        Last checked: {formatDistanceToNow(new Date(system.lastChecked), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        
        {lastUpdated && (
          <div className="text-xs text-gray-500 mt-4">
            Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

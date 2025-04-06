
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SystemStatusItemProps, SystemStatusProps } from '@/types/system';

export const EnhancedSystemStatus: React.FC<SystemStatusProps> = ({
  systems,
  isLoading,
  lastUpdated,
  onRefresh
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Healthy</Badge>;
      case 'degraded':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Degraded</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string | Date | null) => {
    if (!timestamp) return 'Unknown';
    try {
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Unknown';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">System Status</CardTitle>
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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm text-gray-500">Checking system status...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {systems.map((system) => (
                <TooltipProvider key={system.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {system.icon || getStatusIcon(system.status)}
                          </div>
                          <div>
                            <p className="font-medium">{system.name}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>{formatTimestamp(system.lastChecked)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {system.metricValue && (
                            <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              {system.metricValue}
                            </span>
                          )}
                          {getStatusBadge(system.status)}
                        </div>
                      </div>
                    </TooltipTrigger>
                    {system.tooltip && (
                      <TooltipContent>
                        <p>{system.tooltip}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            {lastUpdated && (
              <div className="mt-4 pt-3 border-t text-xs text-gray-500 text-right">
                Last checked: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedSystemStatus;

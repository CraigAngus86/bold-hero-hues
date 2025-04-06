
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Database, Server, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LastUpdatedInfo } from '../common/LastUpdatedInfo';

export interface SystemStatusItemProps {
  name: string;
  status: 'online' | 'offline' | 'warning' | 'unknown';
  lastChecked: Date;
  metricValue?: string;
  icon?: React.ReactNode;
  tooltip?: string;
}

function SystemStatusItem({ name, status, lastChecked, metricValue, icon, tooltip }: SystemStatusItemProps) {
  const content = (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center">
        <div className="mr-3 text-muted-foreground">
          {icon || <Server className="h-4 w-4" />}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <LastUpdatedInfo lastUpdated={lastChecked} variant="inline" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {metricValue && <span className="text-xs text-muted-foreground">{metricValue}</span>}
        <Badge
          variant="outline"
          className={
            status === 'online'
              ? 'border-green-200 text-green-600 bg-green-50'
              : status === 'warning'
              ? 'border-amber-200 text-amber-600 bg-amber-50'
              : status === 'unknown'
              ? 'border-gray-200 text-gray-600 bg-gray-50'
              : 'border-red-200 text-red-600 bg-red-50'
          }
        >
          {status === 'online' ? (
            <CheckCircle className="h-3 w-3 mr-1" />
          ) : status === 'warning' ? (
            <AlertCircle className="h-3 w-3 mr-1" />
          ) : status === 'unknown' ? (
            <span className="h-3 w-3 mr-1">?</span>
          ) : (
            <AlertCircle className="h-3 w-3 mr-1" />
          )}
          {status === 'online' ? 'Online' : status === 'warning' ? 'Warning' : status === 'unknown' ? 'Unknown' : 'Offline'}
        </Badge>
      </div>
    </div>
  );
  
  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>{content}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
  
  return content;
}

export interface EnhancedSystemStatusProps {
  systems: SystemStatusItemProps[];
  isLoading?: boolean;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
}

export function EnhancedSystemStatus({ 
  systems, 
  isLoading = false,
  lastUpdated,
  onRefresh 
}: EnhancedSystemStatusProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          <CardDescription>Current status of connected services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center justify-between py-2 animate-pulse">
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-gray-200 rounded mr-3"></div>
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-100 rounded mt-1"></div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CardDescription>Current status of connected services</CardDescription>
          </div>
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={isLoading}
              className="h-7 px-2 py-0"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {systems.map((system) => (
            <SystemStatusItem key={system.name} {...system} />
          ))}
        </div>
        
        {lastUpdated && (
          <div className="mt-4 pt-3 border-t text-center">
            <LastUpdatedInfo lastUpdated={lastUpdated} variant="inline" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default EnhancedSystemStatus;

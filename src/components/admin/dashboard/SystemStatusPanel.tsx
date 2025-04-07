
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import StatusItems from "./StatusItems";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpIcon, ArrowDownIcon, RefreshCw } from "lucide-react";
import { SystemStatus, SystemStatusName, Service, SystemMetric } from '@/types/system/status';

export interface SystemStatusPanelProps {
  status: SystemStatus;
  isLoading?: boolean;
  onRefresh?: () => Promise<void>;
  error?: string | null;
}

const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ 
  status, 
  isLoading = false,
  onRefresh,
  error = null
}) => {
  const formatLastChecked = (service: Service) => {
    try {
      const date = new Date(service.lastChecked);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'unknown';
    }
  };
  
  const getStatusVariant = (statusName: SystemStatusName) => {
    switch (statusName) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'default';
      case 'critical':
        return 'destructive';
      case 'degraded':
        return 'default';
      case 'unknown':
        return 'outline';
      default:
        return 'outline';
    }
  };
  
  const formatChange = (metric: SystemMetric) => {
    const value = metric.change || 0;
    const isPositive = (metric.changeType === 'positive');
    
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {(metric.changeDirection === 'up' || !metric.changeDirection) ? 
          <ArrowUpIcon className="h-3 w-3 mr-1" /> : 
          <ArrowDownIcon className="h-3 w-3 mr-1" />
        }
        <span className="text-xs">{value}%</span>
      </span>
    );
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">System Status</CardTitle>
        <div className="flex items-center">
          <Badge
            className="mr-2"
            variant={getStatusVariant(status.overall_status)}
          >
            {status.overall_status.charAt(0).toUpperCase() + status.overall_status.slice(1)}
          </Badge>
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0" 
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        {error ? (
          <div className="text-red-500 mb-4 text-sm">{error}</div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{status.message}</p>
            
            <Tabs defaultValue="performance" className="space-y-4">
              <TabsList className="grid grid-cols-3 h-9">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
              </TabsList>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                  {status.metrics.performance && Array.isArray(status.metrics.performance) && status.metrics.performance.length > 0 ? (
                    status.metrics.performance.map((metric, i) => (
                      <Card key={i}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {metric.icon && <span>{metric.icon}</span>}
                              <span className="text-sm font-medium">{metric.name}</span>
                            </div>
                            {metric.change !== undefined && (
                              formatChange(metric)
                            )}
                          </div>
                          <div className="mt-1">
                            <span className="text-2xl font-bold">
                              {metric.value}
                              {metric.unit && <span className="text-sm ml-1">{metric.unit}</span>}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No performance metrics available</p>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 text-right mt-2">
                  Last updated: {status.last_updated ? new Date(status.last_updated).toLocaleTimeString() : 'unknown'}
                </div>
              </TabsContent>
              
              <TabsContent value="storage" className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                  {status.metrics.storage && Array.isArray(status.metrics.storage) && status.metrics.storage.length > 0 ? (
                    status.metrics.storage.map((metric, i) => (
                      <Card key={i}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {metric.icon && <span>{metric.icon}</span>}
                              <span className="text-sm font-medium">{metric.name}</span>
                            </div>
                            {metric.change !== undefined && (
                              formatChange(metric)
                            )}
                          </div>
                          <div className="mt-1">
                            <span className="text-2xl font-bold">
                              {metric.value}
                              {metric.unit && <span className="text-sm ml-1">{metric.unit}</span>}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No storage metrics available</p>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 text-right mt-2">
                  Last updated: {status.last_updated ? new Date(status.last_updated).toLocaleTimeString() : 'unknown'}
                </div>
              </TabsContent>
              
              <TabsContent value="usage" className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                  {status.metrics.usage && Array.isArray(status.metrics.usage) && status.metrics.usage.length > 0 ? (
                    status.metrics.usage.map((metric, i) => (
                      <Card key={i}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {metric.icon && <span>{metric.icon}</span>}
                              <span className="text-sm font-medium">{metric.name}</span>
                            </div>
                            {metric.change !== undefined && (
                              formatChange(metric)
                            )}
                          </div>
                          <div className="mt-1">
                            <span className="text-2xl font-bold">
                              {metric.value}
                              {metric.unit && <span className="text-sm ml-1">{metric.unit}</span>}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No usage metrics available</p>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 text-right mt-2">
                  Last updated: {status.last_updated ? new Date(status.last_updated).toLocaleTimeString() : 'unknown'}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="border-t pt-3 mt-3">
              <h4 className="text-sm font-medium mb-2">Services</h4>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {status.services.map((service, i) => (
                  <div key={i} className="border rounded-md p-2 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{service.name}</span>
                      <Badge 
                        variant={getStatusVariant(service.status as SystemStatusName)} 
                        className="text-xs"
                      >
                        {service.status}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      <div>Uptime: {service.uptime}%</div>
                      <div>Last check: {formatLastChecked(service)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {status.messages && status.messages.length > 0 && (
              <div className="border-t pt-3 mt-3">
                <h4 className="text-sm font-medium mb-2">Announcements & Alerts</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {status.messages.map((message, i) => (
                    <li key={i} className="bg-blue-50 border border-blue-100 p-2 rounded-md">
                      {message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
        
        <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
          <div>System uptime: {status.uptime} days</div>
          <div>Version: {status.version || 'Unknown'}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatusPanel;

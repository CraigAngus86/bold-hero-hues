
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, AlertCircle, RefreshCw, RotateCw, Clock, Server, Database, HardDrive } from 'lucide-react';
import { StatusItems } from './StatusItems';
import { formatDistanceToNow } from 'date-fns';
import { SystemStatus, SystemStatusName, Service, SystemMetric } from '@/types/system/status';

export interface SystemStatusPanelProps {
  status: SystemStatus;
  isLoading?: boolean;
  onRefresh?: () => void | Promise<void>;
  error?: string;
}

export const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ 
  status, 
  isLoading = false, 
  onRefresh, 
  error 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const getServiceIcon = (service: Service) => {
    switch (service.name.toLowerCase()) {
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'storage':
        return <HardDrive className="h-4 w-4" />;
      case 'api':
      case 'backend':
        return <Server className="h-4 w-4" />;
      default:
        return <Server className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: SystemStatusName) => {
    switch (status) {
      case 'healthy':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'maintenance':
        return <RotateCw className="h-4 w-4 text-blue-500" />;
      case 'offline':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderMetricItems = (metrics: SystemMetric[]) => {
    if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
      return <div className="text-gray-500 text-sm">No metrics available</div>;
    }

    return metrics.map((metric, index) => {
      const changeDirection = metric.changeDirection || (metric.change && metric.change > 0 ? 'up' : metric.change && metric.change < 0 ? 'down' : 'none');
      
      return (
        <div key={index} className="flex items-center justify-between p-2 border-b last:border-0">
          <div className="flex items-center space-x-2">
            {metric.icon ? metric.icon : <div className="w-4 h-4"></div>}
            <span className="font-medium">{metric.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>{metric.value}{metric.unit || ''}</span>
            {metric.change !== undefined && (
              <Badge variant={changeDirection === 'up' ? 'destructive' : changeDirection === 'down' ? 'success' : 'secondary'}>
                {changeDirection === 'up' ? '↑' : changeDirection === 'down' ? '↓' : '='} {Math.abs(metric.change)}%
              </Badge>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">System Status</CardTitle>
        <Badge variant={
          status.overall_status === 'healthy' ? 'success' :
          status.overall_status === 'warning' ? 'warning' :
          status.overall_status === 'error' || status.overall_status === 'critical' ? 'destructive' :
          status.overall_status === 'maintenance' ? 'secondary' : 'outline'
        } className="ml-auto">
          {status.overall_status === 'healthy' ? 'All Systems Normal' :
           status.overall_status === 'warning' ? 'Performance Issues' :
           status.overall_status === 'error' ? 'System Errors' : 
           status.overall_status === 'critical' ? 'Critical Failure' :
           status.overall_status === 'maintenance' ? 'Under Maintenance' : 'Status Unknown'}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1 rounded-lg border p-3">
                  <div className="text-sm font-medium">Uptime</div>
                  <div className="flex items-baseline">
                    <div className="text-2xl font-semibold">{status.metrics.uptime}</div>
                    <div className="ml-1 text-xs">days</div>
                  </div>
                </div>
                <div className="flex flex-col space-y-1 rounded-lg border p-3">
                  <div className="text-sm font-medium">Response Time</div>
                  <div className="flex items-baseline">
                    <div className="text-2xl font-semibold">{status.metrics.responseTime}</div>
                    <div className="ml-1 text-xs">ms</div>
                  </div>
                </div>
                <div className="flex flex-col space-y-1 rounded-lg border p-3">
                  <div className="text-sm font-medium">Errors (24h)</div>
                  <div className="flex items-baseline">
                    <div className="text-2xl font-semibold">{status.metrics.errors24h}</div>
                    <div className="ml-1 text-xs">errors</div>
                  </div>
                </div>
                <div className="flex flex-col space-y-1 rounded-lg border p-3">
                  <div className="text-sm font-medium">Requests (24h)</div>
                  <div className="flex items-baseline">
                    <div className="text-2xl font-semibold">{status.metrics.totalRequests24h}</div>
                    <div className="ml-1 text-xs">requests</div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border">
                <div className="p-3 border-b">
                  <h3 className="font-semibold">Core Services</h3>
                </div>
                <div>
                  {status.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border-b last:border-0">
                      <div className="flex items-center">
                        {getServiceIcon(service)}
                        <span className="ml-2">{service.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          service.status === 'healthy' ? 'success' :
                          service.status === 'warning' ? 'warning' :
                          service.status === 'maintenance' ? 'secondary' :
                          service.status === 'error' || service.status === 'critical' ? 'destructive' : 'outline'
                        }>
                          {getStatusIcon(service.status)}
                          <span className="ml-1">
                            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                          </span>
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Updated {formatDistanceToNow(new Date(service.lastChecked), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="mt-1 text-sm">{error}</p>
                </div>
              )}
              
              {status.messages && status.messages.length > 0 && (
                <div className="rounded-lg border p-3">
                  <h3 className="font-semibold mb-2">Status Messages</h3>
                  <ul className="space-y-1 text-sm">
                    {status.messages.map((message, i) => (
                      <li key={i} className="flex items-start">
                        <AlertTriangle className="h-4 w-4 mr-1 mt-0.5 text-amber-500 flex-shrink-0" />
                        <span>{message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {status.last_updated && (
                <div className="text-xs text-muted-foreground text-right">
                  Last updated {formatDistanceToNow(new Date(status.last_updated), { addSuffix: true })}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="performance" className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {status.metrics.performance && Array.isArray(status.metrics.performance) && status.metrics.performance.map((metric, i) => (
                  <div key={i} className="rounded-lg border p-3">
                    <div className="text-sm font-medium">{metric.name}</div>
                    <div className="mt-1 flex items-baseline">
                      <div className="text-xl font-semibold">{metric.value}{metric.unit || ''}</div>
                      {metric.change !== undefined && (
                        <Badge className="ml-2" variant={metric.changeType === 'positive' ? 'success' : metric.changeType === 'negative' ? 'destructive' : 'secondary'}>
                          {metric.changeDirection === 'up' ? '↑' : '↓'} {Math.abs(metric.change)}%
                        </Badge>
                      )}
                    </div>
                    {metric.description && <div className="mt-1 text-xs text-gray-500">{metric.description}</div>}
                  </div>
                ))}
              </div>

              <div className="rounded-lg border">
                <div className="p-3 border-b">
                  <h3 className="font-semibold">System Performance</h3>
                </div>
                {status.metrics.performance && Array.isArray(status.metrics.performance) ? (
                  <div className="divide-y">
                    {renderMetricItems(status.metrics.performance)}
                  </div>
                ) : (
                  <div className="p-3 text-sm text-gray-500">No performance metrics available</div>
                )}
              </div>
              
              {status.last_updated && (
                <div className="text-xs text-muted-foreground text-right">
                  Last updated {formatDistanceToNow(new Date(status.last_updated), { addSuffix: true })}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="services" className="p-4">
            <div className="space-y-4">
              {status.services.map((service, index) => (
                <Card key={index}>
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getServiceIcon(service)}
                        <span className="ml-2 font-semibold">{service.name}</span>
                      </div>
                      <Badge variant={
                        service.status === 'healthy' ? 'success' :
                        service.status === 'warning' ? 'warning' :
                        service.status === 'maintenance' ? 'secondary' :
                        service.status === 'error' || service.status === 'critical' ? 'destructive' : 'outline'
                      }>
                        {getStatusIcon(service.status)}
                        <span className="ml-1">{service.status.charAt(0).toUpperCase() + service.status.slice(1)}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="py-0">
                    {service.message && (
                      <div className="text-sm mb-3">{service.message}</div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Last checked {formatDistanceToNow(new Date(service.lastChecked), { addSuffix: true })}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Storage Status</CardTitle>
                </CardHeader>
                <CardContent className="py-0">
                  {status.metrics.storage && Array.isArray(status.metrics.storage) ? (
                    <div className="divide-y border rounded-lg">
                      {renderMetricItems(status.metrics.storage)}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No storage metrics available</div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent className="py-0">
                  {status.metrics.usage && Array.isArray(status.metrics.usage) ? (
                    <div className="divide-y border rounded-lg">
                      {renderMetricItems(status.metrics.usage)}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No usage statistics available</div>
                  )}
                </CardContent>
              </Card>
              
              {status.last_updated && (
                <div className="text-xs text-muted-foreground text-right">
                  Last updated {formatDistanceToNow(new Date(status.last_updated), { addSuffix: true })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="text-xs text-muted-foreground flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>Uptime: {status.uptime} days</span>
        </div>
        {status.version && (
          <div className="text-xs text-muted-foreground">{status.version}</div>
        )}
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SystemStatusPanel;

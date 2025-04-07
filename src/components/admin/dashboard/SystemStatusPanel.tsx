
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Database, Server, Wifi, Activity, GaugeCircle } from "lucide-react";
import { formatTimeAgo } from '@/utils/date';
import { SystemStatus, SystemStatusType, SystemMetric } from '@/types/system/status';
import StatusItemCard from './StatusItemCard';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

interface SystemStatusPanelProps {
  status: SystemStatus;
  isLoading: boolean;
  onRefresh: () => void;
  error?: string;
}

const getStatusColor = (status: SystemStatusType): string => {
  switch (status) {
    case "healthy":
      return "bg-green-500";
    case "warning":
      return "bg-yellow-500";
    case "critical":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getChangeArrow = (direction?: 'up' | 'down' | 'stable') => {
  if (!direction || direction === 'stable') return null;
  return direction === 'up' 
    ? <span className="text-green-500">↑</span> 
    : <span className="text-red-500">↓</span>;
};

const getChangeColor = (metric: SystemMetric) => {
  if (!metric.changeDirection || metric.changeDirection === 'stable') return 'text-gray-500';
  
  // For some metrics, "up" is negative (like response time)
  const isNegativeMetric = metric.name?.toLowerCase().includes('time') || 
                         metric.name?.toLowerCase().includes('load');
  
  if (isNegativeMetric) {
    return metric.changeDirection === 'up' ? 'text-red-500' : 'text-green-500';
  }
  
  return metric.changeDirection === 'up' ? 'text-green-500' : 'text-red-500';
};

const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ 
  status, 
  isLoading, 
  onRefresh,
  error 
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-500">Loading system status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 text-5xl mb-4">!</div>
        <h3 className="font-semibold text-xl mb-2">Error Loading Status</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={onRefresh}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(status.overall_status)}`}></div>
          <h3 className="text-lg font-medium">
            System Status: <span className="font-semibold capitalize">{status.overall_status}</span>
          </h3>
        </div>
        <div className="flex items-center space-x-4">
          {status.version && (
            <Badge variant="outline">v{status.version}</Badge>
          )}
          <span className="text-sm text-gray-500">
            Updated {formatTimeAgo(status.last_updated)}
          </span>
          <Button size="sm" variant="outline" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatusItemCard 
              name="Server" 
              status={status.services?.[0]?.status || 'unknown'} 
              value={status.services?.[0]?.status === 'healthy' ? 'Online' : 'Issues Detected'} 
              metricValue={status.services?.[0]?.response_time ? `${status.services[0].response_time}ms` : ''}
              icon={Server} 
              tooltip="Main application server status" 
              lastChecked={status.last_updated}
            />
            
            <StatusItemCard 
              name="Database" 
              status={status.services?.[1]?.status || 'unknown'} 
              value={status.services?.[1]?.status === 'healthy' ? 'Connected' : 'Issues Detected'} 
              metricValue={status.services?.[1]?.response_time ? `${status.services[1].response_time}ms` : ''}
              icon={Database} 
              tooltip="Database connection status" 
              lastChecked={status.last_updated}
            />
            
            <StatusItemCard 
              name="API" 
              status={status.services?.[2]?.status || 'unknown'} 
              value={status.services?.[2]?.status === 'healthy' ? 'Available' : 'Issues Detected'} 
              metricValue={status.services?.[2]?.response_time ? `${status.services[2].response_time}ms` : ''}
              icon={Wifi} 
              tooltip="External API services status" 
              lastChecked={status.last_updated}
            />
            
            <StatusItemCard 
              name="Storage" 
              status={status.services?.[3]?.status || 'unknown'} 
              value={status.services?.[3]?.status === 'healthy' ? 'Available' : 'Issues Detected'} 
              icon={BarChart} 
              metricValue="" 
              tooltip="File storage system status" 
              lastChecked={status.last_updated}
            />
          </div>
          
          {status.metrics?.performance?.[0] && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">System Load</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {status.metrics.performance.map((metric, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{metric.name}</div>
                        <div className="flex items-center text-sm">
                          <span>{metric.value}{metric.unit || ''}</span>
                          <span className={`ml-2 ${getChangeColor(metric)}`}>
                            {getChangeArrow(metric.changeDirection)}
                            {metric.change ? `${metric.change}%` : ''}
                          </span>
                        </div>
                      </div>
                      <Progress value={Number(metric.value)} className="h-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {status.messages && status.messages.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">System Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {status.messages.map((message, index) => (
                    <li key={index} className="text-sm border-l-4 border-blue-500 pl-3 py-1">{message}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {status.metrics?.performance?.map((metric, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-gray-500" />
                      <h3 className="font-medium">{metric.name}</h3>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold text-lg">{metric.value}{metric.unit || ''}</span>
                      <span className={`ml-2 ${getChangeColor(metric)}`}>
                        {getChangeArrow(metric.changeDirection)}
                        {metric.change ? `${metric.change}%` : ''}
                      </span>
                    </div>
                  </div>
                  {typeof metric.value === 'number' && (
                    <Progress value={metric.value} max={100} className="h-1 mt-1" />
                  )}
                  {metric.description && (
                    <p className="text-sm text-gray-500 mt-2">{metric.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="storage">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {status.metrics?.storage?.map((metric, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <GaugeCircle className="mr-2 h-5 w-5 text-gray-500" />
                      <h3 className="font-medium">{metric.name}</h3>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold text-lg">{metric.value}{metric.unit || ''}</span>
                      <span className={`ml-2 ${getChangeColor(metric)}`}>
                        {getChangeArrow(metric.changeDirection)}
                        {metric.change ? `${metric.change}%` : ''}
                      </span>
                    </div>
                  </div>
                  {typeof metric.value === 'number' && (
                    <Progress value={metric.value} className="h-1 mt-1" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 text-center text-gray-500 text-xs">
        <p>System uptime: {status.uptime ? `${status.uptime} days` : 'Unknown'}</p>
        {status.version && (
          <p className="mt-1">Running version {status.version}</p>
        )}
      </div>
    </div>
  );
};

export default SystemStatusPanel;

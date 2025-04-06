
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { SystemStatusData } from '@/services/logs/systemLogsService';

interface SystemStatusPanelProps {
  data: SystemStatusData;
  isLoading: boolean;
  onRefresh: () => void;
}

const SystemStatusPanel = ({ data, isLoading, onRefresh }: SystemStatusPanelProps) => {
  const getStatusColor = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy': return 'bg-green-500/10 text-green-700 border-green-500/50';
      case 'warning': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/50';
      case 'critical': return 'bg-red-500/10 text-red-700 border-red-500/50';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">System Status</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(data.status)}
            <div>
              <p className="font-semibold">
                System is {data.status === 'healthy' ? 'operating normally' : data.status === 'warning' ? 'experiencing issues' : 'experiencing problems'}
              </p>
              <p className="text-sm text-muted-foreground">
                Last checked: {new Date(data.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
            <Badge className={`ml-auto ${getStatusColor(data.status)}`}>
              {data.status.toUpperCase()}
            </Badge>
          </div>
          
          <Tabs defaultValue="metrics">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
              <TabsTrigger value="incidents">
                Incidents
                {(data.metrics.errors24h > 0) && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {data.metrics.errors24h}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="p-1">
              <div className="grid grid-cols-2 gap-2">
                <Card>
                  <CardContent className="p-3">
                    <div className="text-xs text-muted-foreground">CPU Usage</div>
                    <div className="text-lg font-semibold">{data.metrics.cpuUsage}%</div>
                    <div className="h-1 w-full bg-gray-200 rounded-full mt-1">
                      <div 
                        className={`h-1 rounded-full ${data.metrics.cpuUsage > 80 ? 'bg-red-500' : data.metrics.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                        style={{ width: `${data.metrics.cpuUsage}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="text-xs text-muted-foreground">Memory Usage</div>
                    <div className="text-lg font-semibold">{data.metrics.memoryUsage}%</div>
                    <div className="h-1 w-full bg-gray-200 rounded-full mt-1">
                      <div 
                        className={`h-1 rounded-full ${data.metrics.memoryUsage > 80 ? 'bg-red-500' : data.metrics.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                        style={{ width: `${data.metrics.memoryUsage}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="text-xs text-muted-foreground">Disk Usage</div>
                    <div className="text-lg font-semibold">{data.metrics.diskUsage}%</div>
                    <div className="h-1 w-full bg-gray-200 rounded-full mt-1">
                      <div 
                        className={`h-1 rounded-full ${data.metrics.diskUsage > 80 ? 'bg-red-500' : data.metrics.diskUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                        style={{ width: `${data.metrics.diskUsage}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="text-xs text-muted-foreground">Active Users</div>
                    <div className="text-lg font-semibold">{data.metrics.activeUsers}</div>
                    <div className="text-xs text-muted-foreground mt-1">Current users online</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="incidents" className="p-1">
              {data.metrics.errors24h === 0 && data.metrics.warnings24h === 0 ? (
                <div className="text-center p-4">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium">No incidents in the last 24 hours</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.metrics.errors24h > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-red-500/10 text-red-700 rounded-md">
                      <AlertCircle className="h-4 w-4" />
                      <span>{data.metrics.errors24h} errors in the last 24 hours</span>
                    </div>
                  )}
                  {data.metrics.warnings24h > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-yellow-500/10 text-yellow-700 rounded-md">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{data.metrics.warnings24h} warnings in the last 24 hours</span>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatusPanel;

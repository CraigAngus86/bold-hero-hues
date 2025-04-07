
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Server, Database, HardDrive, Users, Clock } from 'lucide-react';
import { SystemStatus } from '@/types/system/status';
import { formatDistanceToNow } from 'date-fns';

interface SystemStatusPanelProps {
  status?: SystemStatus;
  isLoading: boolean;
  onRefresh: () => void;
  error: Error | null;
}

const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({
  status,
  isLoading,
  onRefresh,
  error
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500">Healthy</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-500 text-white">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getServiceIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'database':
        return <Database className="h-4 w-4 mr-2" />;
      case 'api server':
        return <Server className="h-4 w-4 mr-2" />;
      case 'storage':
        return <HardDrive className="h-4 w-4 mr-2" />;
      default:
        return <Server className="h-4 w-4 mr-2" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''}`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded w-1/6"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="text-center py-10">
        <p>No system status data available.</p>
        <Button 
          onClick={onRefresh} 
          variant="outline"
          className="mt-2"
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-medium mr-2">System Status:</h3>
          {getStatusBadge(status.overall_status)}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>Last checked: {
            status.last_updated ? 
              formatDistanceToNow(new Date(status.last_updated), { addSuffix: true })
              : 'Unknown'
          }</span>
          <Button 
            onClick={onRefresh} 
            size="sm" 
            variant="ghost"
            className="ml-2"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Services Section */}
        <div>
          <h4 className="text-sm font-medium mb-2">Services</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {status.services.map((service, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      {getServiceIcon(service.name)}
                      <h5 className="font-medium text-sm">{service.name}</h5>
                    </div>
                    {getStatusBadge(service.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{service.message}</p>
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Uptime: {formatUptime(service.uptime)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Metrics Section */}
        <div>
          <h4 className="text-sm font-medium mb-2">Metrics</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Card>
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-sm font-medium">Performance</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ul className="text-sm space-y-1">
                  {status.metrics.performance.map((metric, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span className="text-muted-foreground">{metric.name}</span>
                      <span className="font-medium">{metric.value} {metric.unit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-sm font-medium">Storage</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ul className="text-sm space-y-1">
                  {status.metrics.storage.map((metric, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span className="text-muted-foreground">{metric.name}</span>
                      <span className="font-medium">{metric.value} {metric.unit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-sm font-medium">Usage</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ul className="text-sm space-y-1">
                  {status.metrics.usage.map((metric, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span className="text-muted-foreground">{metric.name}</span>
                      <span className="font-medium">{metric.value} {metric.unit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Recent Logs Section */}
        <div>
          <h4 className="text-sm font-medium mb-2">Recent Logs</h4>
          <Card>
            <CardContent className="p-3">
              <ul className="divide-y divide-gray-100">
                {status.logs.slice(0, 3).map((log) => (
                  <li key={log.id} className="py-2 first:pt-0 last:pb-0">
                    <div className="flex items-start">
                      <div className={`mt-1 h-2 w-2 rounded-full mr-2 ${
                        log.type === 'info' ? 'bg-blue-500' : 
                        log.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="text-sm">{log.message}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span className="mr-2">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          <span className="bg-gray-100 px-1 rounded">{log.source}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusPanel;

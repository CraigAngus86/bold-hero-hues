
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { SystemStatus } from '@/types/system/status';
import StatusItem from './StatusItem';

interface SystemStatusPanelProps {
  data: SystemStatus;
  isLoading: boolean;
  onRefresh: () => void;
}

const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ data, isLoading, onRefresh }) => {
  const formatUptime = (uptime: number | undefined) => {
    if (!uptime) return 'Unknown';
    return uptime.toFixed(2) + '%';
  };

  const getStatusBadge = () => {
    if (!data) return null;
    
    const isHealthy = data.status === 'operational';
    
    return (
      <Badge variant={isHealthy ? "outline" : "destructive"} className="ml-2">
        <div className={`w-2 h-2 rounded-full mr-1 ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
        {isHealthy ? 'All Systems Normal' : 'Issues Detected'}
      </Badge>
    );
  };

  const statusItems = data && data.components ? data.components.map((component, index) => (
    <StatusItem
      key={index}
      name={component.name}
      status={component.status}
    />
  )) : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-xl font-bold">System Status</CardTitle>
          {getStatusBadge()}
        </div>
        <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">CPU Usage</p>
                      <p className="text-2xl font-bold">
                        {data && data.metrics ? `${data.metrics.cpuUsage}%` : "N/A"}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${data && data.metrics && data.metrics.cpuUsage < 80 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Memory Usage</p>
                      <p className="text-2xl font-bold">
                        {data && data.metrics ? `${data.metrics.memoryUsage}%` : "N/A"}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${data && data.metrics && data.metrics.memoryUsage < 80 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Disk Usage</p>
                      <p className="text-2xl font-bold">
                        {data && data.metrics ? `${data.metrics.diskUsage}%` : "N/A"}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${data && data.metrics && data.metrics.diskUsage < 80 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {data && data.incidents && data.incidents.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Active Incidents</h3>
                {data.incidents.map((incident, i) => (
                  <Card key={i} className="mb-3 border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="text-red-500 mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">{incident.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{incident.message}</p>
                          <div className="flex items-center mt-2">
                            <Badge variant="outline" className="text-xs">
                              {incident.status}
                            </Badge>
                            <span className="text-xs text-gray-500 ml-2">
                              Updated {new Date(incident.updatedAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-gray-500">Uptime</p>
                  <div className="flex items-center mt-1">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-2xl font-bold">{data && data.metrics ? formatUptime(data.metrics.uptime) : "N/A"}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-gray-500">Response Time</p>
                  <p className="text-2xl font-bold">{data && data.metrics ? `${data.metrics.responseTime}ms` : "N/A"}</p>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <p className="text-2xl font-bold">{data && data.metrics ? data.metrics.activeUsers : "N/A"}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemStatusPanel;

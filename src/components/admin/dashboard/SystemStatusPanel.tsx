
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Check, AlertTriangle, X } from 'lucide-react';
import { SystemStatus } from '@/types/system';

interface SystemStatusPanelProps {
  data: SystemStatus;
  isLoading: boolean;
  onRefresh: () => void;
}

const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ data, isLoading, onRefresh }) => {
  const renderStatusIcon = (isHealthy: boolean) => {
    if (isHealthy) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    return <X className="h-4 w-4 text-red-500" />;
  };

  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'operational':
      case 'online':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>;
      case 'degraded':
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">{status}</Badge>;
      case 'offline':
      case 'error':
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">System Status</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">System Components</h3>
              <ul className="mt-2 space-y-2">
                {data.components.map((component) => (
                  <li key={component.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      {renderStatusIcon(component.isHealthy)}
                      <span className="ml-2">{component.name}</span>
                    </span>
                    {renderStatusBadge(component.status)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium">Last Updated</h3>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(data.lastUpdated).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Resource Usage</h3>
              <ul className="mt-2 space-y-2">
                <li className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>{data.metrics.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        data.metrics.cpuUsage > 80
                          ? 'bg-red-500'
                          : data.metrics.cpuUsage > 60
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${data.metrics.cpuUsage}%` }}
                    />
                  </div>
                </li>
                <li className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>{data.metrics.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        data.metrics.memoryUsage > 85
                          ? 'bg-red-500'
                          : data.metrics.memoryUsage > 70
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${data.metrics.memoryUsage}%` }}
                    />
                  </div>
                </li>
                <li className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Disk Usage</span>
                    <span>{data.metrics.diskUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        data.metrics.diskUsage > 90
                          ? 'bg-red-500'
                          : data.metrics.diskUsage > 75
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${data.metrics.diskUsage}%` }}
                    />
                  </div>
                </li>
              </ul>
            </div>
            
            {data.incidents.length > 0 && (
              <div>
                <h3 className="text-sm font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                  Active Incidents ({data.incidents.length})
                </h3>
                <ul className="mt-2 space-y-2">
                  {data.incidents.map((incident) => (
                    <li key={incident.id} className="text-sm border-l-2 border-yellow-500 pl-2">
                      <p className="font-medium">{incident.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(incident.date).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatusPanel;

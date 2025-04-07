
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Server } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert'; 
import StatusItem from './StatusItem';
import { SystemStatus } from '@/types/system/status';

interface SystemStatusPanelProps {
  status: SystemStatus | null;
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
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load system status: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading || !status) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-primary mr-2" />
        <p className="text-gray-500">Loading system status...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Server className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-lg font-medium">System Status</h3>
        </div>
        <Button size="sm" variant="outline" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {status.services.map((service) => (
          <StatusItem 
            key={service.name}
            status={service.status}
            label={service.name}
            description={service.message}
            lastChecked={service.lastChecked}
          />
        ))}
      </div>
      
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-500 mb-2">System Performance</h4>
        <div className="grid grid-cols-3 gap-4">
          {status.metrics.performance.map((metric) => (
            <Card key={metric.name}>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-500">{metric.name}</p>
                <p className="text-2xl font-semibold mt-1">
                  {metric.value}{metric.unit}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemStatusPanel;


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
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load system status: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Server className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-lg font-medium">System Status</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh} 
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : status ? (
          <div className="grid gap-3">
            <StatusItem 
              status={status.database.status} 
              label="Database" 
              description={`Last checked: ${status.database.lastChecked.toLocaleTimeString()}`}
            />
            <StatusItem 
              status={status.api.status} 
              label="API" 
              description={`Last checked: ${status.api.lastChecked.toLocaleTimeString()}`}
            />
            <StatusItem 
              status={status.storage.status} 
              label="Storage" 
              description={`Last checked: ${status.storage.lastChecked.toLocaleTimeString()}`}
            />
            <StatusItem 
              status={status.auth.status} 
              label="Authentication" 
              description={`Last checked: ${status.auth.lastChecked.toLocaleTimeString()}`}
            />
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No status information available
          </div>
        )}
        
        {status && (
          <div className="mt-4 pt-3 border-t text-xs text-gray-500 flex justify-between">
            <span>Last updated: {status.lastUpdated.toLocaleString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemStatusPanel;

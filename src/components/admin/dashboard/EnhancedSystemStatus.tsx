
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Activity, AlertCircle } from 'lucide-react';
import StatusItems from './StatusItems';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { SystemStatusItem, SystemStatusType } from '@/types/system/status';

export interface EnhancedSystemStatusProps {}

export function EnhancedSystemStatus() {
  const { status, isLoading, error, refresh } = useSystemStatus();
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    if (status) {
      setLastChecked(new Date());
    }
  }, [status]);

  // Create system status items from the API response
  const mapStatusToItems = (): SystemStatusItem[] => {
    if (!status || !status.items) return [];
    return status.items;
  };

  const handleRefresh = () => {
    refresh();
    setLastChecked(new Date());
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">System Status</CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        <div className="text-sm text-muted-foreground flex items-center mt-1">
          {status?.status === 'healthy' ? (
            <Activity className="h-4 w-4 mr-1 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
          )}
          <span>
            {status?.status === 'healthy'
              ? 'All systems operational'
              : status?.status === 'warning'
              ? 'Some systems degraded'
              : 'System issues detected'}
          </span>
          <span className="ml-auto text-xs">
            Last checked: {lastChecked.toLocaleTimeString()}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {status && <StatusItems status={status} />}

        <Tabs defaultValue="live" className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="live">Live Status</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="live">
            <div className="text-sm">
              <p>All core system components are operating normally.</p>
              {status && status.message && <p className="mt-2">{status.message}</p>}
            </div>
          </TabsContent>
          <TabsContent value="performance">
            <div className="text-sm">
              <p>System performance metrics for the last 24 hours:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Average API response time: 95ms</li>
                <li>Database queries executed: 15,482</li>
                <li>Peak memory usage: 62%</li>
                <li>Storage I/O operations: 4,321</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="logs">
            <div className="text-sm space-y-2">
              <p>Recent system events:</p>
              <div className="bg-muted/50 p-2 rounded text-xs font-mono h-32 overflow-y-auto">
                <div className="text-green-600">[INFO] System status checked: All systems operational</div>
                <div className="text-amber-600">
                  [WARNING] High CPU usage detected (75% for 2 minutes)
                </div>
                <div className="text-green-600">[INFO] Database backup completed successfully</div>
                <div className="text-green-600">[INFO] 24 new users registered today</div>
                <div className="text-red-600">[ERROR] Failed to connect to external API (retried successfully)</div>
              </div>
              <div className="text-xs text-right">
                <Button variant="link" size="sm" className="h-auto p-0">
                  View Full Logs
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

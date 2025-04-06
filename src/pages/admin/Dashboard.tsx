
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import SystemStatusPanel from '@/components/admin/dashboard/SystemStatusPanel';
import RecentActivityPanel from '@/components/admin/dashboard/RecentActivityPanel';
import QuickStatsPanel from '@/components/admin/dashboard/QuickStatsPanel';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { SystemMetrics } from '@/types/system/status';

const Dashboard = () => {
  const { 
    data: statusData, 
    isLoading: statusLoading, 
    error: statusError, 
    refresh: refreshStatus 
  } = useSystemStatus();
  
  // Safely access metrics data
  const getMetricValue = (metric: keyof SystemMetrics | undefined, defaultValue: string | number = '0') => {
    if (!statusData?.metrics || metric === undefined) return defaultValue;
    return (statusData.metrics as any)[metric] || defaultValue;
  };
  
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <Button variant="outline" onClick={refreshStatus} disabled={statusLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${statusLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {statusError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center gap-3 text-red-800">
              <AlertTriangle />
              <div>
                <p>Failed to load system status</p>
                <p className="text-sm text-red-600">{String(statusError)}</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {statusData && (
              <SystemStatusPanel 
                data={statusData} 
                isLoading={statusLoading} 
                onRefresh={refreshStatus}
              />
            )}
            
            <QuickStatsPanel />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Performance metrics cards */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    CPU Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statusLoading ? (
                      <div className="h-8 w-16 animate-pulse bg-gray-200 rounded"></div>
                    ) : (
                      `${statusData?.metrics?.cpuUsage || 0}%`
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Healthy threshold: &lt;80%
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Memory Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statusLoading ? (
                      <div className="h-8 w-16 animate-pulse bg-gray-200 rounded"></div>
                    ) : (
                      `${statusData?.metrics?.memoryUsage || 0}%`
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Healthy threshold: &lt;85%
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Disk Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statusLoading ? (
                      <div className="h-8 w-16 animate-pulse bg-gray-200 rounded"></div>
                    ) : (
                      `${statusData?.metrics?.diskUsage || 0}%`
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Healthy threshold: &lt;90%
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statusLoading ? (
                      <div className="h-8 w-16 animate-pulse bg-gray-200 rounded"></div>
                    ) : (
                      statusData?.metrics?.activeUsers || 0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current online users
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <RecentActivityPanel />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card className="p-8">
              <p className="text-center text-muted-foreground">
                Analytics dashboard is coming soon
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Dashboard;

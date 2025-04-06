import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import SystemStatusPanel from '@/components/admin/dashboard/SystemStatusPanel';
import RecentActivityPanel from '@/components/admin/dashboard/RecentActivityPanel';
import QuickStatsPanel from '@/components/admin/dashboard/QuickStatsPanel';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { SystemMetrics } from '@/types/system/status';
import AdminLayout from '@/components/admin/layout';
import { CalendarDays, FileText, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const initialSystemStatus: SystemStatus = {
    status: 'unknown',
    lastUpdated: new Date().toISOString(),
    metrics: {
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      activeUsers: 0,
      responseTime: 0,
      uptime: 0,
      fixturesCount: 0,
      newsCount: 0
    }
  };
  
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(initialSystemStatus);
  
  const { 
    data: statusData, 
    isLoading: statusLoading, 
    error: statusError, 
    refresh: refreshStatus 
  } = useSystemStatus();
  
  const getMetricValue = (metric: keyof SystemMetrics | undefined, defaultValue: string | number = '0') => {
    if (!statusData?.metrics || metric === undefined) return defaultValue;
    return (statusData.metrics as any)[metric] || defaultValue;
  };
  
  return (
    <AdminLayout>
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Fixtures
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStatus.metrics?.fixturesCount || 0}
            </div>
            <p className="text-xs text-gray-500">
              Upcoming matches in the system
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/fixtures">Manage Fixtures</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              News Articles
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStatus.metrics?.newsCount || 0}
            </div>
            <p className="text-xs text-gray-500">
              Published articles on the site
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/news">Manage News</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              User Activity
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStatus.metrics?.dailyActiveUsers || 0}
            </div>
            <p className="text-xs text-gray-500">
              Daily active users
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/users">User Details</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

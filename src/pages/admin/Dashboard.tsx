
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SystemStatusPanel from '@/components/admin/dashboard/SystemStatusPanel';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import { useDashboardRefresh } from '@/hooks/useDashboardRefresh';

const Dashboard = () => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const { refresh, status, logs } = useDashboardRefresh();

  // Make this function async to handle the Promise
  const handleRefresh = async (): Promise<void> => {
    await refresh();
    // Return a resolved promise to satisfy the Promise<void> return type
    return Promise.resolve();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-5 md:flex-row md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your system and recent activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <QuickActions onRefresh={handleRefresh} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        {/* Stats Grid would go here */}
      </div>

      {/* System Status Card */}
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">System Status</CardTitle>
          <CardDescription>
            Current health and performance of the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SystemStatusPanel />
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          {/* Overview Content */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system events</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {logs.slice(0, 5).map(log => (
                    <li key={log.id} className="border-b pb-2 last:border-0">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        log.type === 'info' ? 'bg-blue-500' : 
                        log.type === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm">{log.message}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="metrics" className="mt-4">
          {/* Metrics Content */}
          <div className="text-center p-4">Metrics tab content</div>
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          {/* Activity Content */}
          <div className="text-center p-4">Activity tab content</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;

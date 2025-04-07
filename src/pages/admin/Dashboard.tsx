
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverviewTab } from '@/components/admin/dashboard/OverviewTab';
import { MetricsTab } from '@/components/admin/dashboard/MetricsTab';
import { SystemStatusPanel } from '@/components/admin/dashboard/SystemStatusPanel';
import { ActivityLogPanel } from '@/components/admin/dashboard/ActivityLogPanel';
import { QuickActions } from '@/components/admin/dashboard/QuickActions';
import { StatsGrid } from '@/components/admin/dashboard/StatsGrid';
import { RecentActivity } from '@/components/admin/dashboard/RecentActivity';
import { useDashboardRefresh } from '@/hooks/useDashboardRefresh';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { refreshData, setRefreshData } = useDashboardRefresh();

  // Make this function async to handle the Promise
  const handleRefresh = async (): Promise<void> => {
    setRefreshData(true);
    // Return a resolved promise to satisfy the Promise<void> return type
    return Promise.resolve();
  };

  return (
    <AdminLayout>
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
        <StatsGrid />
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
          <OverviewTab refreshData={refreshData} setRefreshData={setRefreshData} />
        </TabsContent>
        <TabsContent value="metrics" className="mt-4">
          <MetricsTab refreshData={refreshData} setRefreshData={setRefreshData} />
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <ActivityLogPanel />
        </TabsContent>
      </Tabs>

      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Recent Activity</CardTitle>
          <CardDescription>Latest updates and changes to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivity />
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default Dashboard;

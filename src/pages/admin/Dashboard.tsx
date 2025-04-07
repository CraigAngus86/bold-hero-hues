
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import { useDashboardRefresh } from '@/hooks/useDashboardRefresh';
import EnhancedSystemStatus from '@/components/admin/dashboard/EnhancedSystemStatus';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';

// Create simplified versions of the missing components
const OverviewTab = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest system events</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Recent activity will be shown here</p>
      </CardContent>
    </Card>
  </div>
);

const MetricsTab = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader>
        <CardTitle>System Metrics</CardTitle>
        <CardDescription>Performance and usage metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <p>System metrics will be shown here</p>
      </CardContent>
    </Card>
  </div>
);

const ActivityLogPanel = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">Activity Log</h2>
    <Card>
      <CardContent className="p-4">
        <p>Activity logs will be shown here</p>
      </CardContent>
    </Card>
  </div>
);

const RecentActivity = () => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
      <CardDescription>Latest actions</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Recent activity details will be shown here</p>
    </CardContent>
  </Card>
);

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

      {/* Dashboard Stats Section */}
      <DashboardStats
        newsStats={{ total: 24, published: 20, drafts: 4 }}
        fixturesStats={{ upcoming: 5, nextMatch: { opponent: 'Brora Rangers', date: '2025-04-15' } }}
        leagueStats={{ position: 3, previousPosition: 5, wins: 15, draws: 4, losses: 2 }}
        mediaStats={{ total: 120, photos: 100, videos: 15, albums: 5 }}
        isNewsStatsLoading={false}
        isFixturesStatsLoading={false}
        isLeagueStatsLoading={false}
        isMediaStatsLoading={false}
        refetchNews={() => {}}
        refetchFixtures={() => {}}
        refetchLeague={() => {}}
        refetchMedia={() => {}}
      />

      {/* System Status Card */}
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">System Status</CardTitle>
          <CardDescription>
            Current health and performance of the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedSystemStatus />
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="metrics" className="mt-4">
          <MetricsTab />
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <ActivityLogPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;

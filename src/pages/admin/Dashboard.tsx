
import React, { useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
import { Grid } from '@/components/admin/dashboard/Grid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import ActivityFeed from '@/components/admin/dashboard/ActivityFeed';
import WebsiteStatus from '@/components/admin/dashboard/WebsiteStatus';
import NewsStats from '@/components/admin/dashboard/NewsStats';
import FixturesStats from '@/components/admin/dashboard/FixturesStats';
import LeagueStats from '@/components/admin/dashboard/LeagueStats';
import MediaStats from '@/components/admin/dashboard/MediaStats';
import FansOverview from '@/components/admin/dashboard/FansOverview';
import SponsorsOverview from '@/components/admin/dashboard/SponsorsOverview';
import TicketsOverview from '@/components/admin/dashboard/TicketsOverview';
import RecentUploads from '@/components/admin/dashboard/RecentUploads';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import { useDashboardRefresh } from '@/hooks/useDashboardRefresh';
import useSystemStatus from '@/hooks/useSystemStatus';

const Dashboard = () => {
  const { refreshAll } = useDashboardRefresh();
  const { status, isLoading, refresh } = useSystemStatus();

  // Refresh dashboard data on mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        refresh(),
        refreshAll()
      ]);
    };
    
    loadData();
  }, [refresh, refreshAll]);

  return (
    <AdminLayout>
      <AdminPageLayout 
        title="Dashboard"
        description="Overview of your Banks o' Dee FC website"
        rightContent={<QuickActions />}
      >
        <Tabs defaultValue="overview" className="mt-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="system">System Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <Grid>
              <Grid.Col span={8}>
                <Grid nested>
                  <Grid.Col span={6}>
                    <NewsStats />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FixturesStats />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <LeagueStats />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <MediaStats />
                  </Grid.Col>
                </Grid>
              </Grid.Col>
              
              <Grid.Col span={4}>
                <FansOverview />
              </Grid.Col>
              
              <Grid.Col span={8}>
                <SponsorsOverview />
              </Grid.Col>
              
              <Grid.Col span={4}>
                <TicketsOverview />
              </Grid.Col>
              
              <Grid.Col span={4}>
                <RecentUploads />
              </Grid.Col>
            </Grid>
          </TabsContent>
          
          <TabsContent value="activity" className="mt-4">
            <ActivityFeed />
          </TabsContent>
          
          <TabsContent value="system" className="mt-4">
            <WebsiteStatus 
              systemStatus={status} 
              isLoading={isLoading}
              onRefresh={refresh}
            />
          </TabsContent>
        </Tabs>
      </AdminPageLayout>
    </AdminLayout>
  );
};

export default Dashboard;

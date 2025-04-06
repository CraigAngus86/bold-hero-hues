
import React from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
import Grid from '@/components/admin/dashboard/Grid';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useDashboardRefresh } from '@/hooks/useDashboardRefresh';
import { ActivityFeed } from '@/components/admin/dashboard/ActivityFeed';
import WebsiteStatus from '@/components/admin/dashboard/WebsiteStatus';
import NewsStats from '@/components/admin/dashboard/NewsStats';
import FixturesStats from '@/components/admin/dashboard/FixturesStats';
import LeagueStats from '@/components/admin/dashboard/LeagueStats';
import MediaStats from '@/components/admin/dashboard/MediaStats';
import FansOverview from '@/components/admin/dashboard/FansOverview';
import SponsorsOverview from '@/components/admin/dashboard/SponsorsOverview';
import TicketsOverview from '@/components/admin/dashboard/TicketsOverview';
import RecentUploads from '@/components/admin/dashboard/RecentUploads';
import { EnhancedSystemStatus } from '@/components/admin/dashboard/EnhancedSystemStatus';

const Dashboard = () => {
  const { refreshAll } = useDashboardRefresh();

  return (
    <AdminLayout>
      <AdminPageLayout
        title="Dashboard"
        description="Overview of your club's website and performance metrics"
        rightContent={
          <Button variant="outline" size="sm" onClick={refreshAll}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        }
      >
        <Grid>
          <WebsiteStatus />
          <EnhancedSystemStatus />
          <NewsStats />
          <FixturesStats />
          <LeagueStats />
          <MediaStats />
          <FansOverview />
          <SponsorsOverview />
          <TicketsOverview />
        </Grid>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ActivityFeed />
          <RecentUploads />
        </div>
      </AdminPageLayout>
    </AdminLayout>
  );
};

export default Dashboard;

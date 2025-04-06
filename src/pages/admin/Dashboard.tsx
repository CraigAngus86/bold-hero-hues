
import React from 'react';
import { format } from 'date-fns';
import { Activity } from 'lucide-react';
import { AdminLayout } from '@/components/admin/layout';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
import { EnhancedActivityFeed } from '@/components/admin/dashboard/EnhancedActivityFeed';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

// Import our new React Query hooks
import { 
  useNewsStats, 
  useFixturesStats, 
  useLeagueStats, 
  useMediaStats,
  useActivityFeed,
  useSystemStatus
} from '@/hooks/useAdminDashboard';

// Import our new component modules
import { DashboardStats } from '@/components/admin/dashboard/DashboardStats';
import { QuickActions } from '@/components/admin/dashboard/QuickActions';
import { StatusItems } from '@/components/admin/dashboard/StatusItems';
import { ContentSections } from '@/components/admin/dashboard/ContentSections';

const Dashboard = () => {
  const queryClient = useQueryClient();
  
  // Use React Query hooks for data fetching
  const { 
    data: newsStats, 
    isLoading: isNewsStatsLoading,
    refetch: refetchNews
  } = useNewsStats();
  
  const { 
    data: fixturesStats, 
    isLoading: isFixturesStatsLoading,
    refetch: refetchFixtures
  } = useFixturesStats();
  
  const { 
    data: leagueStats, 
    isLoading: isLeagueStatsLoading,
    refetch: refetchLeague
  } = useLeagueStats();
  
  const { 
    data: mediaStats, 
    isLoading: isMediaStatsLoading,
    refetch: refetchMedia
  } = useMediaStats();
  
  const {
    data: activityData,
    isLoading: isActivityLoading,
    refetch: refetchActivity,
    dataUpdatedAt: activityUpdatedAt
  } = useActivityFeed();
  
  const {
    data: systemStatusData,
    isLoading: isSystemStatusLoading,
    refetch: refetchSystemStatus,
    dataUpdatedAt: systemStatusUpdatedAt
  } = useSystemStatus();
  
  // Function to refresh all dashboard data
  const refreshAllData = () => {
    toast.info('Refreshing dashboard data...');
    
    Promise.all([
      refetchNews(),
      refetchFixtures(),
      refetchLeague(),
      refetchMedia(),
      refetchActivity(),
      refetchSystemStatus()
    ]).then(() => {
      toast.success('Dashboard data refreshed successfully');
    }).catch((error) => {
      toast.error('Error refreshing some dashboard data');
      console.error('Error refreshing dashboard data:', error);
    });
  };

  return (
    <AdminLayout>
      <AdminPageLayout
        title="Dashboard"
        description={`Welcome back • ${format(new Date(), 'EEEE, dd MMMM yyyy')}`}
        actions={
          <button 
            onClick={refreshAllData}
            className="text-sm flex items-center gap-1 text-primary-800 hover:underline"
          >
            <Activity className="h-4 w-4" /> 
            Refresh All
          </button>
        }
      >
        {/* Statistics Overview */}
        <DashboardStats 
          newsStats={newsStats}
          fixturesStats={fixturesStats}
          leagueStats={leagueStats}
          mediaStats={mediaStats}
          isNewsStatsLoading={isNewsStatsLoading}
          isFixturesStatsLoading={isFixturesStatsLoading}
          isLeagueStatsLoading={isLeagueStatsLoading}
          isMediaStatsLoading={isMediaStatsLoading}
          refetchNews={refetchNews}
          refetchFixtures={refetchFixtures}
          refetchLeague={refetchLeague}
          refetchMedia={refetchMedia}
        />
        
        {/* Activity and Quick Actions */}
        <div className="grid gap-6 md:grid-cols-5 mt-6">
          <div className="col-span-full md:col-span-3">
            <EnhancedActivityFeed 
              activities={activityData || []} 
              isLoading={isActivityLoading}
              lastUpdated={isActivityLoading ? null : new Date(activityUpdatedAt)}
              onRefresh={() => refetchActivity()}
            />
          </div>
          
          <div className="col-span-full md:col-span-2">
            <QuickActions draftArticlesCount={newsStats?.drafts} />
          </div>
        </div>
        
        {/* Status Indicators and Events */}
        <StatusItems 
          systemStatus={systemStatusData}
          isSystemStatusLoading={isSystemStatusLoading}
          systemStatusUpdatedAt={systemStatusUpdatedAt}
          refetchSystemStatus={refetchSystemStatus}
        />
        
        {/* Content Sections Overview */}
        <ContentSections />
      </AdminPageLayout>
    </AdminLayout>
  );
};

export default Dashboard;

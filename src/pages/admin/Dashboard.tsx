
import React from 'react';
import { format } from 'date-fns';
import { 
  Users, Calendar, Trophy, FileText, Image, 
  Bell, PlusCircle, CalendarPlus, Upload, 
  UserPlus, Table, Cog, BarChart3, Activity,
  Settings, FileQuestion, MessageSquare, AlertTriangle
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/layout';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
import { EnhancedQuickActionButton } from '@/components/admin/dashboard/EnhancedQuickActionButton';
import { EnhancedActivityFeed } from '@/components/admin/dashboard/EnhancedActivityFeed';
import { EnhancedSystemStatus } from '@/components/admin/dashboard/EnhancedSystemStatus';
import { StatusSummary } from '@/components/admin/dashboard/StatusSummary';
import { EventsCalendar } from '@/components/admin/dashboard/EventsCalendar';
import { StatCard } from '@/components/admin/common/StatCard';
import { mockEvents } from '@/components/admin/dashboard/EventsCalendar';
import { contentStatusItems } from '@/components/admin/dashboard/StatusSummary';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Import our new React Query hooks
import { 
  useNewsStats, 
  useFixturesStats, 
  useLeagueStats, 
  useMediaStats,
  useActivityFeed,
  useSystemStatus
} from '@/hooks/useAdminDashboard';

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
  
  // Convert system status data to the format expected by EnhancedSystemStatus
  const systemStatusItems = systemStatusData ? [
    {
      name: 'Supabase Connection',
      status: systemStatusData.supabase.status,
      lastChecked: systemStatusData.supabase.lastChecked,
      icon: <Database className="h-4 w-4" />,
      tooltip: 'Status of the connection to the Supabase database'
    },
    {
      name: 'Fixture Scraper',
      status: systemStatusData.fixtures.status,
      lastChecked: systemStatusData.fixtures.lastChecked,
      metricValue: systemStatusData.fixtures.metricValue,
      tooltip: 'Status of the BBC fixture scraper service'
    },
    {
      name: 'Storage Service',
      status: systemStatusData.storage.status,
      lastChecked: systemStatusData.storage.lastChecked,
      metricValue: systemStatusData.storage.metricValue,
      tooltip: 'Status and usage of the storage service'
    },
    {
      name: 'League Table Scraper',
      status: systemStatusData.leagueTable.status,
      lastChecked: systemStatusData.leagueTable.lastChecked,
      metricValue: systemStatusData.leagueTable.metricValue,
      tooltip: 'Status of the league table scraper service'
    }
  ] : [];

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="News Articles" 
            value={newsStats?.total || '0'} 
            icon={<FileText className="h-4 w-4" />} 
            trend={newsStats?.drafts ? { 
              direction: 'up', 
              value: `+${newsStats?.drafts}`, 
              label: 'drafts' 
            } : undefined}
            description={newsStats ? `${newsStats.published} published, ${newsStats.drafts} drafts` : 'Loading...'}
            isLoading={isNewsStatsLoading}
            onRefresh={() => refetchNews()}
            lastUpdated={isNewsStatsLoading ? null : new Date()}
            variant="primary"
          />
          
          <StatCard 
            title="Upcoming Fixtures" 
            value={fixturesStats?.upcoming || '0'} 
            icon={<Calendar className="h-4 w-4" />}
            description={fixturesStats?.nextMatch 
              ? `Next: ${fixturesStats.nextMatch.opponent}`
              : 'No upcoming fixtures'
            }
            isLoading={isFixturesStatsLoading}
            onRefresh={() => refetchFixtures()}
            lastUpdated={isFixturesStatsLoading ? null : new Date()}
            variant="secondary"
          />
          
          <StatCard 
            title="League Position" 
            value={leagueStats?.position ? `${leagueStats.position}${getOrdinalSuffix(leagueStats.position)}` : 'N/A'} 
            icon={<Trophy className="h-4 w-4" />}
            trend={leagueStats?.previousPosition && leagueStats?.position ? { 
              direction: leagueStats.position < leagueStats.previousPosition ? 'up' : 'down', 
              value: leagueStats.position < leagueStats.previousPosition 
                ? `+${leagueStats.previousPosition - leagueStats.position} places` 
                : `-${leagueStats.position - leagueStats.previousPosition} places` 
            } : undefined}
            description={leagueStats 
              ? `${leagueStats.wins} wins, ${leagueStats.draws} draws, ${leagueStats.losses} losses` 
              : 'Loading...'
            }
            isLoading={isLeagueStatsLoading}
            onRefresh={() => refetchLeague()}
            lastUpdated={isLeagueStatsLoading ? null : new Date()}
            variant="accent"
          />
          
          <StatCard 
            title="Media Items" 
            value={mediaStats?.total || '0'} 
            icon={<Image className="h-4 w-4" />}
            description={mediaStats 
              ? `${mediaStats.photos} photos, ${mediaStats.videos} videos, ${mediaStats.albums} albums` 
              : 'Loading...'
            }
            isLoading={isMediaStatsLoading}
            onRefresh={() => refetchMedia()}
            lastUpdated={isMediaStatsLoading ? null : new Date()}
          />
        </div>
        
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
            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
              <EnhancedQuickActionButton 
                icon={<PlusCircle className="h-5 w-5" />} 
                label="Add News"
                href="/admin/news"
                description="Create article"
                tooltip="Add a new news article or blog post"
                badgeCount={newsStats?.drafts}
              />
              
              <EnhancedQuickActionButton 
                icon={<CalendarPlus className="h-5 w-5" />} 
                label="Add Fixture"
                href="/admin/fixtures"
                description="Schedule match"
                tooltip="Add a new fixture to the calendar"
              />
              
              <EnhancedQuickActionButton 
                icon={<Upload className="h-5 w-5" />} 
                label="Upload Media"
                href="/admin/images"
                description="Photos & videos"
                tooltip="Upload and manage media files"
              />
              
              <EnhancedQuickActionButton 
                icon={<UserPlus className="h-5 w-5" />} 
                label="Add Player"
                href="/admin/team"
                description="Team roster"
                tooltip="Add or manage team members"
              />
              
              <EnhancedQuickActionButton 
                icon={<Table className="h-5 w-5" />} 
                label="League Table"
                href="/admin/league-table-management"
                description="Update standings"
                tooltip="View and manage league table data"
              />
              
              <EnhancedQuickActionButton 
                icon={<Settings className="h-5 w-5" />} 
                label="Settings"
                href="/admin/settings"
                description="Configuration"
                tooltip="Manage system settings"
                badgeCount={contentStatusItems.filter(item => item.status === 'error').length}
                badgeColor="bg-red-500"
              />
            </div>
          </div>
        </div>
        
        {/* Status Indicators and Events */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <div className="lg:col-span-1">
            <StatusSummary 
              items={contentStatusItems} 
              title="Content Status" 
              viewAllLink="/admin/settings"
            />
          </div>
          
          <div className="lg:col-span-1">
            <EnhancedSystemStatus 
              systems={systemStatusItems} 
              isLoading={isSystemStatusLoading}
              lastUpdated={isSystemStatusLoading ? null : new Date(systemStatusUpdatedAt)}
              onRefresh={() => refetchSystemStatus()}
            />
          </div>
          
          <div className="lg:col-span-1">
            <EventsCalendar 
              events={mockEvents}
              onRefresh={() => toast.info('Calendar refreshed')}
            />
          </div>
        </div>
        
        {/* Content Sections Overview */}
        <div className="grid gap-4 md:grid-cols-3 mt-6">
          <div className="col-span-full md:col-span-1">
            <div className="grid gap-4 bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center gap-4">
                <BarChart3 className="h-5 w-5 text-primary-800" />
                <div>
                  <h3 className="text-lg font-semibold text-primary-800">Site Analytics</h3>
                  <p className="text-sm text-muted-foreground">Track visitor engagement</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Connect Google Analytics for detailed insight on visitor behavior, popular content, and user journeys.</p>
            </div>
          </div>
          
          <div className="col-span-full md:col-span-1">
            <div className="grid gap-4 bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center gap-4">
                <Activity className="h-5 w-5 text-primary-800" />
                <div>
                  <h3 className="text-lg font-semibold text-primary-800">Content Performance</h3>
                  <p className="text-sm text-muted-foreground">Measure engagement</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Track how users interact with your content. Identify popular articles, images, and match information.</p>
            </div>
          </div>
          
          <div className="col-span-full md:col-span-1">
            <div className="grid gap-4 bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center gap-4">
                <Users className="h-5 w-5 text-primary-800" />
                <div>
                  <h3 className="text-lg font-semibold text-primary-800">User Management</h3>
                  <p className="text-sm text-muted-foreground">Manage admin access</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Control who can access the admin area and what permissions they have for creating and editing content.</p>
            </div>
          </div>
        </div>
      </AdminPageLayout>
    </AdminLayout>
  );
};

// Helper function to get ordinal suffix for numbers
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
}

export default Dashboard;


import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getSystemLogs, getLatestLogBySource } from '@/services/logs/systemLogsService';
import { mockActivities } from '@/components/admin/dashboard/ActivityFeed';

// Keys for React Query
export const dashboardKeys = {
  stats: ['dashboard', 'stats'],
  activities: ['dashboard', 'activities'],
  systemStatus: ['dashboard', 'systemStatus'],
  fixtures: ['dashboard', 'fixtures'],
};

interface DashboardStats {
  newsCount: {
    total: number;
    published: number;
    drafts: number;
  };
  fixturesCount: {
    upcoming: number;
    nextMatch: { opponent: string; date: string } | null;
  };
  leaguePosition: {
    position: number | null;
    previousPosition: number | null;
    wins: number;
    draws: number;
    losses: number;
  };
  mediaCount: {
    total: number;
    photos: number;
    videos: number;
    albums: number;
  };
}

export const useNewsStats = () => {
  return useQuery({
    queryKey: [...dashboardKeys.stats, 'news'],
    queryFn: async (): Promise<DashboardStats['newsCount']> => {
      try {
        // Get published articles count
        const { count: publishedCount, error: publishedError } = await supabase
          .from('news_articles')
          .select('*', { count: 'exact', head: true })
          .eq('is_featured', true);

        // Get total articles count
        const { count: totalCount, error: totalError } = await supabase
          .from('news_articles')
          .select('*', { count: 'exact', head: true });

        if (publishedError || totalError) {
          throw new Error(publishedError?.message || totalError?.message);
        }

        return {
          total: totalCount || 0,
          published: publishedCount || 0,
          drafts: (totalCount || 0) - (publishedCount || 0),
        };
      } catch (error) {
        console.error("Error fetching news stats:", error);
        // Return fallback data in case of error
        return { total: 0, published: 0, drafts: 0 };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFixturesStats = () => {
  return useQuery({
    queryKey: [...dashboardKeys.stats, 'fixtures'],
    queryFn: async (): Promise<DashboardStats['fixturesCount']> => {
      try {
        // Get upcoming fixtures count
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const { count: upcomingCount, error: countError } = await supabase
          .from('fixtures')
          .select('*', { count: 'exact', head: true })
          .gte('date', today)
          .eq('is_completed', false);

        // Get next match details
        const { data: nextMatch, error: matchError } = await supabase
          .from('fixtures')
          .select('*')
          .gte('date', today)
          .eq('is_completed', false)
          .order('date', { ascending: true })
          .limit(1)
          .single();

        if (countError || matchError) {
          throw new Error(countError?.message || matchError?.message);
        }

        let nextMatchDetails = null;
        if (nextMatch) {
          const isHomeGame = nextMatch.home_team === "Banks o' Dee";
          const opponent = isHomeGame ? nextMatch.away_team : nextMatch.home_team;
          nextMatchDetails = {
            opponent,
            date: nextMatch.date,
          };
        }

        return {
          upcoming: upcomingCount || 0,
          nextMatch: nextMatchDetails,
        };
      } catch (error) {
        console.error("Error fetching fixtures stats:", error);
        // Return fallback data in case of error
        return { upcoming: 0, nextMatch: null };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLeagueStats = () => {
  return useQuery({
    queryKey: [...dashboardKeys.stats, 'league'],
    queryFn: async (): Promise<DashboardStats['leaguePosition']> => {
      try {
        // Get team position
        const { data, error } = await supabase
          .from('highland_league_table')
          .select('position, played, won, drawn, lost')
          .eq('team', "Banks o' Dee")
          .single();

        if (error) throw error;

        return {
          position: data?.position || null,
          previousPosition: (data?.position || 0) + 2, // Mock previous position
          wins: data?.won || 0,
          draws: data?.drawn || 0,
          losses: data?.lost || 0,
        };
      } catch (error) {
        console.error("Error fetching league stats:", error);
        // Return fallback data
        return {
          position: null,
          previousPosition: null,
          wins: 0,
          draws: 0,
          losses: 0,
        };
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useMediaStats = () => {
  return useQuery({
    queryKey: [...dashboardKeys.stats, 'media'],
    queryFn: async (): Promise<DashboardStats['mediaCount']> => {
      try {
        const { count, error } = await supabase
          .from('image_metadata')
          .select('*', { count: 'exact', head: true });

        if (error) throw error;

        // Mock breakdown by type (in a real app, you'd have proper categories)
        const total = count || 0;
        return {
          total,
          photos: Math.floor(total * 0.7), // 70% are photos
          videos: Math.floor(total * 0.1), // 10% are videos
          albums: Math.floor(total * 0.2), // 20% are albums
        };
      } catch (error) {
        console.error("Error fetching media stats:", error);
        return { total: 0, photos: 0, videos: 0, albums: 0 };
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useActivityFeed = (limit: number = 10) => {
  return useQuery({
    queryKey: [...dashboardKeys.activities, { limit }],
    queryFn: async () => {
      try {
        // In a real app, fetch from your activity logs table
        // For now, using mock data but in proper implementation:
        // const { data, error } = await supabase.from('admin_activities').select('*').order('timestamp', { ascending: false }).limit(limit);
        
        // Instead, we'll use the mock data but simulate an API call
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockActivities.slice(0, limit);
      } catch (error) {
        console.error("Error fetching activity feed:", error);
        return [];
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useSystemStatus = () => {
  return useQuery({
    queryKey: dashboardKeys.systemStatus,
    queryFn: async () => {
      try {
        // Get Supabase connection status (simple check)
        const supabaseStatus = await checkSupabaseConnection();
        
        // Get scraper status from logs
        const scraperLog = await getLatestLogBySource('bbc-scraper');
        const storageLog = await getLatestLogBySource('storage-service');
        const leagueTableLog = await getLatestLogBySource('league-table-scraper');

        return {
          supabase: {
            status: supabaseStatus ? 'online' : 'offline',
            lastChecked: new Date(),
          },
          fixtures: {
            status: scraperLog?.type === 'error' ? 'offline' : 'online',
            lastChecked: scraperLog?.timestamp ? new Date(scraperLog.timestamp) : new Date(),
            metricValue: scraperLog?.timestamp 
              ? `Last run: ${formatTimeAgo(new Date(scraperLog.timestamp))}`
              : undefined,
          },
          storage: {
            status: storageLog?.type === 'warning' ? 'warning' : 'online',
            lastChecked: new Date(),
            metricValue: '78% used', // Mock value
          },
          leagueTable: {
            status: leagueTableLog?.type === 'error' ? 'offline' : 'online',
            lastChecked: leagueTableLog?.timestamp ? new Date(leagueTableLog.timestamp) : new Date(),
            metricValue: leagueTableLog?.timestamp 
              ? `Last run: ${formatTimeAgo(new Date(leagueTableLog.timestamp))}`
              : undefined,
          },
        };
      } catch (error) {
        console.error("Error checking system status:", error);
        // Return default status on error
        return {
          supabase: { status: 'unknown', lastChecked: new Date() },
          fixtures: { status: 'unknown', lastChecked: new Date() },
          storage: { status: 'unknown', lastChecked: new Date() },
          leagueTable: { status: 'unknown', lastChecked: new Date() },
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Helper function to check if Supabase is connected
async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('settings').select('key').limit(1);
    return !error && data !== null;
  } catch (e) {
    return false;
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHrs < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${diffMins} minutes ago`;
  } else if (diffHrs < 24) {
    return `${diffHrs} hours ago`;
  } else {
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} days ago`;
  }
}

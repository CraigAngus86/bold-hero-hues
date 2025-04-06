
import { useQuery } from '@tanstack/react-query';
import { getLatestLogBySource } from '@/services/logs/systemLogsService';
import { supabase } from '@/integrations/supabase/client';

// Keys for React Query
export const systemKeys = {
  status: ['system', 'status'],
};

export type SystemStatus = 'online' | 'offline' | 'warning' | 'unknown';

export interface SystemStatusData {
  supabase: {
    status: SystemStatus;
    lastChecked: Date;
  };
  fixtures: {
    status: SystemStatus;
    lastChecked: Date;
    metricValue?: string;
  };
  storage: {
    status: SystemStatus;
    lastChecked: Date;
    metricValue?: string;
  };
  leagueTable: {
    status: SystemStatus;
    lastChecked: Date;
    metricValue?: string;
  };
}

export const useSystemStatus = () => {
  return useQuery({
    queryKey: systemKeys.status,
    queryFn: async (): Promise<SystemStatusData> => {
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
async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('settings').select('key').limit(1);
    return !error && data !== null;
  } catch (e) {
    return false;
  }
}

// Helper function to format time ago
export function formatTimeAgo(date: Date): string {
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

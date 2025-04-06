
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { newsKeys } from './useNewsStats';
import { fixturesKeys } from './useFixturesStats';
import { leagueKeys } from './useLeagueStats';
import { mediaKeys } from './useMediaStats';
import { activityKeys } from './useActivityFeed';
import { systemKeys } from './useSystemStatus';

export const useDashboardRefresh = () => {
  const queryClient = useQueryClient();
  
  const refreshAll = () => {
    toast.info('Refreshing dashboard data...');
    
    // Invalidate all dashboard-related queries
    Promise.all([
      queryClient.invalidateQueries({ queryKey: newsKeys.stats }),
      queryClient.invalidateQueries({ queryKey: fixturesKeys.stats }),
      queryClient.invalidateQueries({ queryKey: leagueKeys.stats }),
      queryClient.invalidateQueries({ queryKey: mediaKeys.stats }),
      queryClient.invalidateQueries({ queryKey: activityKeys.activities }),
      queryClient.invalidateQueries({ queryKey: [systemKeys.status] }),
    ]).then(() => {
      toast.success('Dashboard data refreshed successfully');
    }).catch((error) => {
      toast.error('Error refreshing some dashboard data');
      console.error('Error refreshing dashboard data:', error);
    });
  };
  
  return { refreshAll };
};

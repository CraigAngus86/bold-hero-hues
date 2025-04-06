
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Keys for React Query
export const leagueKeys = {
  stats: ['league', 'stats'],
};

export interface LeagueStatsData {
  position: number | null;
  previousPosition: number | null;
  wins: number;
  draws: number;
  losses: number;
}

export const useLeagueStats = () => {
  return useQuery({
    queryKey: [...leagueKeys.stats],
    queryFn: async (): Promise<LeagueStatsData> => {
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

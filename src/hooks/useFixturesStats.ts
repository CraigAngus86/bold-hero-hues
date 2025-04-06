
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Keys for React Query
export const fixturesKeys = {
  stats: ['fixtures', 'stats'],
};

export interface FixturesStatsData {
  upcoming: number;
  nextMatch: { opponent: string; date: string } | null;
}

export const useFixturesStats = () => {
  return useQuery({
    queryKey: [...fixturesKeys.stats],
    queryFn: async (): Promise<FixturesStatsData> => {
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

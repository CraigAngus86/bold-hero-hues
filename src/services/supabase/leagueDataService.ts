import { supabase } from '@/integrations/supabase/client';
import { TeamStats } from '@/components/league/types';

// Cache for league table data to reduce API calls
let leagueTableCache: TeamStats[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export const clearSupabaseCache = () => {
  leagueTableCache = null;
  lastFetchTime = 0;
};

export const fetchLeagueTableFromSupabase = async (): Promise<TeamStats[]> => {
  // Check if we have cached data that's still fresh
  const now = Date.now();
  if (leagueTableCache && (now - lastFetchTime < CACHE_DURATION)) {
    return leagueTableCache;
  }
  
  try {
    const { data, error } = await supabase
      .from('highland_league_table')
      .select('*')
      .order('position', { ascending: true });
    
    if (error) {
      console.error('Error fetching league table:', error);
      throw error;
    }
    
    // Transform the data to match our TeamStats interface
    const formattedData: TeamStats[] = data.map(item => ({
      position: item.position,
      team: item.team,
      played: item.played,
      won: item.won,
      drawn: item.drawn,
      lost: item.lost,
      goalsFor: item.goalsFor,
      goalsAgainst: item.goalsAgainst,
      goalDifference: item.goalDifference,
      points: item.points,
      form: item.form || [],
      logo: item.logo || ''
    }));
    
    // Update the cache
    leagueTableCache = formattedData;
    lastFetchTime = now;
    
    return formattedData;
  } catch (error) {
    console.error('Error in fetchLeagueTableFromSupabase:', error);
    
    // Return the cached data if we have it, even if it's expired
    if (leagueTableCache) {
      return leagueTableCache;
    }
    
    // Otherwise return an empty array
    return [];
  }
};


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

export const getLastUpdateTime = async (): Promise<string | null> => {
  try {
    // Try to get the last update time from the settings table
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'league_table_last_updated')
      .single();
    
    if (error || !data) {
      console.error('Error fetching last update time:', error);
      return null;
    }
    
    return data.value;
  } catch (error) {
    console.error('Error in getLastUpdateTime:', error);
    return null;
  }
};

// Function to trigger a scrape operation for league data
export const triggerLeagueDataScrape = async (): Promise<boolean> => {
  try {
    // Call the Supabase edge function to trigger a scrape
    const { data, error } = await supabase.functions.invoke('scrape-highland-league', {
      body: { action: 'scrape-league-table' }
    });
    
    if (error) {
      console.error('Error triggering league data scrape:', error);
      return false;
    }
    
    // If successful, clear cache to ensure fresh data on next fetch
    clearSupabaseCache();
    
    return data?.success || false;
  } catch (error) {
    console.error('Error in triggerLeagueDataScrape:', error);
    return false;
  }
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
      logo: item.logo || '',
      id: item.id // Make sure to include the id
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

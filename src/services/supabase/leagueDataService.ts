
import { supabase } from '@/lib/supabase';
import { TeamStats } from '@/types/fixtures';

/**
 * Fetches the Highland League table data from Supabase
 */
export async function fetchLeagueTableFromSupabase(): Promise<TeamStats[]> {
  try {
    const { data, error } = await supabase
      .from('highland_league_table')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching league table from Supabase:', error);
      throw error;
    }

    return data.map(team => ({
      id: team.id?.toString(),
      position: team.position,
      team: team.team,
      played: team.played,
      won: team.won,
      drawn: team.drawn,
      lost: team.lost,
      goalsFor: team.goalsFor,
      goalsAgainst: team.goalsAgainst,
      goalDifference: team.goalDifference,
      points: team.points,
      form: team.form || [],
      logo: team.logo || ''
    }));
  } catch (error) {
    console.error('Error in fetchLeagueTableFromSupabase:', error);
    return [];
  }
}

/**
 * Clears any cached league data
 */
export async function clearSupabaseCache(): Promise<void> {
  try {
    // This is a placeholder for actual cache clearing logic
    // In a real implementation, you might invalidate a cache entry or send a signal to refresh data
    console.log('Clearing Supabase cache for league data');
    return Promise.resolve();
  } catch (error) {
    console.error('Error clearing Supabase cache:', error);
    return Promise.resolve();
  }
}

/**
 * Triggers the scraping of Highland League data
 */
export async function triggerLeagueDataScrape(): Promise<any[]> {
  try {
    // Call the supabase edge function to scrape data
    const { data, error } = await supabase.functions.invoke('scrape-highland-league', {
      body: { action: 'scrape' }
    });

    if (error) {
      console.error('Error triggering league data scrape:', error);
      throw new Error(`Failed to trigger league data scrape: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in triggerLeagueDataScrape:', error);
    throw error;
  }
}

/**
 * Gets the last time the league data was updated
 */
export async function getLastUpdateTime(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('scrape_logs')
      .select('created_at')
      .eq('source', 'highland-league')
      .eq('status', 'success')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found
        return null;
      }
      console.error('Error fetching last update time:', error);
      throw error;
    }

    return data?.created_at || null;
  } catch (error) {
    console.error('Error in getLastUpdateTime:', error);
    return null;
  }
}

// Export both as named exports and as a default export object
const leagueDataService = {
  triggerLeagueDataScrape,
  getLastUpdateTime,
  fetchLeagueTableFromSupabase,
  clearSupabaseCache
};

export default leagueDataService;

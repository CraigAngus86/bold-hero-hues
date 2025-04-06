
import { supabase } from '@/lib/supabase';
import { TeamStats } from '@/types/fixtures';

/**
 * Fetch league table data from Supabase
 */
export const fetchLeagueTableFromSupabase = async (): Promise<TeamStats[]> => {
  try {
    const { data, error } = await supabase
      .from('highland_league_table')
      .select('*')
      .order('position', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return (data as TeamStats[]) || [];
  } catch (error) {
    console.error('Error fetching league table:', error);
    return [];
  }
};

/**
 * Get the timestamp of the last update
 */
export const getLastUpdateTime = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'last_league_table_update')
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return data.value;
  } catch (error) {
    console.error('Error getting last update time:', error);
    return null;
  }
};

/**
 * Trigger a scrape of the league data
 */
export const triggerLeagueDataScrape = async (): Promise<TeamStats[]> => {
  try {
    // Log the scrape start
    await supabase
      .from('scrape_logs')
      .insert({
        source: 'highland_league_table',
        status: 'initiated',
        items_found: 0
      });
    
    // In a real app, we would call an edge function or lambda
    // For now, we'll just return the current data
    const data = await fetchLeagueTableFromSupabase();
    
    // Update the last scrape time
    const now = new Date().toISOString();
    await supabase
      .from('settings')
      .upsert({ 
        key: 'last_league_table_update', 
        value: now 
      }, { onConflict: 'key' });
    
    // Log the scrape completion
    await supabase
      .from('scrape_logs')
      .insert({
        source: 'highland_league_table',
        status: 'completed',
        items_found: data.length,
        items_updated: data.length
      });
    
    return data;
  } catch (error) {
    console.error('Error triggering league data scrape:', error);
    
    // Log the scrape error
    await supabase
      .from('scrape_logs')
      .insert({
        source: 'highland_league_table',
        status: 'error',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
    
    return [];
  }
};

/**
 * Clear the league data cache
 */
export const clearLeagueDataCache = async (): Promise<void> => {
  try {
    // Update the cache invalidation timestamp
    const now = new Date().toISOString();
    await supabase
      .from('settings')
      .upsert({ 
        key: 'league_data_cache_invalidated', 
        value: now 
      }, { onConflict: 'key' });
      
    console.log('League data cache cleared at', now);
  } catch (error) {
    console.error('Error clearing league data cache:', error);
  }
};

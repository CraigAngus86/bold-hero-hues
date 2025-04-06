
import { supabase } from '@/lib/supabase';

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

const leagueDataService = {
  triggerLeagueDataScrape,
  getLastUpdateTime
};

export default leagueDataService;

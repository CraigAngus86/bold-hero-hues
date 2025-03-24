
import { TeamStats } from '@/components/league/types';
import { supabase } from './supabaseClient';
import { mockLeagueData } from '@/components/league/types';
import { toast } from "sonner";

// Function to fetch league table data from Supabase
export async function fetchLeagueTableFromSupabase(): Promise<TeamStats[]> {
  try {
    // First try to get data from Supabase
    const { data, error } = await supabase
      .from('highland_league_table')
      .select('*')
      .order('position', { ascending: true });
    
    if (error) {
      console.error('Error fetching from Supabase:', error);
      throw new Error(`Failed to fetch from Supabase: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log('No data found in Supabase, triggering scrape');
      // If no data found, try to trigger a scrape
      return await triggerLeagueDataScrape();
    }
    
    console.log('Successfully fetched league table from Supabase');
    return data as TeamStats[];
  } catch (error) {
    console.error('Error fetching league table from Supabase:', error);
    // Fall back to mock data
    console.log('Falling back to mock data due to Supabase error');
    return mockLeagueData;
  }
}

// Function to trigger a new scrape via the Edge Function
export async function triggerLeagueDataScrape(forceRefresh = false): Promise<TeamStats[]> {
  try {
    console.log('Triggering league data scrape via Edge Function');
    
    const { data: response, error } = await supabase.functions.invoke('scrape-highland-league', {
      body: { forceRefresh }
    });
    
    if (error) {
      console.error('Error invoking Edge Function:', error);
      throw new Error(`Failed to invoke scraper: ${error.message}`);
    }
    
    if (!response.success) {
      console.error('Scraper returned error:', response.message);
      throw new Error(`Scraper failed: ${response.message}`);
    }
    
    console.log('Successfully scraped league data');
    return response.data as TeamStats[];
  } catch (error) {
    console.error('Error during scrape operation:', error);
    toast.error("Failed to scrape league data. Using mock data instead.");
    // Fall back to mock data
    return mockLeagueData;
  }
}

// Get the last update time for the league data
export async function getLastUpdateTime(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'last_scrape_time')
      .single();
    
    if (error || !data) {
      console.error('Error fetching last update time:', error);
      return null;
    }
    
    return data.value;
  } catch (error) {
    console.error('Error getting last update time:', error);
    return null;
  }
}

// Clear cached data (for admin operations)
export async function clearSupabaseCache(): Promise<boolean> {
  try {
    // This doesn't actually delete the data from Supabase,
    // it just triggers a new scrape on next fetch
    localStorage.removeItem('highland_league_cache_timestamp');
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
}


import { TeamStats } from '@/components/league/types';
import { supabase } from '@/integrations/supabase/client';
import { mockLeagueData } from '@/components/league/types';
import { toast } from "sonner";

// Function to fetch league table data from Supabase
export async function fetchLeagueTableFromSupabase(): Promise<TeamStats[]> {
  try {
    console.log('Fetching league table from Supabase');
    
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
      console.log('No data found in Supabase, falling back to local API server');
      // If no data in Supabase, try to get it from the local API server
      return await fetchFromLocalServer();
    }
    
    console.log('Successfully fetched league table from Supabase');
    return data as TeamStats[];
  } catch (error) {
    console.error('Error fetching league table from Supabase:', error);
    return await fetchFromLocalServer();
  }
}

// Function to fetch data from local server as a fallback
async function fetchFromLocalServer(): Promise<TeamStats[]> {
  try {
    // Try to use the local server if available
    const apiUrl = 'http://localhost:3001/api/league-table';
    const response = await fetch(apiUrl, {
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched league table from local server');
    return data.leagueTable;
  } catch (error) {
    console.error('Error fetching from local server, using mock data:', error);
    // Fall back to mock data
    return mockLeagueData;
  }
}

// Function to trigger a new scrape via the Edge Function
export async function triggerLeagueDataScrape(forceRefresh = false): Promise<TeamStats[]> {
  try {
    console.log('Attempting to trigger league data scrape');
    
    // First try the Edge Function
    try {
      console.log('Triggering league data scrape via Edge Function');
      const { data: response, error } = await supabase.functions.invoke('scrape-highland-league', {
        body: { forceRefresh }
      });
      
      if (error) {
        console.error('Error invoking Edge Function:', error);
        throw error;
      }
      
      if (!response.success) {
        console.error('Scraper returned error:', response.message);
        throw new Error(`Scraper failed: ${response.message}`);
      }
      
      console.log('Successfully scraped league data via Edge Function');
      return response.data as TeamStats[];
    } catch (edgeFunctionError) {
      console.error('Edge Function error, trying local server:', edgeFunctionError);
      toast.error("Edge Function failed. Trying local server...");
      
      // Try the local server as a fallback
      try {
        const apiUrl = `http://localhost:3001/api/league-table?refresh=true`;
        const response = await fetch(apiUrl, {
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors'
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Successfully scraped league data via local server');
        toast.success("Data refreshed from local server");
        return data.leagueTable;
      } catch (localServerError) {
        console.error('Local server error:', localServerError);
        throw new Error('Both Edge Function and local server failed');
      }
    }
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
    localStorage.removeItem('highland_league_cache_timestamp');
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
}

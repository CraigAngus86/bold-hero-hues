
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TeamStats } from '@/types/fixtures';
import { Match } from '@/components/fixtures/types';

// Get the most recent league table from Supabase
export const fetchLeagueTableFromSupabase = async (): Promise<TeamStats[]> => {
  try {
    const { data, error } = await supabase
      .from('highland_league_table')
      .select('*')
      .order('position', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    // Ensure form is an array (since sometimes it might come as a string)
    const formattedData = data.map(team => ({
      ...team,
      form: Array.isArray(team.form) ? team.form : 
            typeof team.form === 'string' ? team.form.split('') : []
    }));
    
    return formattedData;
  } catch (error) {
    console.error('Error fetching league table from Supabase:', error);
    toast.error('Failed to load league table data');
    return [];
  }
};

// Get the last update time of the league table
export const getLastUpdateTime = async (): Promise<string | null> => {
  try {
    // First check the settings table for a dedicated last_updated value
    const { data: settingsData, error: settingsError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'league_table_last_updated')
      .single();
      
    if (!settingsError && settingsData) {
      return settingsData.value;
    }
    
    // Fall back to the most recent league table entry's updated_at time
    const { data, error } = await supabase
      .from('highland_league_table')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      throw error;
    }
    
    return data?.created_at || null;
  } catch (error) {
    console.error('Error getting last update time:', error);
    return null;
  }
};

// Clear Supabase cache for the league table
export const clearSupabaseCache = async (): Promise<void> => {
  try {
    // There's no direct way to clear the cache in Supabase client
    // We can use a small request with cache-control headers to simulate a refresh
    await fetch('/api/clear-cache?table=highland_league_table', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

// Trigger the scraping of Highland League data from the source (e.g. BBC)
export const triggerLeagueDataScrape = async (force: boolean = false): Promise<TeamStats[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('scrape-highland-league', {
      body: { force }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error triggering league data scrape:', error);
    toast.error('Failed to scrape league data');
    throw error;
  }
};

// Function to get all league data (table, fixtures, results)
export const getLeagueData = async () => {
  try {
    const [leagueTable, fixtures, results] = await Promise.all([
      fetchLeagueTableFromSupabase(),
      // Add your fixtures fetch here when implemented
      [],
      // Add your results fetch here when implemented
      []
    ]);
    
    return {
      leagueTable, 
      fixtures: fixtures as Match[], 
      results: results as Match[]
    };
  } catch (error) {
    console.error('Error fetching league data:', error);
    toast.error('Failed to load league data');
    
    return {
      leagueTable: [],
      fixtures: [],
      results: []
    };
  }
};

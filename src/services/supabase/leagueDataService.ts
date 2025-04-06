
import { supabase } from '@/lib/supabase';
import { TeamStats } from '@/types/fixtures';
import { toast } from 'sonner';

/**
 * Fetches the league table data from Supabase
 */
export async function fetchLeagueTableFromSupabase(): Promise<TeamStats[]> {
  try {
    const { data, error } = await supabase
      .from('highland_league_table')
      .select('*')
      .order('position', { ascending: true });
    
    if (error) {
      console.error('Error fetching league table:', error);
      return [];
    }
    
    // Process the form data to ensure it's always an array
    return data.map(team => {
      // Process the form field to ensure it's an array
      let formArray: string[] = [];
      
      if (Array.isArray(team.form)) {
        formArray = team.form;
      } else if (typeof team.form === 'string' && team.form) {
        try {
          // Try to parse if it's a JSON string
          const parsed = JSON.parse(team.form);
          if (Array.isArray(parsed)) {
            formArray = parsed;
          } else {
            // If parsed but not an array, split the string
            formArray = team.form.split('');
          }
        } catch {
          // If parsing failed, split the string
          formArray = team.form.split('');
        }
      }
      
      return {
        ...team,
        form: formArray
      };
    });
  } catch (error) {
    console.error('Error in fetchLeagueTableFromSupabase:', error);
    return [];
  }
}

/**
 * Triggers a scrape of the league table data and saves it to Supabase
 */
export async function triggerLeagueDataScrape(): Promise<TeamStats[]> {
  try {
    const { data, error } = await supabase
      .functions.invoke('scrape-highland-league');
    
    if (error) {
      throw new Error(error.message || 'Failed to scrape league data');
    }
    
    return data?.leagueTable || [];
    
  } catch (error) {
    console.error('Error in triggerLeagueDataScrape:', error);
    toast.error('Failed to scrape league data. Please try again later.');
    return [];
  }
}

/**
 * Gets the last update time of the league table
 */
export async function getLastUpdateTime(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('scrape_logs')
      .select('created_at')
      .eq('source', 'highland_league')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return data.created_at;
  } catch (error) {
    console.error('Error getting last update time:', error);
    return null;
  }
}

/**
 * Clears the Supabase cache
 */
export async function clearSupabaseCache(): Promise<boolean> {
  try {
    // Use the REST API to purge the cache
    const response = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'apikey': process.env.VITE_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY || ''}`,
        'Content-Type': 'application/json',
        'X-Client-Info': 'web-app'
      },
      body: JSON.stringify({
        query: 'RESET cache'
      })
    });

    // If successful, we'll get a 200 response
    const success = response.ok;
    
    if (success) {
      toast.success('Cache cleared successfully');
    } else {
      const errorText = await response.text();
      console.error('Error clearing cache:', errorText);
      toast.error('Failed to clear cache');
    }
    
    return success;
  } catch (error) {
    console.error('Error clearing cache:', error);
    toast.error('Failed to clear cache');
    return false;
  }
}

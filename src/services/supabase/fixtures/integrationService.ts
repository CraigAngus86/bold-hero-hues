import { supabase } from '@/integrations/supabase/client';
import { Match } from '@/components/fixtures/types';
import { convertToMatches, Fixture, ScrapedFixture } from '@/types/fixtures';
import { ImportResult } from './types';
import { toast } from 'sonner';

interface GetFixturesOptions {
  forceUpdate?: boolean;
  upcomingLimit?: number;
  recentLimit?: number;
  showToasts?: boolean;
}

/**
 * Updates the last fixtures update timestamp in Supabase
 */
export const updateLastUpdateTime = async (): Promise<boolean> => {
  try {
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from('settings')
      .upsert({ 
        key: 'last_fixture_update',
        value: now
      }, { onConflict: 'key' });
    
    if (error) {
      console.error('Error updating last update time:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating last update time:', error);
    return false;
  }
};

/**
 * Gets the last fixtures update timestamp from Supabase
 */
export const getLastUpdateTime = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'last_fixture_update')
      .single();
    
    if (error) {
      console.error('Error retrieving last update time:', error);
      return null;
    }
    
    return data?.value || null;
  } catch (error) {
    console.error('Error retrieving last update time:', error);
    return null;
  }
};

/**
 * Check if we need to update data from sources
 * Updates every hour by default
 */
export const checkIfUpdateNeeded = async (): Promise<boolean> => {
  const lastUpdate = await getLastUpdateTime();
  
  // If no last update time, we definitely need to update
  if (!lastUpdate) return true;
  
  // Check if it's been more than an hour since the last update
  const lastUpdateTime = new Date(lastUpdate).getTime();
  const currentTime = new Date().getTime();
  const hourInMs = 60 * 60 * 1000;
  
  return (currentTime - lastUpdateTime) > hourInMs;
};

/**
 * Get fixtures for Lovable app display
 */
export const getFixturesForLovable = async (options: GetFixturesOptions = {}): Promise<{
  success: boolean;
  data?: {
    upcoming: Match[];
    recent: Match[];
    all: Match[];
  };
  error?: string;
  lastUpdated?: string | null;
}> => {
  const { 
    forceUpdate = false,
    upcomingLimit = 10,
    recentLimit = 5,
    showToasts = false
  } = options;
  
  try {
    // Check if we need to update data from sources
    const shouldUpdate = forceUpdate || await checkIfUpdateNeeded();
    
    if (shouldUpdate) {
      if (showToasts) {
        toast.info('Updating fixtures data from sources...');
      }
      
      // This could trigger the scraping process
      // Currently not implemented, as we rely on manual triggers
      // We could add automated scraping in the future
    } else {
      if (showToasts) {
        toast.info('Using cached fixtures data');
      }
    }
    
    // Get upcoming fixtures (not completed)
    const { data: upcomingData, error: upcomingError } = await supabase
      .from('fixtures')
      .select('*')
      .eq('is_completed', false)
      .order('date', { ascending: true })
      .limit(upcomingLimit);
    
    if (upcomingError) {
      throw new Error(`Error fetching upcoming fixtures: ${upcomingError.message}`);
    }
    
    // Get recent results (completed)
    const { data: recentData, error: recentError } = await supabase
      .from('fixtures')
      .select('*')
      .eq('is_completed', true)
      .order('date', { ascending: false })
      .limit(recentLimit);
    
    if (recentError) {
      throw new Error(`Error fetching recent results: ${recentError.message}`);
    }
    
    // Get all fixtures
    const { data: allData, error: allError } = await supabase
      .from('fixtures')
      .select('*')
      .order('date', { ascending: false })
      .limit(100);
    
    if (allError) {
      throw new Error(`Error fetching all fixtures: ${allError.message}`);
    }
    
    // Convert DB format to Match format
    const upcoming = convertToMatches(upcomingData || []);
    const recent = convertToMatches(recentData || []);
    const all = convertToMatches(allData || []);
    
    // Get last update time
    const lastUpdated = await getLastUpdateTime();
    
    return {
      success: true,
      data: { upcoming, recent, all },
      lastUpdated
    };
  } catch (error) {
    console.error('Error in getFixturesForLovable:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Trigger fixture update from a specific source
 */
export const triggerFixturesUpdate = async (source: string): Promise<{
  success: boolean;
  message: string;
  fixtures?: Match[];
}> => {
  try {
    if (source === 'bbc') {
      // Call the Supabase edge function to scrape fixture data from BBC Sport
      const { data, error } = await supabase.functions.invoke('scrape-bbc-fixtures', {
        body: { 
          url: 'https://www.bbc.com/sport/football/scottish-highland-league/scores-fixtures'
        }
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data || !data.success || !data.data || data.data.length === 0) {
        return {
          success: false,
          message: 'No fixtures found from BBC Sport'
        };
      }
      
      // Update last update time
      await updateLastUpdateTime();
      
      // Convert to Match objects
      const fixtures = convertToMatches(data.data);
      
      return {
        success: true,
        message: `Successfully fetched ${fixtures.length} fixtures from BBC Sport`,
        fixtures
      };
    } else if (source === 'highland-league') {
      // This would call the Highland League scraper
      return {
        success: false,
        message: 'Highland League scraper not implemented yet'
      };
    } else {
      return {
        success: false,
        message: `Unknown source: ${source}`
      };
    }
  } catch (error) {
    console.error('Error triggering fixtures update:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

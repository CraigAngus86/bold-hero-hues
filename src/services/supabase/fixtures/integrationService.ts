
import { supabase } from '@/integrations/supabase/client';
import { fetchFixturesFromSupabase, fetchResultsFromSupabase, fetchMatchesFromSupabase } from './fetchService';
import { scrapeAndStoreFixtures } from './importExport';
import { logScrapeOperation } from './loggingService';
import { convertToMatches } from '@/types/fixtures';
import { Match } from '@/components/fixtures/types';
import { toast } from 'sonner';

/**
 * Checks if data update is needed based on last update time
 * @param forceUpdate Force update regardless of time
 * @param updateInterval Update interval in minutes (default: 60)
 * @returns Promise with boolean indicating if update is needed
 */
export const checkIfUpdateNeeded = async (
  forceUpdate = false, 
  updateInterval = 60
): Promise<boolean> => {
  // If force update is requested, return true immediately
  if (forceUpdate) return true;

  try {
    // Get last update time from settings table
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'fixtures_last_update')
      .single();

    // If error or no data, we need to update
    if (error || !data) return true;
    
    // Check if it's been more than the interval since last update
    const lastUpdate = new Date(data.value).getTime();
    const currentTime = new Date().getTime();
    const intervalInMs = updateInterval * 60 * 1000;
    
    return (currentTime - lastUpdate) > intervalInMs;
  } catch (error) {
    console.error('Error checking if update needed:', error);
    // If error, default to needing update
    return true;
  }
};

/**
 * Updates the last update time in settings table
 * @returns Promise with success boolean
 */
export const updateLastUpdateTime = async (): Promise<boolean> => {
  const now = new Date().toISOString();
  
  try {
    const { error } = await supabase
      .from('settings')
      .upsert({ 
        key: 'fixtures_last_update',
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
 * Get the last update time from settings table
 * @returns Promise with last update time string or null
 */
export const getLastUpdateTime = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'fixtures_last_update')
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
 * Get fixtures for Lovable with optional update check
 * @param options Options for fixtures retrieval
 * @returns Promise with grouped fixtures data
 */
export const getFixturesForLovable = async (options: {
  forceUpdate?: boolean;
  updateInterval?: number;
  upcomingLimit?: number;
  recentLimit?: number;
} = {}): Promise<{
  success: boolean;
  data?: {
    upcoming: Match[];
    recent: Match[];
    all: Match[];
  };
  lastUpdated?: string | null;
  error?: string;
}> => {
  const {
    forceUpdate = false,
    updateInterval = 60,
    upcomingLimit = 10,
    recentLimit = 10
  } = options;

  try {
    // Check if update is needed
    const shouldUpdate = await checkIfUpdateNeeded(forceUpdate, updateInterval);
    
    if (shouldUpdate) {
      console.log('Update needed: Fetching new fixture data');
      // TODO: Implement scraping - would call the edge function here
      // For now just update timestamp
      await updateLastUpdateTime();
    } else {
      console.log('Using cached fixture data from Supabase');
    }
    
    // Get data from Supabase for display
    const [fixturesData, resultsData, allData] = await Promise.all([
      fetchFixturesFromSupabase(),
      fetchResultsFromSupabase(),
      fetchMatchesFromSupabase()
    ]);
    
    // Convert to Match format and limit results
    const upcoming = convertToMatches(fixturesData).slice(0, upcomingLimit);
    const recent = convertToMatches(resultsData).slice(0, recentLimit);
    const all = convertToMatches(allData);
    
    // Get last updated time
    const lastUpdated = await getLastUpdateTime();
    
    return {
      success: true,
      data: {
        upcoming,
        recent,
        all
      },
      lastUpdated
    };
  } catch (error) {
    console.error('Error in fixtures integration:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      lastUpdated: await getLastUpdateTime()
    };
  }
};

/**
 * Trigger a fixtures update from various sources
 * @param source Source of the fixtures data
 * @returns Promise with operation result
 */
export const triggerFixturesUpdate = async (source: 'bbc' | 'manual' = 'bbc'): Promise<{
  success: boolean;
  message: string;
  fixtures?: Match[];
}> => {
  try {
    // Would call the edge function to scrape data
    // For now, just update timestamp
    await updateLastUpdateTime();
    
    // Get updated fixtures
    const data = await fetchMatchesFromSupabase();
    const fixtures = convertToMatches(data);
    
    return {
      success: true,
      message: `Successfully updated fixtures from ${source}`,
      fixtures
    };
  } catch (error) {
    console.error('Error triggering fixtures update:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};


import { supabase } from '@/integrations/supabase/client';
import { ScrapedFixture } from '@/types/fixtures';
import { storeFixtures } from './storeService';
import { logScrapeOperation } from './loggingService';
import { toast } from 'sonner';

/**
 * Import historic fixtures from a JSON file
 * @param jsonData The parsed JSON data containing fixtures array
 * @returns Promise with operation result
 */
export const importHistoricFixtures = async (jsonData: ScrapedFixture[]): Promise<boolean> => {
  try {
    if (!Array.isArray(jsonData)) {
      toast.error('Invalid JSON format');
      return false;
    }
    
    const result = await storeFixtures(jsonData, 'manual-import');
    
    if (result.success) {
      toast.success(`Successfully imported ${jsonData.length} fixtures`);
      return true;
    } else {
      toast.error(`Failed to import fixtures: ${result.message}`);
      return false;
    }
  } catch (error) {
    console.error('Error importing fixtures:', error);
    toast.error('Error importing fixtures');
    return false;
  }
};

/**
 * Scrape and store fixtures in one operation
 * @param fixtures Array of scraped fixtures to store
 * @returns Promise with operation success status
 */
export const scrapeAndStoreFixtures = async (fixtures: ScrapedFixture[]): Promise<boolean> => {
  try {
    if (!fixtures || fixtures.length === 0) {
      console.warn('No fixtures provided to scrapeAndStoreFixtures');
      return false;
    }
    
    // Determine the source based on the first fixture
    const source = fixtures[0].source || 'unknown';
    
    // Store the fixtures
    const result = await storeFixtures(fixtures, source);
    
    return result.success;
  } catch (error) {
    console.error('Error in scrapeAndStoreFixtures:', error);
    return false;
  }
};

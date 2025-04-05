
import { supabase } from '@/integrations/supabase/client';

/**
 * Logs a scrape operation to the database
 * @param source Source of the data (e.g., 'bbc-sport', 'highland-league')
 * @param status Status of the operation (success, error, warning)
 * @param itemsFound Number of items found during scraping
 * @param itemsAdded Number of new items added to the database
 * @param itemsUpdated Number of existing items updated
 * @param errorMessage Optional error message if the operation failed
 * @returns Promise resolving to the logged entry
 */
export const logScrapeOperation = async (
  source: string,
  status: string,
  itemsFound: number,
  itemsAdded: number,
  itemsUpdated: number,
  errorMessage?: string
): Promise<void> => {
  try {
    await supabase.from('scrape_logs').insert({
      source,
      status,
      items_found: itemsFound,
      items_added: itemsAdded,
      items_updated: itemsUpdated,
      error_message: errorMessage
    });
    
    console.log(`Logged ${status} scrape operation from ${source}`);
  } catch (error) {
    console.error('Error logging scrape operation:', error);
  }
};


import { supabase } from '@/integrations/supabase/client';

/**
 * Stores a record of scrape operations
 */
export const logScrapeOperation = async (
  source: string,
  status: 'success' | 'error',
  itemsFound: number,
  itemsAdded: number,
  itemsUpdated: number,
  errorMessage?: string
) => {
  try {
    await supabase.from('scrape_logs').insert([{
      source,
      status,
      items_found: itemsFound,
      items_added: itemsAdded,
      items_updated: itemsUpdated,
      error_message: errorMessage
    }]);
  } catch (error) {
    console.error('Error logging scrape operation:', error);
  }
};

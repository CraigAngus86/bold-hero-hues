
import { supabase } from '@/lib/supabase';

// Log scraping operations for audit and debugging
export const logScrapeOperation = async (
  source: string,
  itemsAdded: number = 0,
  itemsUpdated: number = 0
): Promise<void> => {
  try {
    await supabase.from('scrape_logs').insert({
      source,
      items_added: itemsAdded,
      items_updated: itemsUpdated,
      status: 'success',
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error logging scrape operation:', error);
    // Fail silently - this is just logging
  }
};

// Enhanced logging function with more parameters
export const logScrapeOperationWithDetails = async (
  source: string,
  status: 'success' | 'error' | 'warning',
  itemsFound: number = 0,
  itemsAdded: number = 0, 
  itemsUpdated: number = 0,
  errorMessage?: string | null
): Promise<void> => {
  try {
    await supabase.from('scrape_logs').insert({
      source,
      items_found: itemsFound,
      items_added: itemsAdded,
      items_updated: itemsUpdated,
      status: status,
      error_message: errorMessage,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error logging scrape operation:', error);
    // Fail silently - this is just logging
  }
};


import { supabase } from '@/integrations/supabase/client';

export interface ScrapeLog {
  id: string;
  source: string;
  items_found: number | null;
  items_added: number | null;
  items_updated: number | null;
  status: string;
  error_message: string | null;
  created_at: string;
}

export const getScrapeLogs = async (limit = 50): Promise<ScrapeLog[]> => {
  const { data, error } = await supabase
    .from('scrape_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching scrape logs:', error);
    throw error;
  }
  
  return data || [];
};

export const runFixtureScraper = async (): Promise<{ success: boolean, message: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('scrape-fixtures', {
      body: { source: 'bbc' },
    });
    
    if (error) {
      throw error;
    }
    
    return { 
      success: true, 
      message: data?.message || 'Scraper job started successfully' 
    };
  } catch (error) {
    console.error('Error running fixture scraper:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to run fixture scraper' 
    };
  }
};

export const runLeagueTableScraper = async (): Promise<{ success: boolean, message: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('scrape-league-table', {
      body: { league: 'highland' },
    });
    
    if (error) {
      throw error;
    }
    
    return { 
      success: true, 
      message: data?.message || 'League table scraper job started successfully' 
    };
  } catch (error) {
    console.error('Error running league table scraper:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to run league table scraper' 
    };
  }
};

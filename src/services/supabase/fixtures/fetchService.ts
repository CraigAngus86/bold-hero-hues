
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches all fixtures from Supabase
 * @returns Array of fixtures
 */
export const fetchFixturesFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .eq('is_completed', false)
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching fixtures:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchFixturesFromSupabase:', error);
    return [];
  }
};

/**
 * Fetches all results from Supabase
 * @returns Array of completed fixtures (results)
 */
export const fetchResultsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .eq('is_completed', true)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching results:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchResultsFromSupabase:', error);
    return [];
  }
};

/**
 * Fetches all matches (fixtures and results) from Supabase
 * @returns Array of all matches
 */
export const fetchMatchesFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchMatchesFromSupabase:', error);
    return [];
  }
};

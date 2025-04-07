
import { supabase } from '@/lib/supabase';
import { Fixture } from '@/types/fixtures';

/**
 * Fetch fixtures from Supabase
 */
export async function fetchFixturesFromSupabase(limit = 10, options = {}): Promise<Fixture[]> {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .eq('is_completed', false)
      .order('date', { ascending: true })
      .limit(limit);
      
    if (error) throw error;
    return data as Fixture[] || [];
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return [];
  }
}

/**
 * Fetch results (completed matches) from Supabase
 */
export async function fetchResultsFromSupabase(limit = 10, options = {}): Promise<Fixture[]> {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .eq('is_completed', true)
      .order('date', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return data as Fixture[] || [];
  } catch (error) {
    console.error('Error fetching results:', error);
    return [];
  }
}

/**
 * Fetch both fixtures and results from Supabase
 */
export async function fetchMatchesFromSupabase(limit = 20, options = {}): Promise<Fixture[]> {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return data as Fixture[] || [];
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
}


import { supabase } from '@/lib/supabase';
import { convertToMatches, DBFixture } from '@/types/fixtures';
import { Match } from '@/components/fixtures/types';

/**
 * Fetch fixtures (upcoming matches) from Supabase
 */
export const fetchFixturesFromSupabase = async (): Promise<DBFixture[]> => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .gte('date', today)
      .eq('is_completed', false)
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching fixtures from Supabase:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception when fetching fixtures:', error);
    return [];
  }
};

/**
 * Fetch results (completed matches) from Supabase
 */
export const fetchResultsFromSupabase = async (): Promise<DBFixture[]> => {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .eq('is_completed', true)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching results from Supabase:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception when fetching results:', error);
    return [];
  }
};

/**
 * Fetch all matches from Supabase with optional filters
 */
export const fetchMatchesFromSupabase = async (options?: {
  upcoming?: boolean;
  competition?: string;
  team?: string;
  season?: string;
  limit?: number;
}): Promise<Match[]> => {
  try {
    let query = supabase.from('fixtures').select('*');
    
    // Apply filters if provided
    if (options?.upcoming !== undefined) {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (options.upcoming) {
        query = query
          .gte('date', today)
          .eq('is_completed', false)
          .order('date', { ascending: true });
      } else {
        query = query
          .eq('is_completed', true)
          .order('date', { ascending: false });
      }
    } else {
      query = query.order('date', { ascending: true });
    }
    
    if (options?.competition) {
      query = query.eq('competition', options.competition);
    }
    
    if (options?.team) {
      query = query.or(`home_team.eq.${options.team},away_team.eq.${options.team}`);
    }
    
    if (options?.season) {
      query = query.eq('season', options.season);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching matches from Supabase:', error);
      return [];
    }
    
    // Convert to Match format
    return convertToMatches(data || []);
  } catch (error) {
    console.error('Exception when fetching matches:', error);
    return [];
  }
};

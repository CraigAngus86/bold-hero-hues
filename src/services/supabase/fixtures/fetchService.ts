
import { supabase } from '@/services/supabase/supabaseClient';
import { Fixture } from '@/types/fixtures'; 

/**
 * Fetch all fixtures with optional filters
 */
export async function fetchFixtures(options?: {
  upcomingOnly?: boolean;
  pastOnly?: boolean;
  team?: string;
  competition?: string;
  season?: string;
  limit?: number;
  orderBy?: 'asc' | 'desc';
}) {
  try {
    let query = supabase.from('fixtures').select('*');
    
    // Apply filters if provided
    if (options?.upcomingOnly) {
      query = query.filter('date', 'gte', new Date().toISOString().split('T')[0]);
    }
    
    if (options?.pastOnly) {
      query = query.filter('date', 'lt', new Date().toISOString().split('T')[0]);
    }
    
    if (options?.team) {
      query = query.or(`home_team.eq.${options.team},away_team.eq.${options.team}`);
    }
    
    if (options?.competition) {
      query = query.eq('competition', options.competition);
    }
    
    if (options?.season) {
      query = query.eq('season', options.season);
    }
    
    // Apply ordering
    query = query.order('date', { ascending: options?.orderBy !== 'desc' });
    query = query.order('time');
    
    // Apply limit if provided
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching fixtures:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data: data as Fixture[] };
  } catch (error) {
    console.error('Error in fetchFixtures:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Fetch a single fixture by ID
 */
export async function fetchFixtureById(id: string) {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching fixture:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data: data as Fixture };
  } catch (error) {
    console.error('Error in fetchFixtureById:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Fetch the next upcoming fixture
 */
export async function fetchNextFixture() {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .filter('date', 'gte', new Date().toISOString().split('T')[0])
      .order('date')
      .order('time')
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No results found
        return { success: true, data: null };
      }
      console.error('Error fetching next fixture:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data: data as Fixture };
  } catch (error) {
    console.error('Error in fetchNextFixture:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Fetch the most recent completed fixture
 */
export async function fetchLatestResult() {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .filter('date', 'lt', new Date().toISOString().split('T')[0])
      .is('is_completed', true)
      .order('date', { ascending: false })
      .order('time', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No results found
        return { success: true, data: null };
      }
      console.error('Error fetching latest result:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data: data as Fixture };
  } catch (error) {
    console.error('Error in fetchLatestResult:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}


// @ts-nocheck
import { supabase } from '@/lib/supabase';
import { unwrapPromise, addCountProperty, safeStringArray, ensureResponseWithCount } from '@/lib/supabaseHelpers';

/**
 * Get the count of fixtures
 */
export const getFixturesCount = async (): Promise<{ count: number }> => {
  try {
    const response = await unwrapPromise(
      supabase
        .from('fixtures')
        .select('*', { count: 'exact', head: true })
    );
    
    // Ensure the response has a count property
    const responseWithCount = ensureResponseWithCount(response);
    
    return { 
      count: responseWithCount.count || 0
    };
  } catch (error) {
    console.error('Error getting fixtures count:', error);
    return { count: 0 };
  }
};

/**
 * Get all fixtures
 */
export const getAllFixtures = async () => {
  try {
    const response = await unwrapPromise(
      supabase
        .from('fixtures')
        .select('*')
        .order('date', { ascending: true })
    );
    
    return ensureResponseWithCount(response);
  } catch (error) {
    console.error('Error fetching all fixtures:', error);
    return { data: [], error, count: 0 };
  }
};

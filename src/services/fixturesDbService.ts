import { supabase } from '@/lib/supabase';
import { unwrapPromise, addCountProperty, safeStringArray } from '@/lib/supabaseHelpers';

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
    
    return { 
      count: response.count || 0
    };
  } catch (error) {
    console.error('Error getting fixtures count:', error);
    return { count: 0 };
  }
};

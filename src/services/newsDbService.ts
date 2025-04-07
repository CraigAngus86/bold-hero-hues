import { supabase } from '@/lib/supabase';
import { unwrapPromise, addCountProperty } from '@/lib/supabaseHelpers';

/**
 * Get the count of news articles
 */
export const getNewsArticlesCount = async (): Promise<{ count: number }> => {
  try {
    const response = await unwrapPromise(
      supabase
        .from('news_articles')
        .select('*', { count: 'exact', head: true })
    );
    
    return { 
      count: response.count || 0 
    };
  } catch (error) {
    console.error('Error getting news articles count:', error);
    return { count: 0 };
  }
};

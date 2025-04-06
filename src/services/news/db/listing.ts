
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle, NewsQueryOptions } from '@/types';

export async function fetchNewsArticles(options: NewsQueryOptions = {}): Promise<{
  articles: NewsArticle[];
  count: number;
}> {
  try {
    // Build the base query
    let query = supabase
      .from('news_articles')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (options.page !== undefined && options.pageSize !== undefined) {
      const from = options.page * options.pageSize;
      const to = from + options.pageSize - 1;
      query = query.range(from, to);
    } else if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.category && options.category !== 'All Categories') {
      query = query.eq('category', options.category);
    }
    
    if (options.featured) {
      query = query.eq('is_featured', true);
    }
    
    // Apply ordering
    const orderBy = options.orderBy || 'publish_date';
    const orderDirection = options.orderDirection || 'desc';
    query = query.order(orderBy, { ascending: orderDirection === 'asc' });
    
    // Execute query
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      articles: data as NewsArticle[],
      count: count || 0
    };
    
  } catch (error) {
    console.error('Error fetching news articles:', error);
    throw error;
  }
}

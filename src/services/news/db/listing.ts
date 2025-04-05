
import { supabase } from '@/services/supabase/supabaseClient';
import { NewsArticle, NewsQueryOptions } from '@/types';
import { showErrorToUser } from '@/utils/errorHandling';

const DEFAULT_PAGE_SIZE = 10;

/**
 * Fetch news articles with pagination and filtering options
 */
export async function getArticles(options?: NewsQueryOptions): Promise<{ data: NewsArticle[]; count: number | null }> {
  try {
    const {
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      category,
      featured,
      orderBy = 'publish_date',
      orderDirection = 'desc',
    } = options || {};

    // Start building the query
    let query = supabase
      .from('news_articles')
      .select('*', { count: 'exact' }) as any;

    // Apply filters if provided
    if (category) {
      query = query.eq('category', category);
    }

    if (featured !== undefined) {
      query = query.eq('is_featured', featured);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Apply ordering and pagination
    const { data, error, count } = await query
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(from, to);

    if (error) {
      throw error;
    }

    return {
      data: data as NewsArticle[],
      count,
    };
  } catch (error) {
    console.error('Error fetching news articles:', error);
    showErrorToUser(error, 'Failed to load news articles');
    return { data: [], count: null };
  }
}

/**
 * Find featured articles
 */
export async function getFeaturedArticles(limit = 3): Promise<NewsArticle[]> {
  try {
    const { data, error } = await (supabase
      .from('news_articles')
      .select('*')
      .eq('is_featured', true)
      .order('publish_date', { ascending: false })
      .limit(limit) as any);

    if (error) {
      throw error;
    }

    return data as NewsArticle[];
  } catch (error) {
    console.error('Error fetching featured news articles:', error);
    showErrorToUser(error, 'Failed to load featured articles');
    return [];
  }
}

/**
 * Get all unique categories
 */
export async function getNewsCategories(): Promise<string[]> {
  try {
    const { data, error } = await (supabase
      .from('news_articles')
      .select('category') as any);

    if (error) {
      throw error;
    }

    // Extract unique categories and explicitly cast to string[]
    const categories = [...new Set(data.map((item: any) => item.category))] as string[];
    return categories;
  } catch (error) {
    console.error('Error fetching news categories:', error);
    showErrorToUser(error, 'Failed to load news categories');
    return [];
  }
}

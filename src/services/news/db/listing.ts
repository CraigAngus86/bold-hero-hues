
import { supabase } from '@/integrations/supabase/client';
import { NewsQueryOptions } from '../types';
import { NewsArticle } from '@/types';

/**
 * Fetch news articles with optional filtering
 */
export const fetchNewsArticles = async (options: NewsQueryOptions = {}) => {
  try {
    const {
      limit,
      category,
      featured,
      orderBy = 'publish_date',
      orderDirection = 'desc',
      page = 1,
      pageSize = 10
    } = options;

    let query = supabase
      .from('news_articles')
      .select('*', { count: 'exact' });

    // Apply category filter
    if (category) {
      query = query.eq('category', category);
    }

    // Apply featured filter
    if (featured !== undefined) {
      query = query.eq('is_featured', featured);
    }

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    query = query
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(startIndex, startIndex + pageSize - 1);

    // Apply limit if specified (overrides pagination)
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return { 
      success: true, 
      data: data || [], 
      count: count || 0 
    };
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return { 
      success: false, 
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error fetching articles'
    };
  }
};

/**
 * Get available news categories
 */
export const getNewsCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('news_categories')
      .select('name');

    if (error) throw error;

    // Extract category names from response
    return data.map(category => category.name);
  } catch (error) {
    console.error('Error fetching news categories:', error);
    return [];
  }
};

/**
 * Toggle featured status of an article
 */
export const toggleArticleFeatured = async (id: string, isFeatured: boolean) => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .update({ is_featured: isFeatured })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error updating article featured status:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error updating article'
    };
  }
};

/**
 * Delete a news article
 */
export const deleteNewsArticle = async (id: string) => {
  try {
    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting news article:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error deleting article'
    };
  }
};


import { supabase } from "@/integrations/supabase/client";
import { NewsArticle } from "../types";

export interface NewsQueryOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  category?: string;
  featured?: boolean;
  searchTerm?: string;
}

/**
 * Fetch news articles with optional filtering
 */
export const fetchNewsArticles = async (options: NewsQueryOptions = {}): Promise<{
  success: boolean;
  data?: NewsArticle[];
  count?: number;
  error?: string;
}> => {
  try {
    const {
      page = 1,
      limit = 10,
      orderBy = 'publish_date',
      orderDirection = 'desc',
      category,
      featured,
      searchTerm
    } = options;
    
    const startIndex = (page - 1) * limit;
    
    let query = supabase
      .from('news_articles')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    
    if (featured !== undefined) {
      query = query.eq('is_featured', featured);
    }
    
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
    }
    
    // Apply ordering and pagination
    const { data, error, count } = await query
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(startIndex, startIndex + limit - 1);
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      data: data as NewsArticle[],
      count
    };
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

/**
 * Get unique news categories
 */
export const getNewsCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('category');
    
    if (error) {
      throw error;
    }
    
    // Extract unique categories
    const categories = [...new Set(data.map(item => item.category))].filter(Boolean);
    return categories;
  } catch (error) {
    console.error('Error fetching news categories:', error);
    return [];
  }
};

/**
 * Toggle featured status of an article
 */
export const toggleArticleFeatured = async (id: string, isFeatured: boolean): Promise<NewsArticle> => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .update({ is_featured: isFeatured })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as NewsArticle;
  } catch (error) {
    console.error('Error toggling article featured status:', error);
    throw error;
  }
};

/**
 * Delete a news article
 */
export const deleteNewsArticle = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting news article:', error);
    throw error;
  }
};

// Legacy alias for backward compatibility
export const getArticles = fetchNewsArticles;


import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types';

/**
 * Fetches news articles with optional filtering
 */
export const fetchNewsArticles = async (options: {
  category?: string;
  featured?: boolean; 
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
} = {}) => {
  try {
    let query = supabase
      .from('news_articles')
      .select('*');
    
    // Apply filters if provided in options
    if (options.category) {
      query = query.eq('category', options.category);
    }
    
    if (options.featured !== undefined) {
      query = query.eq('is_featured', options.featured);
    }
    
    // Apply ordering
    if (options.orderBy) {
      query = query.order(options.orderBy, { 
        ascending: options.orderDirection === 'asc'
      });
    } else {
      // Default ordering by publish_date, descending
      query = query.order('publish_date', { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return {
      success: true,
      data,
      count: data?.length || 0
    };
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return {
      success: false,
      data: [],
      count: 0,
      error: error.message
    };
  }
};

/**
 * Gets unique categories from news articles
 */
export const getNewsCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('news_categories')
      .select('name')
      .order('name');
    
    if (error) throw error;
    
    return data.map(category => category.name);
  } catch (error) {
    console.error('Error fetching news categories:', error);
    return [];
  }
};

/**
 * Toggles the featured status of a news article
 */
export const toggleArticleFeatured = async (id: string, featured: boolean) => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .update({ is_featured: featured })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error toggling article featured status:', error);
    throw error;
  }
};

/**
 * Delete a news article by ID
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
    throw error;
  }
};

// Export aliases for backward compatibility
export const getArticles = fetchNewsArticles;

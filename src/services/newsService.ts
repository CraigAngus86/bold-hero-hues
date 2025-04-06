
import { supabase } from "@/integrations/supabase/client";
import { createSlug } from "@/lib/utils";
import { NewsArticle, NewsQueryOptions, CreateNewsArticleData, UpdateNewsArticleData } from "@/types";

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
 * Get a single news article by its ID
 */
export const getNewsArticleById = async (id: string): Promise<{
  success: boolean;
  data?: NewsArticle;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      data: data as NewsArticle
    };
  } catch (error) {
    console.error('Error fetching news article by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

/**
 * Get a single news article by its slug
 */
export const getNewsArticleBySlug = async (slug: string): Promise<{
  success: boolean;
  data?: NewsArticle;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      data: data as NewsArticle
    };
  } catch (error) {
    console.error('Error fetching news article by slug:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

/**
 * Create a new news article
 */
export const createNewsArticle = async (articleData: CreateNewsArticleData): Promise<{
  success: boolean;
  data?: NewsArticle;
  error?: string;
}> => {
  try {
    // Generate a slug if not provided
    const slug = articleData.slug || createSlug(articleData.title);
    
    // Ensure publish_date is set (default to current date)
    const publish_date = articleData.publish_date || new Date().toISOString();
    
    const { data, error } = await supabase
      .from('news_articles')
      .insert([{ ...articleData, slug, publish_date }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      data: data as NewsArticle
    };
  } catch (error) {
    console.error('Error creating news article:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

/**
 * Update an existing news article
 */
export const updateNewsArticle = async (id: string, updates: UpdateNewsArticleData): Promise<{
  success: boolean;
  data?: NewsArticle;
  error?: string;
}> => {
  try {
    // If title is being updated, update the slug as well unless slug is explicitly provided
    if (updates.title && !updates.slug) {
      updates.slug = createSlug(updates.title);
    }
    
    const { data, error } = await supabase
      .from('news_articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      data: data as NewsArticle
    };
  } catch (error) {
    console.error('Error updating news article:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

/**
 * Delete a news article
 */
export const deleteNewsArticle = async (id: string): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting news article:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

/**
 * Toggle featured status of an article
 */
export const toggleArticleFeatured = async (id: string, isFeatured: boolean): Promise<{
  success: boolean;
  data?: NewsArticle;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .update({ is_featured: isFeatured })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      data: data as NewsArticle
    };
  } catch (error) {
    console.error('Error toggling article featured status:', error);
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

// Format date for display
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

// Format date for DB storage
export const getDbDateFormat = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  } catch (e) {
    return dateString;
  }
};

// Get ISO date string
export const getISODateString = (date = new Date()): string => {
  return date.toISOString();
};

// Create a short excerpt from content
export const createExcerpt = (content: string, maxLength = 150): string => {
  if (!content) return '';
  
  // Strip HTML tags
  const strippedContent = content.replace(/<[^>]*>/g, ' ');
  
  // Trim and limit length
  if (strippedContent.length <= maxLength) {
    return strippedContent.trim();
  }
  
  return strippedContent.substring(0, maxLength).trim() + '...';
};

// Legacy alias for backward compatibility
export const getNewsArticles = fetchNewsArticles;

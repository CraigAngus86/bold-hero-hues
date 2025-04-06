
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types';
import { generateSlug } from './slug';

/**
 * Creates a new news article
 */
export const createNewsArticle = async (article: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // Generate a slug based on the title if not provided
    const slug = article.slug || await generateSlug(article.title);
    
    // Insert the article with the generated or provided slug
    const { data, error } = await supabase
      .from('news_articles')
      .insert({
        ...article,
        slug,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error creating news article:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

/**
 * Updates an existing news article
 */
export const updateNewsArticle = async (id: string, updates: Partial<NewsArticle>) => {
  try {
    // If title is being updated and slug isn't, generate a new slug
    if (updates.title && !updates.slug) {
      updates.slug = await generateSlug(updates.title);
    }
    
    const { data, error } = await supabase
      .from('news_articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error updating news article:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

/**
 * Gets a news article by ID
 */
export const getNewsArticleById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error fetching news article by ID:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

/**
 * Gets a news article by slug
 */
export const getNewsArticleBySlug = async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error fetching news article by slug:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

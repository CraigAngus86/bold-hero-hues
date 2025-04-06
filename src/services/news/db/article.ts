
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle, CreateNewsArticleData, UpdateNewsArticleData } from '@/types';
import { generateSlug } from '../db/slug';

/**
 * Get a news article by ID
 */
export const getNewsArticleById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching news article by ID:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error fetching article'
    };
  }
};

/**
 * Get a news article by slug
 */
export const getNewsArticleBySlug = async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching news article by slug:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error fetching article'
    };
  }
};

/**
 * Create a new news article
 */
export const createNewsArticle = async (articleData: CreateNewsArticleData) => {
  try {
    // Generate a slug if not provided
    if (!articleData.slug) {
      articleData.slug = await generateSlug(articleData.title);
    }

    const { data, error } = await supabase
      .from('news_articles')
      .insert([articleData])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error creating news article:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error creating article'
    };
  }
};

/**
 * Update an existing news article
 */
export const updateNewsArticle = async (id: string, updates: UpdateNewsArticleData) => {
  try {
    // If title is updated, update slug as well unless slug is explicitly provided
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

    return { success: true, data };
  } catch (error) {
    console.error('Error updating news article:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error updating article'
    };
  }
};

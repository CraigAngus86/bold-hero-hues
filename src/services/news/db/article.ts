
import { supabase } from "@/integrations/supabase/client";
import { createSlug } from "@/lib/utils";
import { NewsArticle, CreateNewsArticleData, UpdateNewsArticleData } from "../types";

/**
 * Get a single news article by its ID
 */
export const getNewsArticleById = async (id: string): Promise<NewsArticle | null> => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      // If no article found, return null
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return data as NewsArticle;
  } catch (error) {
    console.error('Error fetching news article by ID:', error);
    throw error;
  }
};

/**
 * Get a single news article by its slug
 */
export const getNewsArticleBySlug = async (slug: string): Promise<NewsArticle | null> => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      // If no article found, return null
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return data as NewsArticle;
  } catch (error) {
    console.error('Error fetching news article by slug:', error);
    throw error;
  }
};

/**
 * Create a new news article
 */
export const createNewsArticle = async (articleData: CreateNewsArticleData): Promise<NewsArticle> => {
  try {
    // Generate a slug if not provided
    const slug = articleData.slug || createSlug(articleData.title);
    
    // Ensure publish_date is set (default to current date)
    const publish_date = articleData.publish_date || new Date().toISOString();
    
    // Prepare the article data with required fields
    const article = {
      title: articleData.title,
      content: articleData.content,
      category: articleData.category,
      slug,
      publish_date,
      author: articleData.author || null,
      image_url: articleData.image_url || null,
      is_featured: articleData.is_featured || false
    };
    
    const { data, error } = await supabase
      .from('news_articles')
      .insert([article])
      .select()
      .single();
    
    if (error) throw error;
    
    return data as NewsArticle;
  } catch (error) {
    console.error('Error creating news article:', error);
    throw error;
  }
};

/**
 * Update an existing news article
 */
export const updateNewsArticle = async (id: string, updates: UpdateNewsArticleData): Promise<NewsArticle> => {
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
    
    if (error) throw error;
    
    return data as NewsArticle;
  } catch (error) {
    console.error('Error updating news article:', error);
    throw error;
  }
};

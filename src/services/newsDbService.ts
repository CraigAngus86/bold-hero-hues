
import { supabase } from '@/services/supabase/supabaseClient';
import { handleDbOperation, DbServiceResponse } from './utils/dbService';
import { toast } from 'sonner';

export interface NewsArticle {
  id?: string;
  title: string;
  content: string;
  image_url?: string;
  category: string;
  slug: string;
  publish_date: string;
  author?: string;
  is_featured: boolean;
}

/**
 * Fetch all news articles
 */
export async function fetchNewsArticles(): Promise<DbServiceResponse<NewsArticle[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('publish_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    'Failed to fetch news articles'
  );
}

/**
 * Fetch a news article by id
 */
export async function fetchNewsArticleById(id: string): Promise<DbServiceResponse<NewsArticle>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    `Failed to fetch news article with id ${id}`
  );
}

/**
 * Create a news article
 */
export async function createNewsArticle(article: Omit<NewsArticle, 'id'>): Promise<DbServiceResponse<NewsArticle>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .insert(article)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    'Failed to create news article'
  );
}

/**
 * Update a news article
 */
export async function updateNewsArticle(id: string, article: Partial<NewsArticle>): Promise<DbServiceResponse<NewsArticle>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .update(article)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    `Failed to update news article with id ${id}`
  );
}

/**
 * Delete a news article
 */
export async function deleteNewsArticle(id: string): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      const { error } = await supabase
        .from('news_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },
    `Failed to delete news article with id ${id}`
  );
}

/**
 * Fetch featured news articles
 */
export async function fetchFeaturedNewsArticles(limit = 5): Promise<DbServiceResponse<NewsArticle[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('is_featured', true)
        .order('publish_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    'Failed to fetch featured news articles'
  );
}

/**
 * Fetch news articles by category
 */
export async function fetchNewsByCategory(category: string): Promise<DbServiceResponse<NewsArticle[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('category', category)
        .order('publish_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    `Failed to fetch news articles in category ${category}`
  );
}

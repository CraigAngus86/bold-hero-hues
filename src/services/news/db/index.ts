
import { fetchNewsArticles } from './listing';
import { NewsArticle, CreateNewsArticleData, UpdateNewsArticleData } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export { fetchNewsArticles };

// Fetch a single news article by slug
export const fetchNewsArticleBySlug = async (slug: string): Promise<NewsArticle | null> => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No article found with that slug
        return null;
      }
      throw error;
    }
    
    return data as NewsArticle;
  } catch (error) {
    console.error('Error fetching news article by slug:', error);
    throw error;
  }
};

// Create a new news article
export const createNewsArticle = async (articleData: CreateNewsArticleData): Promise<NewsArticle> => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .insert([articleData])
      .select()
      .single();
    
    if (error) throw error;
    
    return data as NewsArticle;
  } catch (error) {
    console.error('Error creating news article:', error);
    throw error;
  }
};

// Update an existing news article
export const updateNewsArticle = async (id: string, updates: UpdateNewsArticleData): Promise<NewsArticle> => {
  try {
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

// Delete a news article
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

// Toggle article featured status
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

// Export both the original function names and the new ones
export { createNewsArticle as createArticle };
export { updateNewsArticle as updateArticle };
export { deleteNewsArticle as deleteArticle };

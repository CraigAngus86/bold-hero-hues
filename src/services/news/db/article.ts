
import { supabase } from '@/services/supabase/supabaseClient';
import { NewsArticle, CreateNewsArticleData, UpdateNewsArticleData } from '@/types';
import { showErrorToUser, createAppError, ErrorType } from '@/utils/errorHandling';

/**
 * Fetch a single news article by ID
 */
export async function getArticleById(id: string): Promise<NewsArticle | null> {
  try {
    const { data, error } = await (supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .single() as any);

    if (error) {
      throw error;
    }

    return data as NewsArticle;
  } catch (error) {
    console.error(`Error fetching news article with ID ${id}:`, error);
    showErrorToUser(error, 'Failed to load the news article');
    return null;
  }
}

/**
 * Fetch a single news article by slug
 */
export async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const { data, error } = await (supabase
      .from('news_articles')
      .select('*')
      .eq('slug', slug)
      .single() as any);

    if (error) {
      throw error;
    }

    return data as NewsArticle;
  } catch (error) {
    console.error(`Error fetching news article with slug ${slug}:`, error);
    showErrorToUser(error, 'Failed to load the news article');
    return null;
  }
}

/**
 * Create a new news article
 */
export async function createArticle(articleData: CreateNewsArticleData): Promise<{ data: NewsArticle | null; error: Error | null }> {
  try {
    // Generate slug if not provided
    if (!articleData.slug) {
      articleData.slug = articleData.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
    }

    const { data, error } = await (supabase
      .from('news_articles')
      .insert([articleData])
      .select()
      .single() as any);

    if (error) {
      throw error;
    }

    return { data: data as NewsArticle, error: null };
  } catch (error: any) {
    console.error('Error creating news article:', error);
    
    // Check for slug uniqueness error
    if (error.code === '23505' && error.message.includes('slug')) {
      const customError = createAppError(
        'An article with this slug already exists. Please use a different title or slug.',
        ErrorType.VALIDATION,
        error
      );
      showErrorToUser(customError);
      return { data: null, error: customError };
    }
    
    showErrorToUser(error, 'Failed to create the news article');
    return { data: null, error: error as Error };
  }
}

/**
 * Update an existing news article
 */
export async function updateArticle(id: string, articleData: UpdateNewsArticleData): Promise<{ data: NewsArticle | null; error: Error | null }> {
  try {
    const { data, error } = await (supabase
      .from('news_articles')
      .update(articleData as any)
      .eq('id', id)
      .select()
      .single() as any);

    if (error) {
      throw error;
    }

    return { data: data as NewsArticle, error: null };
  } catch (error: any) {
    console.error(`Error updating news article with ID ${id}:`, error);
    
    // Check for slug uniqueness error
    if (error.code === '23505' && error.message.includes('slug')) {
      const customError = createAppError(
        'An article with this slug already exists. Please use a different slug.',
        ErrorType.VALIDATION,
        error
      );
      showErrorToUser(customError);
      return { data: null, error: customError };
    }
    
    showErrorToUser(error, 'Failed to update the news article');
    return { data: null, error: error as Error };
  }
}

/**
 * Delete a news article
 */
export async function deleteArticle(id: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await (supabase
      .from('news_articles')
      .delete()
      .eq('id', id) as any);

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting news article with ID ${id}:`, error);
    showErrorToUser(error, 'Failed to delete the news article');
    return { success: false, error: error as Error };
  }
}

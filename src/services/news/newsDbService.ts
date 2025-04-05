
import { supabase } from '@/services/supabase/supabaseClient';
import { NewsArticle, CreateNewsArticleData, UpdateNewsArticleData, NewsQueryOptions } from '@/types/News';
import { showErrorToUser, safeAsync, ErrorType, createAppError } from '@/utils/errorHandling';

const DEFAULT_PAGE_SIZE = 10;

/**
 * Fetch news articles with pagination and filtering options
 */
export async function getArticles(options?: NewsQueryOptions): Promise<{ data: NewsArticle[]; count: number | null }> {
  try {
    const {
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      category,
      featured,
      orderBy = 'publish_date',
      orderDirection = 'desc',
    } = options || {};

    // Start building the query
    let query = supabase
      .from('news_articles')
      .select('*', { count: 'exact' }) as any;

    // Apply filters if provided
    if (category) {
      query = query.eq('category', category);
    }

    if (featured !== undefined) {
      query = query.eq('is_featured', featured);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Apply ordering and pagination
    const { data, error, count } = await query
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(from, to);

    if (error) {
      throw error;
    }

    return {
      data: data as NewsArticle[],
      count,
    };
  } catch (error) {
    console.error('Error fetching news articles:', error);
    showErrorToUser(error, 'Failed to load news articles');
    return { data: [], count: null };
  }
}

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

/**
 * Find featured articles
 */
export async function getFeaturedArticles(limit = 3): Promise<NewsArticle[]> {
  try {
    const { data, error } = await (supabase
      .from('news_articles')
      .select('*')
      .eq('is_featured', true)
      .order('publish_date', { ascending: false })
      .limit(limit) as any);

    if (error) {
      throw error;
    }

    return data as NewsArticle[];
  } catch (error) {
    console.error('Error fetching featured news articles:', error);
    showErrorToUser(error, 'Failed to load featured articles');
    return [];
  }
}

/**
 * Get all unique categories
 */
export async function getNewsCategories(): Promise<string[]> {
  try {
    const { data, error } = await (supabase
      .from('news_articles')
      .select('category') as any);

    if (error) {
      throw error;
    }

    // Extract unique categories and explicitly cast to string[]
    const categories = [...new Set(data.map((item: any) => item.category))] as string[];
    return categories;
  } catch (error) {
    console.error('Error fetching news categories:', error);
    showErrorToUser(error, 'Failed to load news categories');
    return [];
  }
}

/**
 * Check if a slug is already in use
 */
export async function isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
  try {
    let query = supabase
      .from('news_articles')
      .select('id')
      .eq('slug', slug) as any;
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data.length === 0;
  } catch (error) {
    console.error('Error checking slug availability:', error);
    return false;
  }
}

/**
 * Generate a unique slug based on a title
 */
export async function generateUniqueSlug(title: string): Promise<string> {
  // Basic slug generation
  let baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  if (!baseSlug) {
    baseSlug = 'article';
  }
  
  // Check if the slug is available
  let slug = baseSlug;
  let counter = 1;
  
  while (!(await isSlugAvailable(slug))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Safely migrate existing news data to the database
 */
export async function migrateExistingNewsData(newsItems: any[]): Promise<{ success: boolean; message: string }> {
  try {
    // First check if there are any articles already in the database
    const { count } = await (supabase.from('news_articles').select('*', { count: 'exact', head: true }) as any);
    
    if (count && count > 0) {
      return { 
        success: false, 
        message: `Migration skipped. There are already ${count} articles in the database.`
      };
    }
    
    // Transform the data to match our schema
    const articlesData = newsItems.map(item => ({
      title: item.title,
      content: item.excerpt || 'No content provided',
      image_url: item.image,
      publish_date: item.date,
      category: item.category || 'General',
      is_featured: false,
      slug: item.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-'),
    }));
    
    // Insert data
    const { error } = await (supabase.from('news_articles').insert(articlesData as any) as any);
    
    if (error) {
      throw error;
    }
    
    return { 
      success: true, 
      message: `Successfully migrated ${articlesData.length} news articles to the database.`
    };
  } catch (error) {
    console.error('Error migrating news data:', error);
    return { 
      success: false, 
      message: `Failed to migrate news data: ${(error as Error).message}`
    };
  }
}

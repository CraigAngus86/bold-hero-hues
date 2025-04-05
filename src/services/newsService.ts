
import { supabase } from '@/services/supabase/supabaseClient';
import { 
  NewsArticle, 
  CreateNewsArticleData, 
  UpdateNewsArticleData, 
  NewsQueryOptions 
} from '@/types';
import { handleDbOperation, DbServiceResponse } from './utils/dbService';

/**
 * Get all news articles with optional filtering and pagination
 */
export async function getNewsArticles(options?: NewsQueryOptions): Promise<DbServiceResponse<{ data: NewsArticle[]; count: number | null }>> {
  return handleDbOperation(
    async () => {
      const {
        page = 1,
        pageSize = 10,
        category,
        featured,
        orderBy = 'publish_date',
        orderDirection = 'desc',
      } = options || {};

      // Start building the query
      let query = supabase
        .from('news_articles')
        .select('*', { count: 'exact' });

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

      if (error) throw error;

      return {
        data: data as NewsArticle[],
        count
      };
    },
    'Failed to fetch news articles'
  );
}

/**
 * Get featured news articles
 */
export async function getFeaturedArticles(limit = 3): Promise<DbServiceResponse<NewsArticle[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('is_featured', true)
        .order('publish_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as NewsArticle[];
    },
    'Failed to fetch featured articles'
  );
}

/**
 * Get a single news article by ID
 */
export async function getNewsArticleById(id: string): Promise<DbServiceResponse<NewsArticle>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as NewsArticle;
    },
    `Failed to fetch news article with ID: ${id}`
  );
}

/**
 * Get a single news article by slug
 */
export async function getNewsArticleBySlug(slug: string): Promise<DbServiceResponse<NewsArticle>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as NewsArticle;
    },
    `Failed to fetch news article with slug: ${slug}`
  );
}

/**
 * Create a new news article
 */
export async function createNewsArticle(articleData: CreateNewsArticleData): Promise<DbServiceResponse<NewsArticle>> {
  return handleDbOperation(
    async () => {
      // Generate slug if not provided
      if (!articleData.slug) {
        articleData.slug = articleData.title
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '-');
      }

      const { data, error } = await supabase
        .from('news_articles')
        .insert([articleData])
        .select()
        .single();

      if (error) throw error;
      return data as NewsArticle;
    },
    'Failed to create news article'
  );
}

/**
 * Update an existing news article
 */
export async function updateNewsArticle(id: string, articleData: UpdateNewsArticleData): Promise<DbServiceResponse<NewsArticle>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .update(articleData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as NewsArticle;
    },
    `Failed to update news article with ID: ${id}`
  );
}

/**
 * Toggle featured status of a news article
 */
export async function toggleArticleFeatured(id: string, featured: boolean): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      const { error } = await supabase
        .from('news_articles')
        .update({ is_featured: featured })
        .eq('id', id);

      if (error) throw error;
      return true;
    },
    `Failed to update featured status for article with ID: ${id}`
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
    `Failed to delete news article with ID: ${id}`
  );
}

/**
 * Get all unique categories
 */
export async function getNewsCategories(): Promise<DbServiceResponse<string[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('category');

      if (error) throw error;
      const categories = [...new Set(data.map(item => item.category))] as string[];
      return categories;
    },
    'Failed to fetch news categories'
  );
}

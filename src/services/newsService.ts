
import { 
  fetchNewsArticles as fetchNewsFromDB,
  fetchNewsArticleBySlug as fetchArticleBySlugFromDB,
  createNewsArticle as createArticleInDB,
  updateNewsArticle as updateArticleInDB,
  deleteNewsArticle as deleteArticleFromDB,
} from './news/db';
import { NewsArticle, CreateNewsArticleData, UpdateNewsArticleData, NewsQueryOptions } from '@/types';

// Fetches news articles with optional filtering and pagination
export async function fetchNewsArticles(options: NewsQueryOptions = {}): Promise<{
  articles: NewsArticle[];
  count: number;
}> {
  // Build the options for the DB query
  const dbOptions: NewsQueryOptions = {
    limit: options.limit,
    category: options.category,
    featured: options.featured,
    orderBy: options.orderBy,
    orderDirection: options.orderDirection,
    page: options.page,
    pageSize: options.pageSize
  };
  
  return fetchNewsFromDB(dbOptions);
}

// Fetches a single news article by its slug
export async function fetchNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  return fetchArticleBySlugFromDB(slug);
}

// Creates a new news article
export async function createNewsArticle(data: CreateNewsArticleData): Promise<NewsArticle> {
  return createArticleInDB(data);
}

// Updates an existing news article
export async function updateNewsArticle(id: string, data: UpdateNewsArticleData): Promise<NewsArticle> {
  return updateArticleInDB(id, data);
}

// Deletes a news article
export async function deleteNewsArticle(id: string): Promise<void> {
  return deleteArticleFromDB(id);
}


// @ts-nocheck
import { newsArticles, newsCategories } from './mockData';
import { NewsArticle, NewsQueryOptions, CreateNewsArticleData, UpdateNewsArticleData } from '@/types/news';
import { formatDate, formatTimeAgo } from '@/utils/date';

/**
 * Get all news articles
 * @param options Query options
 * @returns Array of news articles
 */
export async function getNewsArticles(options?: NewsQueryOptions): Promise<NewsArticle[]> {
  // Apply filtering based on options
  let filteredNews = [...newsArticles];
  
  if (options) {
    if (options.category) {
      filteredNews = filteredNews.filter(article => article.category === options.category);
    }
    
    if (options.featured !== undefined) {
      filteredNews = filteredNews.filter(article => article.featured === options.featured);
    }
    
    if (options.tag) {
      filteredNews = filteredNews.filter(article => article.tags?.includes(options.tag!));
    }
    
    if (options.orderBy) {
      filteredNews.sort((a, b) => {
        if (options.orderBy === 'publish_date') {
          return new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime();
        }
        return 0;
      });
    }
    
    if (options.limit) {
      filteredNews = filteredNews.slice(0, options.limit);
    }
  }
  
  return filteredNews;
}

/**
 * Get a news article by ID
 * @param id Article ID
 * @returns News article or null if not found
 */
export async function getNewsArticleById(id: string): Promise<NewsArticle | null> {
  const article = newsArticles.find(article => article.id === id);
  return article || null;
}

/**
 * Get a news article by slug
 * @param slug Article slug
 * @returns News article or null if not found
 */
export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const article = newsArticles.find(article => article.slug === slug);
  return article || null;
}

/**
 * Create a new news article (mock implementation)
 * @param data Article data
 * @returns Created article
 */
export async function createNewsArticle(data: CreateNewsArticleData): Promise<NewsArticle> {
  // In a real implementation, this would save to the database
  const newArticle: NewsArticle = {
    id: `new-${Date.now()}`,
    ...data,
    publish_date: new Date().toISOString(),
    status: data.status || 'draft'
  };
  
  return newArticle;
}

/**
 * Update a news article (mock implementation)
 * @param id Article ID
 * @param data Update data
 * @returns Updated article
 */
export async function updateNewsArticle(id: string, data: UpdateNewsArticleData): Promise<NewsArticle | null> {
  const article = await getNewsArticleById(id);
  if (!article) return null;
  
  // In a real implementation, this would update the database
  return { ...article, ...data };
}

/**
 * Delete a news article (mock implementation)
 * @param id Article ID
 * @returns Success boolean
 */
export async function deleteNewsArticle(id: string): Promise<boolean> {
  // In a real implementation, this would delete from the database
  return true;
}

/**
 * Get news categories
 * @returns Array of category names
 */
export async function getNewsCategories(): Promise<string[]> {
  return newsCategories.map(category => category.name);
}

// Create a useNewsStore hook with Zustand pattern but using React state
// This simulates what you'd get from a real Zustand store
export function useNewsStore() {
  return {
    news: newsArticles,
    categories: newsCategories,
    loading: false,
    error: null,
    fetchNews: async () => {},
    fetchCategories: async () => {},
    formatDate,
    formatTimeAgo
  };
}

// Export functions directly so we can use them elsewhere
export { formatDate, formatTimeAgo };

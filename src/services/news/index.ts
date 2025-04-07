
import { NewsItem, NewsArticle, NewsQueryOptions, CreateNewsArticleData, UpdateNewsArticleData } from '@/types/news';
import { formatDate, formatTimeAgo } from '@/utils/date';

// Re-export for convenience
export * from './api';
export * from './newsDbService';
export * from './mockData';
export { useNewsStore } from '@/hooks/useNewsStore';
export { formatDate, formatTimeAgo };

// Types re-export
export type {
  NewsItem,
  NewsArticle,
  NewsQueryOptions,
  CreateNewsArticleData,
  UpdateNewsArticleData
};

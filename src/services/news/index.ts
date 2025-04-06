
import { useNewsStore } from '@/hooks/useNewsStore';
import { 
  NewsArticle,
  NewsItem,
  NewsQueryOptions,
  CreateNewsArticleData,
  UpdateNewsArticleData 
} from '@/types/news';

// Re-export types for easier importing
export type {
  NewsArticle,
  NewsItem,
  NewsQueryOptions,
  CreateNewsArticleData,
  UpdateNewsArticleData
};

// Re-export the news store hook
export { useNewsStore };

// Format date for display
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

// Convert date to database format
export const getDbDateFormat = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

// Add your API functions here
export * from './api';

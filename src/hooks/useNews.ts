
import { useQuery } from '@tanstack/react-query';
import { getNewsArticles } from '@/services/news/api';
import { NewsQueryOptions, NewsArticle } from '@/types/news';

interface UseNewsResult {
  isLoading: boolean;
  error: Error | null;
  news: {
    data: NewsArticle[];
    count?: number;
  } | null;
  refetch: () => void;
}

interface UseNewsOptions extends NewsQueryOptions {
  pageSize?: number;
}

export const useNews = (options: UseNewsOptions): UseNewsResult => {
  const { pageSize, ...restOptions } = options;
  
  // Convert pageSize to limit for the API
  const queryOptions = {
    ...restOptions,
    limit: pageSize
  };
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['news', queryOptions],
    queryFn: () => getNewsArticles(queryOptions)
  });
  
  return {
    isLoading,
    error: error as Error | null,
    news: data?.success ? data : null,
    refetch
  };
};

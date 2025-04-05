
import { useQuery } from '@tanstack/react-query';
import { getFeaturedArticles } from '@/services/news/db/listing';
import { NewsArticle } from '@/types';
import { useCallback, useMemo } from 'react';

export const useFeaturedArticles = (limit: number = 4) => {
  const query = useQuery<NewsArticle[], Error>({
    queryKey: ['featuredNews', limit],
    queryFn: async () => {
      try {
        const articles = await getFeaturedArticles(limit);
        return articles;
      } catch (error) {
        console.error('Error fetching featured articles:', error);
        throw error;
      }
    },
    // Add retry:false to prevent excessive retries when QueryClient isn't available yet
    retry: false
  });

  // Extract article IDs for excluding from other components
  const articleIds = useMemo(() => {
    return query.data ? query.data.map(article => article.id) : [];
  }, [query.data]);

  return {
    ...query,
    articleIds
  };
};

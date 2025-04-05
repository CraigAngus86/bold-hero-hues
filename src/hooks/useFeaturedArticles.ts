
import { useQuery } from '@tanstack/react-query';
import { getFeaturedArticles } from '@/services/news/db/listing';
import { NewsArticle } from '@/types';

export const useFeaturedArticles = (limit: number = 4) => {
  return useQuery<NewsArticle[], Error>({
    queryKey: ['featuredNews', limit],
    queryFn: async () => {
      try {
        const articles = await getFeaturedArticles(limit);
        return articles;
      } catch (error) {
        console.error('Error fetching featured articles:', error);
        throw error;
      }
    }
  });
};

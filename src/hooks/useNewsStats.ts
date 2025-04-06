
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Keys for React Query
export const newsKeys = {
  stats: ['news', 'stats'],
};

export interface NewsStatsData {
  total: number;
  published: number;
  drafts: number;
}

export const useNewsStats = () => {
  return useQuery({
    queryKey: [...newsKeys.stats],
    queryFn: async (): Promise<NewsStatsData> => {
      try {
        // Get published articles count
        const { count: publishedCount, error: publishedError } = await supabase
          .from('news_articles')
          .select('*', { count: 'exact', head: true })
          .eq('is_featured', true);

        // Get total articles count
        const { count: totalCount, error: totalError } = await supabase
          .from('news_articles')
          .select('*', { count: 'exact', head: true });

        if (publishedError || totalError) {
          throw new Error(publishedError?.message || totalError?.message);
        }

        return {
          total: totalCount || 0,
          published: publishedCount || 0,
          drafts: (totalCount || 0) - (publishedCount || 0),
        };
      } catch (error) {
        console.error("Error fetching news stats:", error);
        // Return fallback data in case of error
        return { total: 0, published: 0, drafts: 0 };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

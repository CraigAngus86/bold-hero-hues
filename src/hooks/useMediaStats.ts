
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Keys for React Query
export const mediaKeys = {
  stats: ['media', 'stats'],
};

export interface MediaStatsData {
  total: number;
  photos: number;
  videos: number;
  albums: number;
}

export const useMediaStats = () => {
  return useQuery({
    queryKey: [...mediaKeys.stats],
    queryFn: async (): Promise<MediaStatsData> => {
      try {
        const { count, error } = await supabase
          .from('image_metadata')
          .select('*', { count: 'exact', head: true });

        if (error) throw error;

        // Mock breakdown by type (in a real app, you'd have proper categories)
        const total = count || 0;
        return {
          total,
          photos: Math.floor(total * 0.7), // 70% are photos
          videos: Math.floor(total * 0.1), // 10% are videos
          albums: Math.floor(total * 0.2), // 20% are albums
        };
      } catch (error) {
        console.error("Error fetching media stats:", error);
        return { total: 0, photos: 0, videos: 0, albums: 0 };
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

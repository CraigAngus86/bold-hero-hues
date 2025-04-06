
import { useQuery } from '@tanstack/react-query';
import { mockActivities } from '@/components/admin/dashboard/ActivityFeed';

// Keys for React Query
export const activityKeys = {
  activities: ['dashboard', 'activities'],
};

export const useActivityFeed = (limit: number = 10) => {
  return useQuery({
    queryKey: [...activityKeys.activities, { limit }],
    queryFn: async () => {
      try {
        // In a real app, fetch from your activity logs table
        // For now, using mock data but in proper implementation:
        // const { data, error } = await supabase.from('admin_activities').select('*').order('timestamp', { ascending: false }).limit(limit);
        
        // Instead, we'll use the mock data but simulate an API call
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockActivities.slice(0, limit);
      } catch (error) {
        console.error("Error fetching activity feed:", error);
        return [];
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

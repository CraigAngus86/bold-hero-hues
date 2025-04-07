
import { useState, useEffect } from 'react';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  type: string;
  user: string;
  timestamp: Date;
}

export const useActivityFeed = (limit: number = 10) => {
  const [data, setData] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      setIsLoading(true);
      try {
        // This would be an API call in a real app
        // Mock data for now
        const mockData: ActivityItem[] = [
          {
            id: '1',
            title: 'Match report published',
            description: 'Match report for Banks o\' Dee vs Formartine United published',
            type: 'article',
            user: 'John Editor',
            timestamp: new Date(Date.now() - 25 * 60 * 1000)
          },
          {
            id: '2',
            title: 'New user registered',
            description: 'A new editor account was created',
            type: 'user',
            user: 'System',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
          },
          {
            id: '3',
            title: 'Fixture updated',
            description: 'Upcoming fixture details were updated',
            type: 'edit',
            user: 'Admin User',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
          },
          {
            id: '4',
            title: 'System backup completed',
            description: 'Automatic backup completed successfully',
            type: 'system',
            user: 'System',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
          },
          {
            id: '5',
            title: 'Image gallery updated',
            description: 'New photos added to match day gallery',
            type: 'create',
            user: 'Sarah Smith',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          }
        ];
        
        // Add some random delay to simulate API call
        setTimeout(() => {
          setData(mockData.slice(0, limit));
          setIsLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching activity feed:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [limit]);

  const refetch = async () => {
    setIsLoading(true);
    // This would refetch from API in a real app
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return {
    data,
    isLoading,
    error,
    refetch
  };
};


// Make sure this file is properly exporting useCategories
import { useQuery } from '@tanstack/react-query';
import { getNewsCategories } from '@/services/newsService';

export interface NewsCategory {
  id: string;
  name: string;
}

/**
 * Hook to fetch news categories
 * @returns Object containing categories data, loading state, error and refetch function
 */
export const useCategories = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['newsCategories'],
    queryFn: async () => {
      const categories = await getNewsCategories();
      // Transform categories into a standard format if they're not already
      return categories.map((category: string, index: number) => ({
        id: `cat-${index}`,
        name: category
      }));
    }
  });

  return {
    data: data as NewsCategory[],
    isLoading,
    error,
    refetch,
  };
};

export default useCategories;

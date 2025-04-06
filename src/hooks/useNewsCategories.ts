
import { useQuery } from '@tanstack/react-query';
import { fetchNewsCategories } from '@/services/newsCategoryService';

interface NewsCategory {
  id: string;
  name: string;
}

export const useNewsCategories = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['newsCategories'],
    queryFn: fetchNewsCategories,
  });

  return {
    categories: data as NewsCategory[],
    isLoading,
    error,
    refetch,
  };
};

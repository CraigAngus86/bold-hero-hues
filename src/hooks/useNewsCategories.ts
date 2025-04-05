
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNewsCategories } from '@/services/newsService';
import { supabase } from '@/integrations/supabase/client';

export interface NewsCategory {
  id: string;
  name: string;
  created_at?: string;
}

export const useNewsCategories = () => {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['newsCategories'],
    queryFn: async () => {
      // First try to get categories from dedicated table if it exists
      try {
        const { data: categoryData, error: categoryError } = await supabase
          .from('news_categories')
          .select('*')
          .order('name');
          
        if (!categoryError && categoryData) {
          return categoryData as NewsCategory[];
        }
      } catch (e) {
        console.log('News categories table might not exist yet, falling back to distinct values');
      }
      
      // Fallback to distinct categories from news_articles
      const { data: categories } = await getNewsCategories();
      
      if (categories) {
        // Transform string array to object array to match expected interface
        return categories.map((name, index) => ({
          id: `cat-${index}`,
          name
        }));
      }
      
      return [];
    }
  });
  
  return {
    categories: data,
    isLoading,
    error
  };
};


import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NewsCategory {
  id: string;
  name: string;
  created_at?: string;
}

export const useNewsCategories = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['newsCategories'],
    queryFn: async () => {
      try {
        // Using a type assertion to work around the TypeScript restriction
        const { data: categoryData, error: categoryError } = await (supabase
          .from('news_categories') as any)
          .select('*')
          .order('name');
          
        if (!categoryError && categoryData) {
          return categoryData as NewsCategory[];
        }
        
        throw new Error('Failed to fetch categories');
      } catch (e) {
        console.log('Error fetching categories, falling back to distinct values');
        
        // Fallback to distinct categories from news_articles
        const { data: articles } = await supabase
          .from('news_articles')
          .select('category');
        
        if (articles) {
          // Get unique categories
          const uniqueCategories = [...new Set(articles.map(a => a.category))];
          
          // Transform string array to object array to match expected interface
          return uniqueCategories.map((name, index) => ({
            id: `cat-${index}`,
            name
          }));
        }
        
        return [];
      }
    }
  });
  
  return {
    categories: data,
    isLoading,
    error
  };
};

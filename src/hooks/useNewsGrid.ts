
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { NewsArticle } from '@/types/news';

interface UseNewsGridResult {
  articles: NewsArticle[];
  isLoading: boolean;
  error: Error | null;
}

export const useNewsGrid = (limit = 6, excludeFeatured = true): UseNewsGridResult => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      
      try {
        let query = supabase
          .from('news_articles')
          .select('*')
          .order('publish_date', { ascending: false });
          
        if (excludeFeatured) {
          query = query.eq('is_featured', false);
        }
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        
        setArticles(data || []);
      } catch (err) {
        console.error('Error fetching news articles:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch news articles'));
        toast.error('Failed to load news articles');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, [limit, excludeFeatured]);
  
  return {
    articles,
    isLoading,
    error
  };
};

export default useNewsGrid;


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types/news';

export interface NewsGridData {
  articles: NewsArticle[];
  isLoading: boolean;
  error: Error | null;
}

export const useNewsGrid = (excludeFeatured = true, limit = 3): NewsGridData => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let query = supabase
          .from('news_articles')
          .select('*')
          .order('publish_date', { ascending: false })
          .limit(limit);
        
        // Exclude featured articles if needed
        if (excludeFeatured) {
          query = query.eq('is_featured', false);
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        
        setArticles(data || []);
      } catch (err) {
        console.error('Error fetching news articles:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch news articles'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticles();
  }, [excludeFeatured, limit]);
  
  return {
    articles,
    isLoading,
    error
  };
};

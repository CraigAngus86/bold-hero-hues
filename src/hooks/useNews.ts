
import { useQuery } from '@tanstack/react-query';
import { NewsArticle } from '@/types/news';
import { newsArticles } from '@/services/news/mockData';

interface UseNewsOptions {
  category?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
}

interface NewsResult {
  data: NewsArticle[];
  count: number;
}

export const useNews = (options: UseNewsOptions = {}) => {
  const { category, featured, page = 1, pageSize = 10 } = options;

  const fetchNews = async (): Promise<NewsResult> => {
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Apply filters
    let filteredArticles = [...newsArticles];
    
    if (category && category !== 'all') {
      filteredArticles = filteredArticles.filter(article => article.category === category);
    }
    
    if (featured !== undefined) {
      filteredArticles = filteredArticles.filter(article => article.is_featured === featured);
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
    
    return {
      data: paginatedArticles,
      count: filteredArticles.length
    };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['news', { category, featured, page, pageSize }],
    queryFn: fetchNews
  });

  return {
    news: data,
    isLoading,
    error
  };
};

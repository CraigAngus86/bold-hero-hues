
import React, { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getArticles } from '@/services/news/db/listing';
import { NewsArticle } from '@/types';
import { formatDate } from '@/services/news/utils';
import NewsCard from '@/components/news/NewsCard';
import NewsSectionSkeleton from './NewsSectionSkeleton';

interface NewsSectionProps {
  excludeIds?: string[]; // IDs of articles to exclude (e.g., from hero)
  initialCount?: number; // Number of articles to show initially
}

const NewsSection: React.FC<NewsSectionProps> = ({ 
  excludeIds = [], 
  initialCount = 6 
}) => {
  // Fetch latest news articles
  const { data, isLoading, error } = useQuery({
    queryKey: ['latestNews', initialCount, excludeIds],
    queryFn: async () => {
      const response = await getArticles({
        page: 1,
        pageSize: initialCount + excludeIds.length, // Fetch extra to account for excluded items
        orderBy: 'publish_date',
        orderDirection: 'desc'
      });
      return response;
    }
  });

  // Filter out excluded articles and limit to initialCount
  const articles = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return [];
    
    return data.data
      .filter(article => !excludeIds.includes(article.id))
      .slice(0, initialCount);
  }, [data, excludeIds, initialCount]);

  // Memoized render function for NewsCard to prevent unnecessary rerenders
  const renderNewsCard = useCallback((article: NewsArticle, index: number) => {
    return (
      <div key={article.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
        <NewsCard
          title={article.title}
          excerpt={article.content.substring(0, 120).replace(/<[^>]*>?/gm, '')}
          image={article.image_url || '/placeholder.svg'}
          date={formatDate(article.publish_date)}
          category={article.category}
          slug={article.slug}
          size={index === 0 ? 'medium' : 'small'}
        />
      </div>
    );
  }, []);

  // Loading state
  if (isLoading) {
    return <NewsSectionSkeleton count={initialCount} />;
  }

  // Error state
  if (error || !articles) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-team-blue mb-6">Latest News</h2>
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-500">Unable to load news articles. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (articles.length === 0) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-team-blue mb-6">Latest News</h2>
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-500">No news articles available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-team-blue">Latest News</h2>
          
          <Button asChild variant="outline" className="bg-team-lightBlue hover:bg-team-blue hover:text-white text-team-blue">
            <Link to="/news" className="inline-flex items-center">
              View All News <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {articles.map((article, index) => renderNewsCard(article, index))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(NewsSection);

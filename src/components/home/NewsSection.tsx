
import React, { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui';
import { getArticles } from '@/services/news/db/listing';
import { formatDate } from '@/services/news/utils';
import NewsCard from '@/components/news/NewsCard';
import NewsSectionSkeleton from './NewsSectionSkeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const { H2 } = Typography;

interface NewsSectionProps {
  excludeIds?: string[]; // IDs of articles to exclude (e.g., from hero)
  initialCount?: number; // Total number of articles to show initially
}

const NewsSection: React.FC<NewsSectionProps> = ({ 
  excludeIds = [], 
  initialCount = 9 // Updated: 1 featured article (6x6) + 8 standard articles (3x3 each)
}) => {
  const isMobile = useIsMobile();
  const mobileCount = 4; // Limit to 4 articles on mobile
  
  // Adjust count based on mobile or desktop view
  const displayCount = isMobile ? mobileCount : initialCount;
  
  // Increase the fetch count to ensure we have enough articles
  const fetchCount = initialCount + 4; // Fetch extra to account for filtering

  // Fetch latest news articles
  const { data, isLoading, error } = useQuery({
    queryKey: ['latestNews', fetchCount, excludeIds],
    queryFn: async () => {
      const response = await getArticles({
        page: 1,
        pageSize: fetchCount + excludeIds.length, // Fetch extra to account for excluded items
        orderBy: 'publish_date',
        orderDirection: 'desc'
      });
      return response;
    }
  });

  // Separate featured article and regular articles
  const { featuredArticle, regularArticles } = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) {
      return { featuredArticle: null, regularArticles: [] };
    }
    
    const filteredArticles = data.data
      .filter(article => !excludeIds.includes(article.id));
    
    // Featured article is the most recent one
    const featured = filteredArticles.length > 0 ? filteredArticles[0] : null;
    
    // Regular articles are the rest, limited to displayCount-1 (since one is featured)
    const regular = featured 
      ? filteredArticles.slice(1, displayCount)
      : filteredArticles.slice(0, displayCount);
    
    return { featuredArticle: featured, regularArticles: regular };
  }, [data, excludeIds, displayCount]);

  // Get a local image fallback based on article index
  const getLocalImageFallback = (index: number) => {
    const localImages = [
      '/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png',
      '/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png',
      '/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png',
      '/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png',
      '/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png',
      '/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png',
      '/lovable-uploads/b937e144-e94f-4e75-881f-1e560c6b520a.png',
      '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png',
      '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
      '/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png',
      '/lovable-uploads/ba4e2b09-12ed-48ad-a4ba-1162ab87ad70.png',
      '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png'
    ];
    return localImages[index % localImages.length];
  };

  // Process excerpt - strip HTML and limit length
  const processExcerpt = (content: string, isFeature: boolean = false) => {
    const maxLength = isFeature ? 250 : 120;
    return content
      .replace(/<[^>]*>?/gm, '')
      .substring(0, maxLength) + '...';
  };

  // Loading state
  if (isLoading) {
    return <NewsSectionSkeleton count={displayCount - 1} featured={true} />;
  }

  // Error state
  if (error || !regularArticles) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <H2 className="mb-6">Latest News</H2>
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-500">Unable to load news articles. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (regularArticles.length === 0 && !featuredArticle) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <H2 className="mb-6">Latest News</H2>
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-500">No news articles available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <H2>Latest News</H2>
        
        <Button asChild variant="outline">
          <Link to="/news" className="inline-flex items-center">
            View All News <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Featured Article - 6x6 grid area (spans 6 columns, height of 2 rows) */}
        {featuredArticle && (
          <div className="col-span-12 md:col-span-6 row-span-2">
            <NewsCard
              title={featuredArticle.title}
              excerpt={processExcerpt(featuredArticle.content, true)}
              image={featuredArticle.image_url || getLocalImageFallback(0)}
              date={formatDate(featuredArticle.publish_date)}
              category={featuredArticle.category}
              slug={featuredArticle.slug}
              size="large"
              className="h-full"
            />
          </div>
        )}
        
        {/* 8 standard articles in 3x3 grid format */}
        {regularArticles.map((article, index) => (
          <div 
            key={article.id} 
            className="col-span-12 sm:col-span-6 md:col-span-3"
          >
            <NewsCard
              title={article.title}
              excerpt={processExcerpt(article.content)}
              image={article.image_url || getLocalImageFallback(index + 1)}
              date={formatDate(article.publish_date)}
              category={article.category}
              slug={article.slug}
              size="small"
              className="h-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(NewsSection);

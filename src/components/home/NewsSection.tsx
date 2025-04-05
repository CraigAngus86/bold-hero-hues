
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
  initialCount?: number; // Total number of articles to show initially
}

const NewsSection: React.FC<NewsSectionProps> = ({ 
  excludeIds = [], 
  initialCount = 7 // Adjust the number based on the new grid layout (1 featured + 6 standard)
}) => {
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
    
    // Regular articles are the rest, limited to initialCount-1 (since one is featured)
    const regular = featured 
      ? filteredArticles.slice(1, initialCount) 
      : filteredArticles.slice(0, initialCount);
    
    return { featuredArticle: featured, regularArticles: regular };
  }, [data, excludeIds, initialCount]);

  // Get a local image fallback based on article index
  const getLocalImageFallback = (index: number) => {
    const localImages = [
      '/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png',
      '/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png',
      '/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png',
      '/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png',
      '/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png',
      '/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png',
      '/lovable-uploads/b937e144-e94f-4e75-881f-1e560c6b520a.png'
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
    return <NewsSectionSkeleton count={initialCount - 1} featured={true} />;
  }

  // Error state
  if (error || !regularArticles) {
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
  if (regularArticles.length === 0 && !featuredArticle) {
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-team-blue">Latest News</h2>
          
          <Button asChild variant="outline" className="bg-team-lightBlue hover:bg-team-blue hover:text-white text-team-blue">
            <Link to="/news" className="inline-flex items-center">
              View All News <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Featured Article - 6 columns on desktop */}
          {featuredArticle && (
            <div className="col-span-12 md:col-span-6">
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
          
          {/* Right side stacked articles - 2 articles of 3 columns each */}
          <div className="col-span-12 md:col-span-6">
            <div className="grid grid-cols-12 gap-6 h-full">
              {/* Top right article */}
              {regularArticles[0] && (
                <div className="col-span-12 sm:col-span-6 md:col-span-12 lg:col-span-6 xl:col-span-6 h-[calc(50%-0.75rem)]">
                  <NewsCard
                    title={regularArticles[0].title}
                    excerpt={processExcerpt(regularArticles[0].content)}
                    image={regularArticles[0].image_url || getLocalImageFallback(1)}
                    date={formatDate(regularArticles[0].publish_date)}
                    category={regularArticles[0].category}
                    slug={regularArticles[0].slug}
                    size="medium"
                    className="h-full"
                  />
                </div>
              )}
              
              {/* Bottom right article */}
              {regularArticles[1] && (
                <div className="col-span-12 sm:col-span-6 md:col-span-12 lg:col-span-6 xl:col-span-6 h-[calc(50%-0.75rem)]">
                  <NewsCard
                    title={regularArticles[1].title}
                    excerpt={processExcerpt(regularArticles[1].content)}
                    image={regularArticles[1].image_url || getLocalImageFallback(2)}
                    date={formatDate(regularArticles[1].publish_date)}
                    category={regularArticles[1].category}
                    slug={regularArticles[1].slug}
                    size="medium"
                    className="h-full"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Bottom row - 4 articles of 3 columns each */}
          {regularArticles.slice(2, 6).map((article, index) => (
            <div key={article.id} className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-3">
              <NewsCard
                title={article.title}
                excerpt={processExcerpt(article.content)}
                image={article.image_url || getLocalImageFallback(index + 3)}
                date={formatDate(article.publish_date)}
                category={article.category}
                slug={article.slug}
                size="small"
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(NewsSection);

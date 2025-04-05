
import { useCallback, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/home/HeroSection';
import NewsCard from '@/components/NewsCard';
import SponsorsCarousel from '@/components/SponsorsCarousel';
import FixturesSection from '@/components/FixturesSection';
import SocialMediaFeed from '@/components/SocialMediaFeed';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';
import { useNewsStore } from '@/services/news/newsStore';
import { formatDate } from '@/services/news/utils';
import ErrorBoundary from '@/components/ErrorBoundary';

const Index = () => {
  const { news } = useNewsStore();
  
  // Memoize sorted news to prevent unnecessary recalculations
  const sortedNews = useMemo(() => {
    if (!news || !Array.isArray(news)) return [];
    return [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [news]);
  
  // Get latest news items after the hero (which uses the first 3)
  const latestNews = useMemo(() => {
    return sortedNews.slice(3, 10);
  }, [sortedNews]);
  
  // Render news card with memo to prevent unnecessary rerenders
  const renderNewsCard = useCallback((newsItem: any, index: number, isFeatureCard = false) => {
    if (!newsItem) return null;
    
    return (
      <NewsCard
        key={newsItem.id}
        title={newsItem.title}
        excerpt={newsItem.excerpt}
        image={newsItem.image}
        date={formatDate(newsItem.date)}
        category={newsItem.category}
        featured={isFeatureCard}
        className="h-full"
      />
    );
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section - Updated to new component */}
      <ErrorBoundary>
        <HeroSection />
      </ErrorBoundary>
      
      {/* Latest News - with fixed grid layout */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-team-blue">Latest News</h2>
            
            <a 
              href="/news" 
              className="inline-flex items-center bg-team-lightBlue hover:bg-team-blue hover:text-white text-team-blue px-4 py-2 rounded-md transition-colors"
            >
              View All News <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
          
          <ErrorBoundary>
            <div className="grid grid-cols-12 gap-6">
              {latestNews.length > 0 ? (
                <>
                  {/* First item is large (spans 6x3) */}
                  {latestNews[0] && (
                    <div className="col-span-12 md:col-span-6">
                      {renderNewsCard(latestNews[0], 0, true)}
                    </div>
                  )}
                  
                  {/* All other items are small (3x3) */}
                  {latestNews.slice(1).map((newsItem, idx) => (
                    <div key={newsItem.id} className="col-span-12 sm:col-span-6 md:col-span-3">
                      {renderNewsCard(newsItem, idx + 1)}
                    </div>
                  ))}
                </>
              ) : (
                <div className="col-span-12 py-12 text-center text-gray-500">
                  <p>No news items available at the moment.</p>
                </div>
              )}
            </div>
          </ErrorBoundary>
        </div>
      </section>
      
      {/* Fixtures, Results & Table Section */}
      <ErrorBoundary>
        <FixturesSection />
      </ErrorBoundary>
      
      {/* Social Media Feed Section - moved below fixtures */}
      <ErrorBoundary>
        <SocialMediaFeed />
      </ErrorBoundary>
      
      {/* Sponsors Carousel */}
      <ErrorBoundary>
        <SponsorsCarousel />
      </ErrorBoundary>
      
      <Footer />
    </div>
  );
};

export default Index;


import { useCallback, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/home/HeroSection';
import NewsSection from '@/components/home/NewsSection';
import FixturesSection from '@/components/FixturesSection';
import SponsorsCarousel from '@/components/SponsorsCarousel';
import SocialMediaFeed from '@/components/SocialMediaFeed';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useFeaturedArticles } from '@/hooks/useFeaturedArticles';

const Index = () => {
  // Get featured articles IDs to exclude from news section
  const { articleIds: featuredArticleIds } = useFeaturedArticles(4);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <ErrorBoundary>
        <HeroSection />
      </ErrorBoundary>
      
      {/* Latest News */}
      <ErrorBoundary>
        <NewsSection excludeIds={featuredArticleIds} initialCount={6} />
      </ErrorBoundary>
      
      {/* Fixtures, Results & League Table Section */}
      <ErrorBoundary>
        <FixturesSection />
      </ErrorBoundary>
      
      {/* Social Media Feed Section */}
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

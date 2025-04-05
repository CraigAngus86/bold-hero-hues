
import { useCallback, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/home/HeroSection';
import NewsSection from '@/components/home/NewsSection';
import FixturesSection from '@/components/FixturesSection';
import SocialFanSection from '@/components/home/SocialFanSection';
import MediaGalleryModern from '@/components/home/MediaGalleryModern';
import SponsorsSection from '@/components/home/SponsorsSection';
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
      
      {/* Latest News - updated to show 9 articles in a 12x12 grid */}
      <ErrorBoundary>
        <NewsSection excludeIds={featuredArticleIds} initialCount={9} />
      </ErrorBoundary>
      
      {/* Fixtures, Results & League Table Section */}
      <ErrorBoundary>
        <FixturesSection />
      </ErrorBoundary>
      
      {/* Combined Social Media and Fan Zone Section */}
      <ErrorBoundary>
        <SocialFanSection />
      </ErrorBoundary>
      
      {/* Media Gallery - Modern Implementation */}
      <ErrorBoundary>
        <MediaGalleryModern />
      </ErrorBoundary>
      
      {/* Sponsors Section */}
      <ErrorBoundary>
        <SponsorsSection />
      </ErrorBoundary>
      
      <Footer />
    </div>
  );
};

export default Index;

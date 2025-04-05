
import { useCallback, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/home/HeroSection';
import NewsSection from '@/components/home/NewsSection';
import FixturesSection from '@/components/FixturesSection';
import SocialHub from '@/components/home/SocialHub';
import MediaGallery from '@/components/home/MediaGallery';
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
      
      {/* Latest News */}
      <ErrorBoundary>
        <NewsSection excludeIds={featuredArticleIds} initialCount={6} />
      </ErrorBoundary>
      
      {/* Fixtures, Results & League Table Section */}
      <ErrorBoundary>
        <FixturesSection />
      </ErrorBoundary>
      
      {/* Social Hub & Fan Zone */}
      <ErrorBoundary>
        <SocialHub />
      </ErrorBoundary>
      
      {/* Media Gallery */}
      <ErrorBoundary>
        <MediaGallery />
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

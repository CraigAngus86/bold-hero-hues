
import React from 'react';
import { Navbar, Footer } from '@/components/layout';
import EnhancedHero from '@/components/home/EnhancedHero';
import FeaturedContentGrid from '@/components/home/FeaturedContentGrid';
import NewsGrid from '@/components/home/NewsGrid';
import MediaGalleryPreview from '@/components/home/MediaGalleryPreview';
import FanEngagement from '@/components/home/FanEngagement';
import SponsorsSection from '@/components/home/SponsorsSection';
import MatchCenter from '@/components/home/MatchCenter';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Enhanced Hero Section */}
      <EnhancedHero />
      
      {/* Featured Content Grid */}
      <FeaturedContentGrid />
      
      {/* News Grid */}
      <NewsGrid />
      
      {/* Match Center */}
      <MatchCenter />
      
      {/* Media Gallery Preview Section */}
      <MediaGalleryPreview />
      
      {/* Fan Engagement Section */}
      <FanEngagement />
      
      {/* Sponsors Section */}
      <SponsorsSection />
      
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default Index;

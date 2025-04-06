
import React from 'react';
import { Navbar, Footer } from '@/components/layout';
import EnhancedHero from '@/components/home/EnhancedHero';
import FeaturedContentGrid from '@/components/home/FeaturedContentGrid';
import NewsGrid from '@/components/home/NewsGrid';
import MatchCenter from '@/components/home/MatchCenter';
import MediaGalleryPreview from '@/components/home/MediaGalleryPreview';
import FanEngagement from '@/components/home/FanEngagement';
import SponsorsSection from '@/components/home/SponsorsSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Enhanced Hero Section */}
      <EnhancedHero />
      
      <div className="py-6">
        {/* Featured Content Grid */}
        <FeaturedContentGrid />
        
        {/* News Grid */}
        <NewsGrid />
        
        {/* Match Center Section */}
        <MatchCenter />
        
        {/* Media Gallery Preview */}
        <MediaGalleryPreview />
        
        {/* Fan Engagement Section */}
        <FanEngagement />
        
        {/* Sponsors Section */}
        <SponsorsSection />
      </div>
      
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default Index;

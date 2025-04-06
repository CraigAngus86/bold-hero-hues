
import React from 'react';
import { Navbar } from '@/components/layout';
import { Footer } from '@/components/layout';
import EnhancedHero from '@/components/home/EnhancedHero';
import FeaturedContentGrid from '@/components/home/FeaturedContentGrid';
import NewsGrid from '@/components/home/NewsGrid';
import LeagueTable from '@/components/LeagueTable';
import MediaGalleryPreview from '@/components/home/MediaGalleryPreview';
import FanEngagement from '@/components/home/FanEngagement';
import SponsorsSection from '@/components/home/SponsorsSection';

const MembershipCTA = () => (
  <div className="bg-team-blue text-white p-6 rounded-lg">
    <h2 className="text-xl font-bold mb-2">Join Our Club</h2>
    <p className="mb-4">Become a member today and support Banks o' Dee FC</p>
    <button className="bg-white text-team-blue px-4 py-2 rounded font-medium">Join Now</button>
  </div>
);

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
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <LeagueTable />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <MembershipCTA />
          </div>
        </div>
      </div>
      
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

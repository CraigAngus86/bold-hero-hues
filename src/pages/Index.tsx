
import React from 'react';
import { Navbar } from '@/components/layout';
import { Footer } from '@/components/layout';
import EnhancedHero from '@/components/home/EnhancedHero';
import LeagueTable from '@/components/LeagueTable';
import FixturesSection from '@/components/home/FixturesSection';
import NewsSection from '@/components/home/NewsSection'; 
import MediaGalleryModern from '@/components/home/MediaGalleryModern';
import SponsorsSection from '@/components/home/SponsorsSection';

const SponsorShowcase = () => (
  <div className="bg-gray-100 py-12 text-center">
    <h2 className="text-2xl font-bold mb-6">Our Sponsors</h2>
    <p>Loading sponsors...</p>
  </div>
);

const ClubUpdatesBanner = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-bold mb-2">Club Updates</h2>
    <p>Stay updated with the latest club information</p>
  </div>
);

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
      
      {/* Fixtures Section */}
      <FixturesSection />
      
      {/* News Section */}
      <NewsSection />
      
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2">
          <ClubUpdatesBanner />
        </div>
        
        {/* Right Column */}
        <div className="space-y-8">
          <LeagueTable />
          <MembershipCTA />
        </div>
      </div>
        
      <div className="mt-12 md:mt-20 bg-team-blue py-12">
        <div className="container mx-auto px-4">
          <MediaGalleryModern />
        </div>
      </div>
      
      <SponsorsSection />
      
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default Index;


import React from 'react';
import { Navbar } from '@/components/layout';
import { Footer } from '@/components/layout';
import LeagueTable from '@/components/LeagueTable';
import MediaGalleryModern from '@/components/home/MediaGalleryModern';

// Placeholder components until they are properly created
const Hero = () => (
  <div className="bg-team-blue text-white py-20 text-center">
    <h1 className="text-4xl font-bold">Welcome to Banks o' Dee FC</h1>
    <p className="mt-4 max-w-lg mx-auto">
      The official website of Banks o' Dee Football Club
    </p>
  </div>
);

const NextMatch = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Next Match</h2>
    <p>Loading next match details...</p>
  </div>
);

const LatestResults = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Latest Results</h2>
    <p>Loading latest results...</p>
  </div>
);

const NewsHighlights = ({ initialCount = 3 }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Latest News</h2>
    <p>Loading news articles...</p>
  </div>
);

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
      
      <Hero />
      
      <div className="mt-8 md:mt-20">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <NextMatch />
            <LatestResults />
            <NewsHighlights initialCount={3} />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <ClubUpdatesBanner />
            <LeagueTable />
            <MembershipCTA />
          </div>
        </div>
        
        <div className="mt-12 md:mt-20 bg-team-blue py-12">
          <div className="container mx-auto px-4">
            <MediaGalleryModern />
          </div>
        </div>
        
        <div className="mt-12 md:mt-20">
          <SponsorShowcase />
        </div>
      </div>
      
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default Index;

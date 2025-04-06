
import React from 'react';
import { Navbar } from '@/components/layout';
import { Footer } from '@/components/layout';
import { Hero } from '@/components/home/Hero';
import { NextMatch } from '@/components/home/NextMatch';
import { LatestResults } from '@/components/home/LatestResults';
import { NewsHighlights } from '@/components/news/NewsHighlights';
import { SponsorShowcase } from '@/components/sponsors/SponsorShowcase';
import { ClubUpdatesBanner } from '@/components/home/ClubUpdatesBanner';
import { MembershipCTA } from '@/components/home/MembershipCTA';
import LeagueTable from '@/components/LeagueTable';

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

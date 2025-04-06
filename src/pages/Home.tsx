
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/Hero';
import FixturesSection from '@/components/home/FixturesSection';
import NewsSection from '@/components/home/NewsSection';
import LeagueTable from '@/components/LeagueTable';
import SponsorsCarousel from '@/components/SponsorsCarousel';
import SocialMediaFeed from '@/components/SocialMediaFeed';

const Home = () => {
  return (
    <MainLayout>
      <Hero />
      
      <div className="space-y-12 py-12">
        <FixturesSection />
        <NewsSection />
        <LeagueTable />
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-team-blue mb-6">Latest Updates</h2>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600">
                  Welcome to the official website of Banks o' Dee Football Club. 
                  Stay up to date with the latest news, fixtures, and results from Spain Park.
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-team-blue mb-6">Social Media</h2>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <SocialMediaFeed />
              </div>
            </div>
          </div>
        </div>
        
        <SponsorsCarousel />
      </div>
    </MainLayout>
  );
};

export default Home;

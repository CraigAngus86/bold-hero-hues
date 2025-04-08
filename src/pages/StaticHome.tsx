
import React from 'react';
import { Helmet } from 'react-helmet-async';

// Components
import EnhancedHero from '@/components/home/EnhancedHero';
import FeaturedContentGrid from '@/components/home/FeaturedContentGrid';
import FanEngagement from '@/components/home/FanEngagement';
import MatchCenter from '@/components/home/MatchCenter';
import ClubCommercial from '@/components/home/ClubCommercial';
import SponsorsSection from '@/components/home/SponsorsSection';
import MediaGallery from '@/components/home/MediaGallery';
import LeagueTable from '@/components/home/LeagueTable';

// Mock data
import { useFixturesDisplay } from '@/components/fixtures/hooks/useFixturesDisplay';

const StaticHome = () => {
  // Sample data for the featured content grid
  const featuredArticle = {
    id: '1',
    title: 'Banks o\' Dee Secure Victory in Highland League Opener',
    content: 'The team kicked off the new Highland League season with an impressive 3-1 victory against Keith FC at Spain Park. Goals from Johnson, Smith, and Williams sealed the win for the home side.',
    image_url: '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
    category: 'Match Report',
    publish_date: '2025-04-05'
  };

  const nextMatch = {
    id: 'next-1',
    home_team: 'Banks o\' Dee',
    away_team: 'Formartine United',
    date: '2025-05-15',
    time: '15:00',
    venue: 'Spain Park',
    competition: 'Highland League'
  };

  // Fix the form array type to match the expected ("W" | "D" | "L")[] type
  const leaguePosition = {
    position: 3,
    played: 12,
    points: 26,
    form: ['W', 'W', 'D', 'L', 'W'] as ("W" | "D" | "L")[]
  };
  
  // Get league data from the hook
  const { leagueData } = useFixturesDisplay();

  return (
    <div className="static-home bg-gray-50">
      <Helmet>
        <title>Banks o' Dee FC - Home</title>
        <meta name="description" content="Official website of Banks o' Dee Football Club - Home of Spain Park, Aberdeen" />
      </Helmet>

      {/* Static Navigation Bar */}
      <header className="bg-primary-gradient shadow-md py-4 fixed w-full top-0 z-50 bg-team-blue">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/banks-o-dee-dark-logo.png" 
                alt="Banks o' Dee FC Logo" 
                className="h-16 mr-3"
              />
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Banks o' Dee FC
              </h1>
            </div>
            
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li><a href="/" className="text-white hover:text-secondary-300 transition-colors text-animated-underline">Home</a></li>
                <li><a href="/news" className="text-white hover:text-secondary-300 transition-colors text-animated-underline">News</a></li>
                <li><a href="/team" className="text-white hover:text-secondary-300 transition-colors text-animated-underline">Team</a></li>
                <li><a href="/fixtures" className="text-white hover:text-secondary-300 transition-colors text-animated-underline">Fixtures</a></li>
                <li><a href="/table" className="text-white hover:text-secondary-300 transition-colors text-animated-underline">League Table</a></li>
                <li><a href="/contact" className="text-white hover:text-secondary-300 transition-colors text-animated-underline">Contact</a></li>
              </ul>
            </nav>
            
            <button className="md:hidden text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Enhanced Hero Section with Slider */}
        <EnhancedHero />
        
        {/* Featured Content Grid - Row 1 */}
        <FeaturedContentGrid 
          featuredArticle={featuredArticle}
          nextMatch={nextMatch}
          leaguePosition={leaguePosition}
          isLoading={false}
        />
        
        {/* Media Gallery - Row 2 */}
        <MediaGallery />
        
        {/* League Table */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-card border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-team-blue mb-6">Latest Club News</h2>
              <div className="space-y-4">
                {/* Include a few NewsCard components here */}
              </div>
            </div>
            
            <div>
              <LeagueTable data={leagueData} />
            </div>
          </div>
        </div>
        
        {/* Fan Engagement Section - Row 3 */}
        <FanEngagement />
        
        {/* Match Center - Row 4 */}
        <MatchCenter />
        
        {/* Club Commercial - Row 5 */}
        <ClubCommercial />
        
        {/* Sponsors Section */}
        <SponsorsSection />
      </main>

      {/* Footer */}
      <footer className="bg-primary-gradient text-white py-12 relative">
        <div className="absolute top-0 left-0 right-0 w-full h-full bg-pattern-diagonal opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="/lovable-uploads/banks-o-dee-dark-logo.png" 
                  alt="Banks o' Dee FC Logo" 
                  className="h-12 mr-3"
                />
                <h3 className="text-xl font-bold">Banks o' Dee FC</h3>
              </div>
              <p className="mb-4">Spain Park, Aberdeen</p>
              <p className="text-sm text-gray-300">© 2025 Banks o' Dee Football Club. All rights reserved.</p>
              
              <div className="flex space-x-4 mt-6">
                <a href="#" className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 border-b border-white/20 pb-2">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-accent-500 transition-colors">Home</a></li>
                <li><a href="/news" className="hover:text-accent-500 transition-colors">News</a></li>
                <li><a href="/team" className="hover:text-accent-500 transition-colors">Team</a></li>
                <li><a href="/fixtures" className="hover:text-accent-500 transition-colors">Fixtures</a></li>
                <li><a href="/table" className="hover:text-accent-500 transition-colors">League Table</a></li>
                <li><a href="/contact" className="hover:text-accent-500 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 border-b border-white/20 pb-2">Contact Information</h3>
              <address className="not-italic">
                <p className="mb-2">Spain Park</p>
                <p className="mb-2">Aberdeen, AB10 6UU</p>
                <p className="mb-2">Email: info@banksofdeefc.co.uk</p>
                <p>Tel: 01224 123456</p>
              </address>
              
              <div className="mt-6">
                <a 
                  href="/contact" 
                  className="inline-block bg-accent-500 hover:bg-accent-600 text-team-blue font-medium px-4 py-2 rounded transition-colors"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-white/70">
            <p>Banks o' Dee Football Club is a registered charity in Scotland (SC123456)</p>
            <div className="mt-4">
              <a href="/privacy-policy" className="hover:text-accent-500 transition-colors mr-4">Privacy Policy</a>
              <a href="/terms" className="hover:text-accent-500 transition-colors mr-4">Terms of Use</a>
              <a href="/cookies" className="hover:text-accent-500 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StaticHome;

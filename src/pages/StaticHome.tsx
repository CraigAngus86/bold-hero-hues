
import React from 'react';
import { Helmet } from 'react-helmet-async';

// Components
import EnhancedHero from '@/components/home/EnhancedHero';
import FeaturedContentGrid from '@/components/home/FeaturedContentGrid';
import MediaGallery from '@/components/home/MediaGallery';

// Define our theme colors for easier reference throughout the component
const theme = {
  primary: '#00105A',
  secondary: '#C5E7FF',
  accent: '#FFD700',
};

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

  const leaguePosition = {
    position: 3,
    played: 12,
    points: 26,
    form: ['W', 'W', 'D', 'L', 'W']
  };

  return (
    <div className="static-home bg-gray-50">
      <Helmet>
        <title>Banks o' Dee FC - Home</title>
        <meta name="description" content="Official website of Banks o' Dee Football Club - Home of Spain Park, Aberdeen" />
      </Helmet>

      {/* Static Navigation Bar */}
      <header className="bg-[#00105a] shadow-md py-4 fixed w-full top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png" 
                alt="Banks o' Dee FC Logo" 
                className="h-16 mr-3"
              />
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Banks o' Dee FC
              </h1>
            </div>
            
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li><a href="/" className="text-white hover:text-[#c5e7ff] transition-colors">Home</a></li>
                <li><a href="/news" className="text-white hover:text-[#c5e7ff] transition-colors">News</a></li>
                <li><a href="/team" className="text-white hover:text-[#c5e7ff] transition-colors">Team</a></li>
                <li><a href="/fixtures" className="text-white hover:text-[#c5e7ff] transition-colors">Fixtures</a></li>
                <li><a href="/table" className="text-white hover:text-[#c5e7ff] transition-colors">League Table</a></li>
                <li><a href="/contact" className="text-white hover:text-[#c5e7ff] transition-colors">Contact</a></li>
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

      <main className="pt-24">
        {/* Enhanced Hero Section with Slider */}
        <EnhancedHero />
        
        {/* Featured Content Grid - Row 1 */}
        <FeaturedContentGrid 
          featuredArticle={featuredArticle}
          nextMatch={nextMatch}
          leaguePosition={leaguePosition}
          isLoading={false}
        />
        
        {/* Latest News Section - Row 2 */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#00105a]">Latest News</h2>
            <a href="/news" className="bg-[#00105a] hover:bg-[#001a8e] text-white font-medium py-2 px-4 rounded transition-colors">
              View All News
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* News Card 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img 
                  src="/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png" 
                  alt="News Article" 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#ffd700] text-[#00105a] text-xs font-semibold px-2 py-1 rounded">
                  Club News
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-[#00105a] line-clamp-2">
                  New Home Kit Unveiled for the 2025/26 Season
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  We are excited to reveal our new home kit for the upcoming season, featuring a classic design with modern elements...
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">April 5, 2025</span>
                  <a href="/news/1" className="text-[#00105a] text-sm font-medium hover:underline">Read More</a>
                </div>
              </div>
            </div>
            
            {/* News Card 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img 
                  src="/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png" 
                  alt="News Article" 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#ffd700] text-[#00105a] text-xs font-semibold px-2 py-1 rounded">
                  Youth
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-[#00105a] line-clamp-2">
                  Youth Academy Expands with New Age Groups
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  Banks o' Dee FC is proud to announce the expansion of our youth academy program to include two new age groups...
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">April 3, 2025</span>
                  <a href="/news/2" className="text-[#00105a] text-sm font-medium hover:underline">Read More</a>
                </div>
              </div>
            </div>
            
            {/* News Card 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img 
                  src="/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png" 
                  alt="News Article" 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#ffd700] text-[#00105a] text-xs font-semibold px-2 py-1 rounded">
                  Interview
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-[#00105a] line-clamp-2">
                  Manager Interview: Season Preview
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  We sat down with our manager to discuss preparations for the upcoming season, new signings, and expectations...
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">March 28, 2025</span>
                  <a href="/news/3" className="text-[#00105a] text-sm font-medium hover:underline">Read More</a>
                </div>
              </div>
            </div>
            
            {/* News Card 4 - Only visible on larger screens */}
            <div className="hidden xl:block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img 
                  src="/lovable-uploads/ba4e2b09-12ed-48ad-a4ba-1162ab87ad70.png" 
                  alt="News Article" 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#ffd700] text-[#00105a] text-xs font-semibold px-2 py-1 rounded">
                  Community
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-[#00105a] line-clamp-2">
                  Community Outreach Program Launches
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  Banks o' Dee FC is proud to announce the launch of our new community outreach program aimed at engaging with local schools...
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">March 22, 2025</span>
                  <a href="/news/4" className="text-[#00105a] text-sm font-medium hover:underline">Read More</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Media Gallery - Horizontal Scrolling */}
        <MediaGallery />
      </main>

      {/* Footer */}
      <footer className="bg-[#00105a] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Banks o' Dee FC</h3>
              <p className="mb-4">Spain Park, Aberdeen</p>
              <p>© 2025 Banks o' Dee Football Club. All rights reserved.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="hover:underline">Home</a></li>
                <li><a href="/news" className="hover:underline">News</a></li>
                <li><a href="/team" className="hover:underline">Team</a></li>
                <li><a href="/fixtures" className="hover:underline">Fixtures</a></li>
                <li><a href="/table" className="hover:underline">League Table</a></li>
                <li><a href="/contact" className="hover:underline">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-[#c5e7ff] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-[#c5e7ff] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-[#c5e7ff] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StaticHome;

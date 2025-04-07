
import React from 'react';
import { Helmet } from 'react-helmet-async';

const StaticHome = () => {
  return (
    <div className="static-home">
      <Helmet>
        <title>Banks o' Dee FC - Home</title>
        <meta name="description" content="Official website of Banks o' Dee Football Club" />
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

      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-[#00105a] to-[#001a8e]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <img 
              src="/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png"
              alt="Banks o' Dee FC Logo"
              className="w-32 md:w-40 mb-6"
            />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Welcome to Banks o' Dee Football Club
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Home of Spain Park, Aberdeen. Proudly competing in the Highland Football League.
            </p>
          </div>
        </div>
      </section>

      {/* Next Match */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#00105a]">Next Match</h2>
          
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <img 
                    src="/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png"
                    alt="Banks o' Dee"
                    className="w-16 h-16 mx-auto mb-2"
                  />
                  <p className="font-semibold">Banks o' Dee</p>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-bold">VS</p>
                  <p className="text-sm text-gray-500">15:00</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-500">FC</span>
                  </div>
                  <p className="font-semibold">Formartine United</p>
                </div>
              </div>
              
              <div className="text-center text-gray-600">
                <p>Saturday, 15 May 2025</p>
                <p>Spain Park, Aberdeen</p>
                <p>Highland Football League</p>
              </div>
              
              <button className="mt-4 w-full bg-[#00105a] hover:bg-[#001a8e] text-white font-bold py-2 px-4 rounded transition-colors">
                Get Tickets
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Preview */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#00105a]">Latest News</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">News Article Title</h3>
                  <p className="text-gray-600 mb-4">
                    Short excerpt from the news article appears here to give readers a preview of the content...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">May 1, 2025</span>
                    <button className="text-[#00105a] font-medium hover:underline">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button className="bg-[#00105a] hover:bg-[#001a8e] text-white font-bold py-2 px-6 rounded transition-colors">
              View All News
            </button>
          </div>
        </div>
      </section>

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

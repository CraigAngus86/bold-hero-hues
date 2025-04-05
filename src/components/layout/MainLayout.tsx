
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import Footer from '@/components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navLinks = [
    { name: 'News', href: '/news' },
    { name: 'Team & Management', href: '/team' },
    { name: 'Fixtures', href: '/fixtures' },
    { name: 'League Table', href: '/table' },
    { name: 'Spain Park', href: '/stadium' },
    { name: 'Tickets', href: '/tickets' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#00105a] shadow-md py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="relative z-10 flex items-center">
              <img 
                src="/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png" 
                alt="Banks o' Dee FC Logo" 
                className="h-16 md:h-20 transition-all duration-300 mr-3"
              />
              <h1 className="font-display font-bold text-xl md:text-2xl tracking-tight text-white">
                Banks o' Dee FC
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="font-medium text-sm text-white hover:text-team-lightBlue transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-team-lightBlue after:transition-all after:duration-300 hover:after:w-full"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 focus:outline-none z-10" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            >
              {sidebarOpen ? (
                <X className="text-white w-6 h-6" />
              ) : (
                <Menu className="text-white w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar - Mobile Navigation */}
      <div className={cn(
        "fixed inset-0 bg-[#00105a] z-[49] transition-transform duration-300 ease-in-out md:hidden",
        sidebarOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col items-center justify-center h-full">
          <img 
            src="/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png" 
            alt="Banks o' Dee FC Logo" 
            className="h-24 mb-8"
          />
          <nav>
            <ul className="flex flex-col space-y-8 items-center">
              {navLinks.map((link) => (
                <li key={link.name} className="w-full text-center">
                  <Link 
                    to={link.href}
                    className="text-white text-xl font-display font-medium px-8 py-2 block hover:bg-white/10 transition-colors rounded-md"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow pt-32">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;

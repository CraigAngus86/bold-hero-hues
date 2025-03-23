
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, Instagram, Facebook } from 'lucide-react';
import { Twitter } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'News', href: '/news' },
    { name: 'Team & Management', href: '/team' },
    { name: 'Fixtures', href: '/fixtures' },
    { name: 'League Table', href: '/table' },
    { name: 'Spain Park', href: '/stadium' },
    { name: 'Tickets', href: '/tickets' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#00105a] shadow-md py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="relative z-10 flex items-center">
            <img 
              src="/lovable-uploads/banks-o-dee-logo.png" 
              alt="Banks o' Dee FC Logo" 
              className="h-16 md:h-20 transition-all duration-300 mr-3"
            />
            <h1 className="font-display font-bold text-xl md:text-2xl tracking-tight text-white">
              Banks o' Dee FC
            </h1>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {/* Social Media Icons */}
            <div className="flex space-x-2 mr-6">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-team-lightBlue transition-colors p-1"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-team-lightBlue transition-colors p-1"
                aria-label="X"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-team-lightBlue transition-colors p-1"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav>
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
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 focus:outline-none z-10" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <X className="text-white w-6 h-6" />
            ) : (
              <Menu className="text-white w-6 h-6" />
            )}
          </button>

          {/* Mobile Navigation */}
          <div className={cn(
            "fixed inset-0 bg-[#00105a] z-[49] transition-transform duration-300 ease-in-out md:hidden",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}>
            <div className="flex flex-col items-center justify-center h-full">
              <img 
                src="/lovable-uploads/banks-o-dee-logo.png" 
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
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              
              {/* Mobile Social Media Icons */}
              <div className="flex space-x-4 mt-8">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                  aria-label="X"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

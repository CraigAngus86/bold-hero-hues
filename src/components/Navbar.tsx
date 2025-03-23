
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Team & Management', href: '/team' },
    { name: 'Fixtures', href: '/fixtures' },
    { name: 'League Table', href: '/table' },
    { name: 'Spain Park', href: '/stadium' },
    { name: 'News', href: '/news' },
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled 
          ? 'bg-white shadow-md py-3' 
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="relative z-10">
            <h1 className={cn(
              "font-display font-bold text-xl md:text-2xl tracking-tight transition-colors duration-300",
              scrolled ? "text-team-blue" : "text-white text-shadow"
            )}>
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
                    className={cn(
                      "font-medium text-sm transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-team-blue after:transition-all after:duration-300 hover:after:w-full",
                      scrolled ? "text-gray-800 hover:text-team-blue" : "text-white hover:text-white/80"
                    )}
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
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <X className={cn(
                "w-6 h-6 transition-colors", 
                scrolled ? "text-gray-800" : "text-white"
              )} />
            ) : (
              <Menu className={cn(
                "w-6 h-6 transition-colors", 
                scrolled ? "text-gray-800" : "text-white"
              )} />
            )}
          </button>

          {/* Mobile Navigation */}
          <div className={cn(
            "fixed inset-0 bg-team-blue z-[49] transition-transform duration-300 ease-in-out md:hidden",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}>
            <div className="flex flex-col items-center justify-center h-full">
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
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

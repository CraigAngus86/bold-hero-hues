
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Mock sponsors data
const mainSponsor = {
  id: 'sponsor-1',
  name: 'AberDenim',
  logo: '/lovable-uploads/8f2cd33f-1e08-494a-9aaa-65792ee9418a.png',
  url: 'https://www.aberdenim.com'
};

const secondarySponsors = [
  {
    id: 'sponsor-2',
    name: 'Aberdeen Drilling',
    logo: '/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png',
    url: 'https://www.aberdeendrilling.com'
  },
  {
    id: 'sponsor-3',
    name: 'Northern Lights Energy',
    logo: '/lovable-uploads/c5b46adc-8c4c-4b59-9a27-4ec841222d92.png',
    url: 'https://www.northernlightsenergy.com'
  },
  {
    id: 'sponsor-4',
    name: 'Aberdeen Shipping',
    logo: '/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png',
    url: 'https://www.aberdeenshipping.com'
  },
  {
    id: 'sponsor-5',
    name: 'Celtic Builders',
    logo: '/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png',
    url: 'https://www.celticbuilders.com'
  },
  {
    id: 'sponsor-6',
    name: 'Scottish Breweries',
    logo: '/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png',
    url: 'https://www.scottishbreweries.com'
  }
];

const SponsorsSection: React.FC = () => {
  const sponsorsRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check if scroll arrows should be visible
  const checkScrollPosition = () => {
    if (sponsorsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sponsorsRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const currentRef = sponsorsRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (sponsorsRef.current) {
      const { current } = sponsorsRef;
      const scrollAmount = 300;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-team-blue mb-12">Our Sponsors</h2>
        
        {/* Main Sponsor */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-center text-gray-600 mb-4">Principal Partner</h3>
          <motion.div 
            className="bg-white shadow-sm rounded-xl p-8 flex items-center justify-center max-w-2xl mx-auto border border-gray-200"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <a 
              href={mainSponsor.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="transition-transform hover:scale-105 focus:outline-none"
              aria-label={mainSponsor.name}
            >
              <img 
                src={mainSponsor.logo} 
                alt={mainSponsor.name} 
                className="max-h-32 max-w-full object-contain mix-blend-multiply" 
              />
            </a>
          </motion.div>
        </div>
        
        {/* Secondary Sponsors */}
        <div>
          <h3 className="text-lg font-semibold text-center text-gray-600 mb-4">Official Partners</h3>
          
          <div className="relative">
            {/* Left Arrow */}
            {showLeftArrow && (
              <Button
                onClick={() => scroll('left')}
                variant="secondary"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white shadow-md hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            
            {/* Right Arrow */}
            {showRightArrow && (
              <Button
                onClick={() => scroll('right')}
                variant="secondary"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white shadow-md hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            
            {/* Sponsors Scrollable Container */}
            <div 
              ref={sponsorsRef}
              className="flex overflow-x-auto gap-6 py-4 px-2 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {secondarySponsors.map((sponsor) => (
                <motion.div 
                  key={sponsor.id} 
                  className="flex-shrink-0 w-[200px]"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-white shadow-sm rounded-lg p-6 h-32 flex items-center justify-center border border-gray-200 relative group">
                    <a 
                      href={sponsor.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="transition-transform hover:scale-105 focus:outline-none"
                      aria-label={sponsor.name}
                    >
                      <img 
                        src={sponsor.logo} 
                        alt={sponsor.name} 
                        className="max-h-20 max-w-full object-contain mix-blend-multiply" 
                      />
                    </a>
                    
                    {/* Hover tooltip */}
                    <div className="absolute bottom-0 left-0 right-0 bg-team-blue text-white text-xs py-1 text-center opacity-0 group-hover:opacity-100 group-hover:bottom-[-20px] transition-all duration-200">
                      {sponsor.name}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Interested in sponsoring Banks o' Dee FC?</p>
            <a href="/sponsorship" className="inline-block text-team-blue hover:underline font-medium">
              View Sponsorship Opportunities →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;

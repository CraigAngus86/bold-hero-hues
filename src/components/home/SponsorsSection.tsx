
import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

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
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-team-blue mb-4">Our Partners</h2>
          <p className="text-gray-600">Proud sponsors and supporters of Banks o' Dee FC</p>
        </motion.div>
        
        {/* Main Sponsor */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-center text-lg font-semibold text-gray-600 mb-4">Principal Partner</h3>
          <div className="bg-white shadow-card rounded-xl p-8 flex items-center justify-center max-w-2xl mx-auto border border-gray-100">
            <motion.a 
              href={mainSponsor.url} 
              target="_blank"
              rel="noopener noreferrer" 
              className="transition-transform hover:scale-105 focus:outline-none"
              aria-label={mainSponsor.name}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              <img 
                src={mainSponsor.logo} 
                alt={mainSponsor.name} 
                className="max-h-32 max-w-full object-contain mix-blend-multiply" 
              />
            </motion.a>
          </div>
        </motion.div>
        
        {/* Secondary Sponsors */}
        <div>
          <h3 className="text-center text-lg font-semibold text-gray-600 mb-6">Official Partners</h3>
          
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
            <motion.div 
              ref={sponsorsRef}
              className="flex overflow-x-auto gap-6 py-4 px-2 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              variants={containerVariants}
              initial="hidden"
              animate={controls}
            >
              {secondarySponsors.map((sponsor) => (
                <motion.div 
                  key={sponsor.id} 
                  className="flex-shrink-0 w-[220px]"
                  variants={itemVariants}
                >
                  <div className="bg-white shadow-card rounded-lg p-6 h-36 flex items-center justify-center border border-gray-100 relative group">
                    <motion.a 
                      href={sponsor.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-all focus:outline-none w-full h-full flex items-center justify-center"
                      aria-label={sponsor.name}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <img 
                        src={sponsor.logo} 
                        alt={sponsor.name} 
                        className="max-h-20 max-w-full object-contain mix-blend-multiply" 
                      />
                    </motion.a>
                    
                    {/* Hover tooltip */}
                    <div className="absolute opacity-0 group-hover:opacity-100 bottom-0 left-0 right-0 bg-team-blue text-white text-xs py-1.5 text-center translate-y-0 group-hover:translate-y-full transition-all duration-200 pointer-events-none">
                      {sponsor.name}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="max-w-xl mx-auto mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-bold text-team-blue mb-2">Become a Club Partner</h4>
              <p className="text-gray-600 mb-4">
                Support your local club and gain exposure for your business with our range of sponsorship opportunities.
              </p>
              <div className="flex justify-center gap-4">
                <a href="/sponsorship" className="inline-block text-team-blue bg-gray-100 hover:bg-gray-200 font-medium px-4 py-2 rounded transition-colors">
                  Sponsorship Packages
                </a>
                <a href="/contact" className="inline-block bg-team-blue text-white hover:bg-opacity-90 font-medium px-4 py-2 rounded transition-colors">
                  Contact Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Diagonal divider */}
      <div className="section-divider-diagonal mt-8"></div>
    </section>
  );
};

export default SponsorsSection;

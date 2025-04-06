
import React, { useRef, useEffect } from 'react';
import { useSponsors } from '@/hooks/useSponsors';

const SponsorsSection: React.FC = () => {
  const { sponsors, sponsorsByTier, isLoading } = useSponsors();
  const secondarySponsorsRef = useRef<HTMLDivElement>(null);
  
  const mainSponsors = sponsorsByTier['platinum'] || [];
  const officialSponsors = sponsorsByTier['gold'] || [];
  const supportSponsors = sponsorsByTier['silver'] || [];
  const communitySponsors = sponsorsByTier['bronze'] || [];
  
  // Animate secondary sponsors (automatic scrolling)
  useEffect(() => {
    if (!secondarySponsorsRef.current || officialSponsors.length <= 3) return;
    
    const scrollContainer = secondarySponsorsRef.current;
    let animationId: number;
    const speed = 0.5;
    
    const scroll = () => {
      if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += speed;
      }
      animationId = requestAnimationFrame(scroll);
    };
    
    animationId = requestAnimationFrame(scroll);
    
    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(scroll);
    };
    
    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [officialSponsors]);

  if (isLoading) {
    return (
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#00105A] mb-6 text-center">Our Sponsors</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-4xl h-40 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!sponsors || sponsors.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-[#00105A] mb-6 text-center">Our Sponsors</h2>
        
        {/* Main Sponsors */}
        {mainSponsors.length > 0 && (
          <div className="mb-8">
            <div className="text-sm text-gray-500 uppercase mb-3 text-center">Main Sponsors</div>
            <div className="flex justify-center space-x-8">
              {mainSponsors.map((sponsor) => (
                <a 
                  key={sponsor.id}
                  href={sponsor.website_url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block max-w-xs"
                >
                  <img 
                    src={sponsor.logo_url} 
                    alt={sponsor.name}
                    className="h-20 object-contain mx-auto transition-transform duration-300 hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Official Partners */}
        {officialSponsors.length > 0 && (
          <div className="mb-8">
            <div className="text-sm text-gray-500 uppercase mb-3 text-center">Official Partners</div>
            <div 
              ref={secondarySponsorsRef}
              className="flex overflow-x-auto hide-scrollbar space-x-6 py-2 px-2"
            >
              {officialSponsors.map((sponsor) => (
                <a 
                  key={sponsor.id}
                  href={sponsor.website_url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white p-4 rounded-lg shadow-md flex-shrink-0 w-48 h-32 flex items-center justify-center group"
                >
                  <img 
                    src={sponsor.logo_url} 
                    alt={sponsor.name}
                    className="max-h-16 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Support Sponsors */}
        {supportSponsors.length > 0 && (
          <div className="mb-6">
            <div className="text-sm text-gray-500 uppercase mb-3 text-center">Support Sponsors</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {supportSponsors.map((sponsor) => (
                <a 
                  key={sponsor.id}
                  href={sponsor.website_url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white p-3 rounded-lg shadow-md flex items-center justify-center h-20 group"
                >
                  <img 
                    src={sponsor.logo_url} 
                    alt={sponsor.name}
                    className="max-h-12 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Community Sponsors */}
        {communitySponsors.length > 0 && (
          <div>
            <div className="text-sm text-gray-500 uppercase mb-3 text-center">Community Supporters</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {communitySponsors.map((sponsor) => (
                <a 
                  key={sponsor.id}
                  href={sponsor.website_url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white p-3 rounded-lg shadow-md flex items-center justify-center h-16 group"
                >
                  <img 
                    src={sponsor.logo_url} 
                    alt={sponsor.name}
                    className="max-h-10 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SponsorsSection;

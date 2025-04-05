import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sponsor } from '@/types/sponsors';
import { useSponsorStore } from '@/services/sponsorsService';

const SponsorsCarousel = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const getActiveSponsors = useSponsorStore((state) => state.getActiveSponsors);
  
  const placeholder = '/placeholder.svg';
  
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const activeSponsors = await getActiveSponsors();
        setSponsors(activeSponsors);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSponsors();
  }, [getActiveSponsors]);
  
  if (loading) {
    return <div className="text-center py-10">Loading sponsors...</div>;
  }
  
  if (sponsors.length === 0) {
    return <div className="text-center py-10">No active sponsors found.</div>;
  }
  
  return (
    <section className="py-6 bg-team-gray">
      <div className="container mx-auto px-3">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold text-team-blue mb-1">Our Sponsors</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            We are proud to partner with these amazing sponsors.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sponsors.map((sponsor) => (
            <motion.a
              key={sponsor.id}
              href={sponsor.website_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group block"
            >
              {/* Card content */}
              <div className="relative h-40 flex items-center justify-center p-6 overflow-hidden">
                <img 
                  src={sponsor.logo_url || placeholder}
                  alt={`${sponsor.name} logo`}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = placeholder;
                  }}
                />
              </div>
              
              {/* Footer */}
              <div className="p-3 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 text-center line-clamp-1">{sponsor.name}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsCarousel;

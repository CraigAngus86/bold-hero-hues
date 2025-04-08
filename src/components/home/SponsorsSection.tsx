
import React from 'react';
import { motion } from 'framer-motion';

const SponsorsSection: React.FC = () => {
  // Mock sponsor data
  const sponsors = [
    {
      id: '1',
      name: 'Sponsor 1',
      logo: '/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png',
      tier: 'platinum'
    },
    {
      id: '2',
      name: 'Sponsor 2',
      logo: '/lovable-uploads/b937e144-e94f-4e75-881f-1e560c6b520a.png',
      tier: 'platinum'
    },
    {
      id: '3',
      name: 'Sponsor 3',
      logo: '/lovable-uploads/0617ed5b-43b8-449c-870e-5bba374f7cb4.png',
      tier: 'gold'
    },
    {
      id: '4',
      name: 'Sponsor 4',
      logo: '/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png',
      tier: 'gold'
    },
    {
      id: '5',
      name: 'Sponsor 5',
      logo: '/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png',
      tier: 'silver'
    }
  ];

  // Filter sponsors by tier
  const platinumSponsors = sponsors.filter(sponsor => sponsor.tier === 'platinum');
  const goldSponsors = sponsors.filter(sponsor => sponsor.tier === 'gold');
  const silverSponsors = sponsors.filter(sponsor => sponsor.tier === 'silver');

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-team-blue mb-4">Our Sponsors</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are proud to be supported by these local and national businesses.
          </p>
        </div>
        
        {/* Platinum Sponsors */}
        {platinumSponsors.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-center mb-6">
              <span className="inline-block px-4 py-1 bg-gray-100 rounded text-team-blue">Platinum Partners</span>
            </h3>
            
            <div className="flex flex-wrap justify-center items-center gap-8">
              {platinumSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.id}
                  className="w-40 h-40 flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name} 
                    className="max-w-full max-h-full object-contain"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* Gold Sponsors */}
        {goldSponsors.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-center mb-6">
              <span className="inline-block px-4 py-1 bg-gray-100 rounded text-team-blue">Gold Partners</span>
            </h3>
            
            <div className="flex flex-wrap justify-center items-center gap-6">
              {goldSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.id}
                  className="w-32 h-32 flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                >
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name} 
                    className="max-w-full max-h-full object-contain"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* Silver Sponsors */}
        {silverSponsors.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-center mb-6">
              <span className="inline-block px-4 py-1 bg-gray-100 rounded text-team-blue">Silver Partners</span>
            </h3>
            
            <div className="flex flex-wrap justify-center items-center gap-4">
              {silverSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.id}
                  className="w-24 h-24 flex items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                >
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name} 
                    className="max-w-full max-h-full object-contain"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Interested in becoming a sponsor? Learn about our partnership opportunities.
          </p>
          <a 
            href="/sponsorship" 
            className="inline-block bg-team-blue text-white font-medium px-6 py-3 rounded hover:bg-opacity-90 transition-colors btn-hover-effect"
          >
            Become A Partner
          </a>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;

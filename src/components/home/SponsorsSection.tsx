
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
}

const SponsorsSection: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Group sponsors by tier
  const sponsorsByTier = sponsors.reduce((acc, sponsor) => {
    if (!acc[sponsor.tier]) {
      acc[sponsor.tier] = [];
    }
    acc[sponsor.tier].push(sponsor);
    return acc;
  }, {} as Record<string, Sponsor[]>);
  
  // Order the tiers
  const tierOrder = ['platinum', 'gold', 'silver', 'bronze'];
  
  useEffect(() => {
    const fetchSponsors = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('sponsors')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setSponsors(data);
        }
      } catch (error) {
        console.error('Error fetching sponsors:', error);
        // Fallback to mock data if there's an error
        setSponsors([
          {
            id: '1',
            name: 'Main Sponsor',
            logo_url: '/lovable-uploads/banks-o-dee-dark-logo.png',
            website_url: 'https://example.com',
            tier: 'platinum'
          },
          {
            id: '2',
            name: 'Gold Sponsor 1',
            logo_url: '/lovable-uploads/banks-o-dee-dark-logo.png',
            website_url: 'https://example.com',
            tier: 'gold'
          },
          {
            id: '3',
            name: 'Gold Sponsor 2',
            logo_url: '/lovable-uploads/banks-o-dee-dark-logo.png',
            website_url: 'https://example.com',
            tier: 'gold'
          },
          {
            id: '4',
            name: 'Silver Sponsor 1',
            logo_url: '/lovable-uploads/banks-o-dee-dark-logo.png',
            website_url: 'https://example.com',
            tier: 'silver'
          },
          {
            id: '5',
            name: 'Silver Sponsor 2',
            logo_url: '/lovable-uploads/banks-o-dee-dark-logo.png',
            website_url: 'https://example.com',
            tier: 'silver'
          },
          {
            id: '6',
            name: 'Silver Sponsor 3',
            logo_url: '/lovable-uploads/banks-o-dee-dark-logo.png',
            website_url: 'https://example.com',
            tier: 'silver'
          },
          {
            id: '7',
            name: 'Bronze Sponsor 1',
            logo_url: '/lovable-uploads/banks-o-dee-dark-logo.png',
            website_url: 'https://example.com',
            tier: 'bronze'
          },
          {
            id: '8',
            name: 'Bronze Sponsor 2',
            logo_url: '/lovable-uploads/banks-o-dee-dark-logo.png',
            website_url: 'https://example.com',
            tier: 'bronze'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSponsors();
  }, []);
  
  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-team-blue text-center mb-12">Our Sponsors</h2>
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-team-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }
  
  if (sponsors.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-team-blue text-center mb-12">Our Sponsors</h2>
        
        {/* Display sponsors by tier */}
        <div className="space-y-10">
          {tierOrder.map(tier => {
            const tierSponsors = sponsorsByTier[tier];
            if (!tierSponsors || tierSponsors.length === 0) return null;
            
            return (
              <div key={tier} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 capitalize text-center">
                  {tier} {tier !== 'platinum' ? 'Sponsors' : 'Sponsor'}
                </h3>
                
                <div className={cn(
                  "grid gap-6 place-items-center",
                  tier === 'platinum' ? "grid-cols-1" :
                  tier === 'gold' ? "grid-cols-2 md:grid-cols-3" :
                  "grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
                )}>
                  {tierSponsors.map((sponsor, index) => (
                    <motion.div
                      key={sponsor.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <SponsorLogo sponsor={sponsor} tier={tier} />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Interested in sponsoring Banks o' Dee FC? <a href="/sponsorship" className="text-team-blue hover:underline">Find out more</a>
          </p>
        </div>
      </div>
    </section>
  );
};

interface SponsorLogoProps {
  sponsor: Sponsor;
  tier: string;
}

const SponsorLogo: React.FC<SponsorLogoProps> = ({ sponsor, tier }) => {
  const LogoWrapper = sponsor.website_url ? 'a' : 'div';
  
  return (
    <LogoWrapper
      href={sponsor.website_url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300",
        tier === 'platinum' ? "w-64 h-40" :
        tier === 'gold' ? "w-48 h-32" :
        tier === 'silver' ? "w-40 h-28" : "w-32 h-24"
      )}
      title={sponsor.name}
    >
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={sponsor.logo_url}
          alt={sponsor.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </LogoWrapper>
  );
};

export default SponsorsSection;

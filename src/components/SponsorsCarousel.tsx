
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sponsor, SponsorDisplaySettings } from '@/types/sponsors';
import { useSponsorsStore } from '@/services/sponsorsService';
import { useQuery } from '@tanstack/react-query';
import { fetchSponsorDisplaySettings } from '@/services/sponsorsService';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';

const SponsorsCarousel = () => {
  const [settings, setSettings] = useState<SponsorDisplaySettings | null>(null);
  const { sponsors, isLoading, loadSponsors } = useSponsorsStore();
  
  // Load display settings
  const { data: displaySettings } = useQuery({
    queryKey: ['sponsorDisplaySettings'],
    queryFn: async () => {
      const response = await fetchSponsorDisplaySettings();
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to load display settings');
      }
      return response.data;
    },
  });
  
  // Set display settings when loaded
  useEffect(() => {
    if (displaySettings) {
      setSettings(displaySettings);
    }
  }, [displaySettings]);
  
  // Load sponsors when component mounts
  useEffect(() => {
    loadSponsors();
  }, [loadSponsors]);
  
  // Filter, limit, and possibly shuffle sponsors for display
  const getDisplaySponsors = () => {
    if (!sponsors || sponsors.length === 0) {
      return [];
    }
    
    // Filter active sponsors
    let displaySponsors = sponsors.filter(s => s.is_active);
    
    // Sort by tier and then by display order
    displaySponsors.sort((a, b) => {
      const tierOrder: Record<string, number> = {
        platinum: 1,
        gold: 2,
        silver: 3,
        bronze: 4
      };
      
      // First sort by tier
      if (tierOrder[a.tier] !== tierOrder[b.tier]) {
        return tierOrder[a.tier] - tierOrder[b.tier];
      }
      
      // Then by display_order
      return (a.display_order || 999) - (b.display_order || 999);
    });
    
    // Randomize if configured
    if (settings?.randomize_order) {
      const tierGroups: Record<string, Sponsor[]> = {};
      
      // Group sponsors by tier
      displaySponsors.forEach(sponsor => {
        if (!tierGroups[sponsor.tier]) {
          tierGroups[sponsor.tier] = [];
        }
        tierGroups[sponsor.tier].push(sponsor);
      });
      
      // Shuffle each tier group
      Object.keys(tierGroups).forEach(tier => {
        tierGroups[tier] = shuffleArray(tierGroups[tier]);
      });
      
      // Reconstruct the array maintaining tier order
      displaySponsors = Object.keys(tierGroups).sort((a, b) => {
        const tierOrder: Record<string, number> = {
          platinum: 1,
          gold: 2,
          silver: 3,
          bronze: 4
        };
        return tierOrder[a] - tierOrder[b];
      }).flatMap(tier => tierGroups[tier]);
    }
    
    // Limit to max logos if on homepage
    if (settings?.max_logos_homepage) {
      displaySponsors = displaySponsors.slice(0, settings.max_logos_homepage);
    }
    
    return displaySponsors;
  };
  
  // Shuffle array helper
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Get sponsors for display
  const displaySponsors = getDisplaySponsors();
  
  // Calculate grid columns based on settings
  const getGridCols = () => {
    if (!settings) return 'grid-cols-2 md:grid-cols-4';
    
    const perRow = settings.sponsors_per_row || 4;
    
    if (perRow <= 2) {
      return 'grid-cols-1 md:grid-cols-2';
    } else if (perRow === 3) {
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    } else if (perRow === 4) {
      return 'grid-cols-2 md:grid-cols-4';
    } else if (perRow <= 6) {
      return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6';
    } else {
      return 'grid-cols-2 sm:grid-cols-4 md:grid-cols-8';
    }
  };
  
  const placeholder = '/placeholder.svg';
  
  // Skip rendering if setting to hide on homepage is true
  if (settings?.show_on_homepage === false) {
    return null;
  }
  
  if (isLoading) {
    return (
      <section className="py-6 bg-team-gray">
        <div className="container mx-auto px-3">
          <div className="text-center mb-6">
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <Skeleton className="h-40 w-full" />
                <div className="p-3 border-t border-gray-100">
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (displaySponsors.length === 0) {
    return null;
  }
  
  const renderSponsorGrid = () => {
    if (settings?.show_tier_headings) {
      // Group sponsors by tier
      const tierGroups: Record<string, Sponsor[]> = {};
      displaySponsors.forEach(sponsor => {
        if (!tierGroups[sponsor.tier]) {
          tierGroups[sponsor.tier] = [];
        }
        tierGroups[sponsor.tier].push(sponsor);
      });
      
      return (
        <div className="space-y-8">
          {Object.keys(tierGroups).map(tier => (
            <div key={tier}>
              <h3 className="text-xl font-semibold text-team-blue mb-4 text-center capitalize">
                {tier} Sponsors
              </h3>
              <div className={`grid ${getGridCols()} gap-4`}>
                {tierGroups[tier].map((sponsor) => renderSponsorCard(sponsor))}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className={`grid ${getGridCols()} gap-4`}>
          {displaySponsors.map((sponsor) => renderSponsorCard(sponsor))}
        </div>
      );
    }
  };
  
  const renderSponsorCard = (sponsor: Sponsor) => (
    <motion.a
      key={sponsor.id}
      href={sponsor.website_url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group block ${!sponsor.website_url ? 'pointer-events-none' : ''}`}
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
        <div className="text-sm font-medium text-gray-700 text-center line-clamp-1 flex items-center justify-center gap-1">
          <span>{sponsor.name}</span>
          {sponsor.website_url && (
            <ExternalLink className="h-3 w-3 text-gray-400 inline-block" />
          )}
        </div>
      </div>
    </motion.a>
  );
  
  return (
    <section className="py-6 bg-team-gray">
      <div className="container mx-auto px-3">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-team-blue mb-1">Our Sponsors</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            We are proud to partner with these amazing sponsors who support our club.
          </p>
        </div>
        
        {settings?.display_mode === 'carousel' ? (
          <div className="overflow-hidden">
            {/* Carousel implementation would go here */}
            {/* For now, fallback to grid */}
            {renderSponsorGrid()}
          </div>
        ) : settings?.display_mode === 'list' ? (
          <div className="divide-y">
            {/* List implementation would go here */}
            {/* For now, fallback to grid */}
            {renderSponsorGrid()}
          </div>
        ) : (
          renderSponsorGrid()
        )}
      </div>
    </section>
  );
};

export default SponsorsCarousel;

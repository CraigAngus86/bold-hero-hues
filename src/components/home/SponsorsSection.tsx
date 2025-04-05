
import { useEffect, useState } from 'react';
import { useSponsorsStore } from '@/services/sponsorsService';
import { Sponsor } from '@/types/sponsors';
import { Skeleton } from '@/components/ui/skeleton';

const SponsorsSection = () => {
  const { isLoading, sponsors, loadSponsors } = useSponsorsStore();
  const [groupedSponsors, setGroupedSponsors] = useState<Record<string, Sponsor[]>>({});

  useEffect(() => {
    loadSponsors();
  }, [loadSponsors]);

  useEffect(() => {
    if (sponsors.length > 0) {
      const grouped = sponsors.reduce((acc, sponsor) => {
        if (!sponsor.is_active) return acc;
        
        const tier = sponsor.tier || 'bronze';
        if (!acc[tier]) {
          acc[tier] = [];
        }
        acc[tier].push(sponsor);
        return acc;
      }, {} as Record<string, Sponsor[]>);
      
      setGroupedSponsors(grouped);
    }
  }, [sponsors]);

  const tierLabels: Record<string, string> = {
    'platinum': 'Main Sponsors',
    'gold': 'Official Partners',
    'silver': 'Official Sponsors',
    'bronze': 'Community Sponsors'
  };

  const renderSponsorTier = (tier: string, sponsors: Sponsor[]) => {
    return (
      <div key={tier} className="mb-8 last:mb-0">
        <h3 className="text-lg font-semibold mb-4 text-team-blue">
          {tierLabels[tier] || 'Sponsors'}
        </h3>
        
        <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
          {sponsors.map(sponsor => (
            <a 
              key={sponsor.id} 
              href={sponsor.website_url || '#'} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 group relative"
            >
              <div className="bg-white rounded-lg p-4 h-24 w-40 md:w-48 flex items-center justify-center border border-gray-200 hover:shadow-md transition-all">
                {sponsor.logo_url ? (
                  <img 
                    src={sponsor.logo_url} 
                    alt={sponsor.name} 
                    className="max-h-16 max-w-full object-contain filter group-hover:brightness-90 transition-all"
                  />
                ) : (
                  <div className="text-center text-gray-500 text-sm">{sponsor.name}</div>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-team-blue text-white text-xs py-1 text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                {sponsor.name}
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderSkeletons = () => {
    return (
      <div className="mb-8">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="flex space-x-6 overflow-hidden">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24 w-40 md:w-48 rounded-lg flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-team-blue mb-8">
          Our Sponsors
        </h2>
        
        {isLoading ? (
          <>
            {renderSkeletons()}
            {renderSkeletons()}
          </>
        ) : (
          <>
            {Object.entries(groupedSponsors)
              .sort(([tierA], [tierB]) => {
                const tierOrder = { 'platinum': 1, 'gold': 2, 'silver': 3, 'bronze': 4 };
                return (tierOrder[tierA as keyof typeof tierOrder] || 999) - 
                       (tierOrder[tierB as keyof typeof tierOrder] || 999);
              })
              .map(([tier, sponsors]) => renderSponsorTier(tier, sponsors))
            }
          </>
        )}
        
        <div className="text-center mt-8">
          <a 
            href="/sponsors" 
            className="inline-flex items-center text-team-blue hover:text-team-navy font-medium"
          >
            Become a Sponsor
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;

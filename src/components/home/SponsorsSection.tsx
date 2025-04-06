
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import useSponsors from '@/hooks/useSponsors';

// Map tier to background color and styles for better visual hierarchy
const tierStyles = {
  platinum: {
    bgColor: 'bg-secondary-300/70',
    headingClass: 'text-2xl font-bold text-gray-800 mb-6',
    cardClass: 'border-secondary-300/50 shadow-xl'
  },
  gold: {
    bgColor: 'bg-amber-100',
    headingClass: 'text-xl font-bold text-gray-700 mb-5',
    cardClass: 'border-amber-200 shadow-lg'
  },
  silver: {
    bgColor: 'bg-gray-200',
    headingClass: 'text-lg font-bold text-gray-700 mb-4',
    cardClass: 'border-gray-200 shadow-md'
  },
  bronze: {
    bgColor: 'bg-amber-50',
    headingClass: 'text-lg font-semibold text-gray-600 mb-4',
    cardClass: 'border-amber-100 shadow-sm'
  }
};

const SponsorsSection: React.FC = () => {
  const { sponsorsByTier, isLoading, error } = useSponsors();

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded max-w-md mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                <div className="w-full h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Our Sponsors</h2>
            <p className="text-red-500">Unable to load sponsors. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  // No sponsors state
  if (Object.keys(sponsorsByTier).length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Our Sponsors</h2>
            <p>Check back soon to see our sponsors.</p>
            <Button className="mt-4" asChild>
              <Link to="/sponsors">Become a Sponsor</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-4">Our Sponsors</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Banks o' Dee FC is proud to be associated with these businesses who support our club.
            Their generous sponsorship helps us achieve our goals on and off the pitch.
          </p>
        </motion.div>

        {/* Platinum Sponsors - Featured prominently */}
        {sponsorsByTier.platinum && sponsorsByTier.platinum.length > 0 && (
          <div className="mb-12">
            <h3 className={tierStyles.platinum.headingClass}>Platinum Sponsors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sponsorsByTier.platinum.map((sponsor) => (
                <motion.div
                  key={sponsor.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className={cn("hover:shadow-2xl transition-all duration-300", tierStyles.platinum.cardClass)}>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="bg-white rounded-full p-4 mb-6 w-32 h-32 flex items-center justify-center border border-gray-100 shadow-sm">
                        {sponsor.logo_url ? (
                          <img
                            src={sponsor.logo_url}
                            alt={`${sponsor.name} logo`}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="text-xl font-bold text-team-blue">{sponsor.name.charAt(0)}</div>
                        )}
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{sponsor.name}</h4>
                      <span className={cn(
                        "text-sm font-medium px-3 py-1 rounded-full mb-4 capitalize",
                        tierStyles.platinum.bgColor
                      )}>
                        Platinum Sponsor
                      </span>
                      {sponsor.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sponsor.description}</p>
                      )}
                      {sponsor.website_url && (
                        <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
                          <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                            Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Gold Sponsors */}
        {sponsorsByTier.gold && sponsorsByTier.gold.length > 0 && (
          <div className="mb-10">
            <h3 className={tierStyles.gold.headingClass}>Gold Sponsors</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {sponsorsByTier.gold.map((sponsor, index) => (
                <motion.div
                  key={sponsor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={cn("hover:shadow-lg transition-all duration-300", tierStyles.gold.cardClass)}>
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="bg-white rounded-full p-3 mb-4 w-24 h-24 flex items-center justify-center">
                        {sponsor.logo_url ? (
                          <img
                            src={sponsor.logo_url}
                            alt={`${sponsor.name} logo`}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="text-lg font-bold text-team-blue">{sponsor.name.charAt(0)}</div>
                        )}
                      </div>
                      <h4 className="text-lg font-bold mb-2">{sponsor.name}</h4>
                      <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full mb-3 capitalize",
                        tierStyles.gold.bgColor
                      )}>
                        Gold Sponsor
                      </span>
                      {sponsor.website_url && (
                        <Button variant="ghost" size="sm" className="mt-1" asChild>
                          <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer">
                            Visit <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Silver & Bronze Sponsors - Shown in a more compact layout */}
        {(sponsorsByTier.silver || sponsorsByTier.bronze) && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Our Supporters</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...(sponsorsByTier.silver || []), ...(sponsorsByTier.bronze || [])].map((sponsor, index) => (
                <motion.div
                  key={sponsor.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-all duration-300 h-full">
                    <CardContent className="p-3 flex flex-col items-center justify-between text-center h-full">
                      <div className="w-full">
                        <div className="bg-white rounded-full p-2 mb-2 w-16 h-16 flex items-center justify-center mx-auto">
                          {sponsor.logo_url ? (
                            <img
                              src={sponsor.logo_url}
                              alt={`${sponsor.name} logo`}
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <div className="text-base font-bold text-team-blue">{sponsor.name.charAt(0)}</div>
                          )}
                        </div>
                        <h4 className="text-sm font-medium mb-1 line-clamp-2">{sponsor.name}</h4>
                      </div>
                      {sponsor.website_url && (
                        <a 
                          href={sponsor.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center mt-2"
                        >
                          Website <ExternalLink className="w-2 h-2 ml-1" />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-10">
          <Button asChild variant="default" size="lg">
            <Link to="/sponsors">
              See All Our Sponsors
            </Link>
          </Button>
          <Button asChild variant="outline" className="ml-4" size="lg">
            <Link to="/sponsors/become-sponsor">
              Become a Sponsor
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;

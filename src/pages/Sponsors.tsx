import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useSponsorsStore } from '@/services/sponsorsService';
import { MainLayout } from '@/components/layout';
import { Typography } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { ExternalLink, MessageSquare, BadgeCheck } from 'lucide-react';
import { Sponsor } from '@/types/sponsors';
import { Link } from 'react-router-dom';

const { H1, H2, H3, Body } = Typography;

// Placeholder text - this would be replaced with CMS content
const sponsorshipInfo = {
  title: 'Support Banks o\' Dee FC',
  description: `
    Becoming a sponsor of Banks o' Dee FC is a fantastic opportunity to support local football while gaining valuable exposure for your business. 
    Our club has a rich history and strong community ties in Aberdeen, offering sponsors excellent visibility and engagement opportunities.
  `,
  benefits: [
    'Brand exposure at Spain Park and on our digital platforms',
    'Access to our growing fanbase and community network',
    'Association with one of Aberdeen\'s most successful junior football clubs',
    'Networking opportunities with other local businesses',
    'Support for grassroots football in the local community'
  ]
};

const SponsorsPage: React.FC = () => {
  const sponsorsStore = useSponsorsStore();
  const { sponsors, loading: isLoading, error } = sponsorsStore;

  useEffect(() => {
    // Call fetchSponsors from the store
    sponsorsStore.fetchSponsors();
  }, [sponsorsStore]);

  // Group by tier for display
  const getSponsorsByTier = () => {
    const tierGroups: Record<string, Sponsor[]> = {};
    
    // Filter active sponsors and group by tier
    if (sponsors) {
      sponsors
        .filter(s => s.is_active)
        .forEach(sponsor => {
          // Handle tier being either a string or an object
          const tierName = typeof sponsor.tier === 'string' ? sponsor.tier : sponsor.tier.name;
          const tier = tierName || 'other';
          
          if (!tierGroups[tier]) {
            tierGroups[tier] = [];
          }
          tierGroups[tier].push(sponsor);
        });
    }
    
    return tierGroups;
  };
  
  const tierGroups = getSponsorsByTier();
  
  // Define tier order and colors for consistent display
  const tierOrder = ['platinum', 'gold', 'silver', 'bronze'];
  const tierColors: Record<string, string> = {
    platinum: 'bg-zinc-100',
    gold: 'bg-yellow-50',
    silver: 'bg-gray-50',
    bronze: 'bg-amber-50',
  };
  
  const tierDescriptions: Record<string, string> = {
    platinum: 'Our premier partnership level with maximum visibility and exclusive benefits.',
    gold: 'Enhanced visibility across all club platforms with premium placement.',
    silver: 'Great visibility with prominent logo placement and digital promotion.',
    bronze: 'Entry-level sponsorship with website presence and match day recognition.',
  };

  const SponsorCard: React.FC<{ sponsor: Sponsor }> = ({ sponsor }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="flex flex-col h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
    >
      <div className="p-6 flex items-center justify-center h-48 bg-white border-b">
        {sponsor.logo_url ? (
          <img 
            src={sponsor.logo_url} 
            alt={`${sponsor.name} logo`} 
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="flex items-center justify-center bg-gray-100 h-full w-full">
            <span className="text-gray-400">No logo available</span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex-1">
        <h3 className="font-bold text-lg mb-1">{sponsor.name}</h3>
        {sponsor.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{sponsor.description}</p>
        )}
      </div>
      
      {sponsor.website_url && (
        <div className="p-4 pt-0 mt-auto">
          <Button asChild variant="outline" className="w-full">
            <a 
              href={sponsor.website_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              Visit Website <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      )}
    </motion.div>
  );

  return (
    <MainLayout>
      <Helmet>
        <title>Our Sponsors | Banks o' Dee FC</title>
        <meta name="description" content="We're proud to be supported by these businesses. Learn about our sponsors and partnership opportunities." />
      </Helmet>
      
      <div className="py-12 bg-team-blue">
        <div className="container mx-auto px-4">
          <H1 className="text-white text-center mb-4">Our Sponsors</H1>
          <Body className="text-white/80 text-center max-w-2xl mx-auto">
            We're proud to be supported by these businesses who help make our success possible both on and off the pitch.
          </Body>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-team-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sponsors...</p>
          </div>
        ) : (
          <div className="space-y-16">
            {tierOrder.map((tier) => {
              const sponsorsInTier = tierGroups[tier] || [];
              if (sponsorsInTier.length === 0) return null;
              
              return (
                <section key={tier} className={`p-6 rounded-lg ${tierColors[tier]}`}>
                  <div className="text-center mb-8">
                    <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium uppercase tracking-wide 
                      ${tier === 'platinum' ? 'bg-zinc-200 text-zinc-800' : 
                        tier === 'gold' ? 'bg-yellow-200 text-yellow-800' : 
                        tier === 'silver' ? 'bg-gray-200 text-gray-800' : 
                        'bg-amber-200 text-amber-800'}`}
                    >
                      {tier} Tier
                    </span>
                    <H2 className="mt-3 mb-2 capitalize">{tier} Sponsors</H2>
                    <p className="max-w-2xl mx-auto text-gray-600">
                      {tierDescriptions[tier]}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sponsorsInTier.map((sponsor) => (
                      <SponsorCard key={sponsor.id} sponsor={sponsor} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Sponsorship Call to Action */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-4">
                <H2>{sponsorshipInfo.title}</H2>
                <Body>{sponsorshipInfo.description}</Body>
                
                <div className="space-y-2 mt-6">
                  <H3 className="text-lg flex items-center">
                    <BadgeCheck className="text-green-600 mr-2 h-5 w-5" />
                    Key Benefits
                  </H3>
                  <ul className="space-y-2">
                    {sponsorshipInfo.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex mt-8 space-x-4">
                <Button asChild size="lg">
                  <Link to="/contact" state={{ subject: 'Sponsorship Inquiry' }}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Us About Sponsorship
                  </Link>
                </Button>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
            >
              <div className="aspect-video relative rounded overflow-hidden mb-4">
                <img 
                  src="/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png" 
                  alt="Spain Park, home of Banks o' Dee FC" 
                  className="object-cover w-full h-full"
                />
              </div>
              <H3 className="mb-1">Become a Club Partner</H3>
              <p className="text-gray-600 mb-4">
                Join our growing family of sponsors and partners while supporting grassroots football. 
                Packages available at all levels to suit your business needs and budget.
              </p>
              <ul className="text-sm space-y-2 text-gray-600">
                <li className="flex items-center">
                  <BadgeCheck className="text-blue-600 mr-2 h-4 w-4" />
                  Matchday advertising and hospitality packages
                </li>
                <li className="flex items-center">
                  <BadgeCheck className="text-blue-600 mr-2 h-4 w-4" />
                  Digital and social media promotion
                </li>
                <li className="flex items-center">
                  <BadgeCheck className="text-blue-600 mr-2 h-4 w-4" />
                  Kit and training wear sponsorship options
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SponsorsPage;

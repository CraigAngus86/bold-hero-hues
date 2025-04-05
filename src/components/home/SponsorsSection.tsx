
import React from 'react';
import { Typography } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const { H2, H3, Body } = Typography;

// Mock data for sponsors
const sponsors = [
  {
    id: 1,
    name: 'Aberdeen FC',
    logo: '/lovable-uploads/0617ed5b-43b8-449c-870e-5bba374f7cb4.png',
    tier: 'platinum',
    website: 'https://example.com/sponsor1'
  },
  {
    id: 2,
    name: 'SPFL',
    logo: '/lovable-uploads/8f2cd33f-1e08-494a-9aaa-65792ee9418a.png',
    tier: 'gold',
    website: 'https://example.com/sponsor2'
  },
  {
    id: 3,
    name: 'Highland League',
    logo: '/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png',
    tier: 'gold',
    website: 'https://example.com/sponsor3'
  },
  {
    id: 4,
    name: 'Other Sponsor',
    logo: '/lovable-uploads/c5b46adc-8c4c-4b59-9a27-4ec841222d92.png',
    tier: 'silver',
    website: 'https://example.com/sponsor4'
  },
];

const SponsorsSection: React.FC = () => {
  return (
    <section>
      <div className="mb-8 text-center">
        <H2 className="mb-2">Club Sponsors</H2>
        <Body className="max-w-2xl mx-auto">
          Banks o' Dee FC is proud to be associated with these businesses who support our club.
          Their generous sponsorship helps us achieve our goals.
        </Body>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {sponsors.map((sponsor) => (
          <Card key={sponsor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-white rounded-full p-2 mb-4 w-24 h-24 flex items-center justify-center">
                <img 
                  src={sponsor.logo} 
                  alt={`${sponsor.name} logo`} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <H3 className="mb-1">{sponsor.name}</H3>
              <p className="text-sm text-gray-500 capitalize mb-4">{sponsor.tier} Sponsor</p>
              
              <Button variant="outline" size="sm" asChild className="w-full">
                <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                  Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Button asChild>
          <Link to="/sponsors">
            See All Our Sponsors
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default SponsorsSection;

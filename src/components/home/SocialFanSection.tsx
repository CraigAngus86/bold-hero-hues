
import React from 'react';
import { Typography } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Twitter, Facebook, Instagram, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const { H2, H3, Body, Small } = Typography;

const SocialFanSection: React.FC = () => {
  // Mock social media posts
  const socialPosts = [
    {
      id: 1,
      platform: 'twitter',
      author: 'BanksoDeeFc',
      content: 'Exciting match this weekend! Come support the team at the stadium. Tickets still available!',
      date: '2 hours ago',
      image: '/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png'
    },
    {
      id: 2,
      platform: 'facebook',
      author: 'Banks o\' Dee FC',
      content: 'Congratulations to our youth team for winning their match yesterday! Great performance from everyone.',
      date: '1 day ago',
      image: '/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png'
    },
    {
      id: 3,
      platform: 'instagram',
      author: 'bankso_dee_fc',
      content: 'New merchandise has arrived at the club shop! Get yours today.',
      date: '3 days ago',
      image: '/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png'
    }
  ];

  // Fan zone events
  const fanEvents = [
    {
      id: 1,
      title: 'Pre-match Gathering',
      date: 'Saturday, April 13th, 2025',
      location: 'Club Bar',
      description: 'Join fellow supporters before the big match for food, drinks and conversation.',
      image: '/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png'
    },
    {
      id: 2,
      title: 'Junior Supporters Club',
      date: 'Sunday, April 14th, 2025',
      location: 'Training Ground',
      description: 'Special meet and greet for our young supporters with the first team players.',
      image: '/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png'
    }
  ];

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-5 h-5 text-[#1DA1F2]" />;
      case 'facebook':
        return <Facebook className="w-5 h-5 text-[#4267B2]" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-[#E1306C]" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Social Media Feed */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <H2>Social Media</H2>
          <div className="flex space-x-3">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          {socialPosts.map(post => (
            <Card key={post.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex border-b p-3 items-center bg-gray-50">
                  {getSocialIcon(post.platform)}
                  <span className="font-medium ml-2 text-gray-800">{post.author}</span>
                  <Small className="ml-auto">{post.date}</Small>
                </div>
                <div className="flex p-4">
                  {post.image && (
                    <div className="w-20 h-20 mr-4 flex-shrink-0">
                      <img 
                        src={post.image} 
                        alt="" 
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div>
                    <Body>{post.content}</Body>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button asChild variant="outline" className="text-primary-700">
            <a href="https://twitter.com/BanksoDeeFc" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
              Follow Us <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>

      {/* Fan Zone */}
      <div>
        <H2 className="mb-6">Fan Zone</H2>

        <div className="space-y-6">
          {fanEvents.map(event => (
            <Card key={event.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
              <div className="md:flex h-full">
                <div className="md:w-1/3 h-48 md:h-auto">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-5 md:w-2/3 flex flex-col">
                  <div>
                    <H3 className="mb-2">{event.title}</H3>
                    <div className="mb-3 text-sm text-gray-500">
                      <div>{event.date}</div>
                      <div>{event.location}</div>
                    </div>
                    <Body className="mb-4">{event.description}</Body>
                  </div>
                  <div className="mt-auto">
                    <Button asChild size="sm" variant="secondary" className="mt-2">
                      <Link to="/events">Learn More</Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button asChild>
            <Link to="/fan-zone">Visit Fan Zone</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SocialFanSection;

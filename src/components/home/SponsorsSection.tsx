
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const SponsorsSection: React.FC = () => {
  // Mock sponsors data
  const sponsors = [
    {
      id: 1,
      name: 'Aberdeen Standard Investments',
      logo: '/lovable-uploads/0617ed5b-43b8-449c-870e-5bba374f7cb4.png',
      tier: 'platinum'
    },
    {
      id: 2,
      name: 'North Star Shipping',
      logo: '/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png',
      tier: 'gold'
    },
    {
      id: 3,
      name: 'TAQA',
      logo: '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
      tier: 'gold'
    },
    {
      id: 4,
      name: 'Wood Group',
      logo: '/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png',
      tier: 'silver'
    },
    {
      id: 5,
      name: 'BP',
      logo: '/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png',
      tier: 'silver'
    },
    {
      id: 6,
      name: 'Total',
      logo: '/lovable-uploads/b937e144-e94f-4e75-881f-1e560c6b520a.png',
      tier: 'bronze'
    },
    {
      id: 7,
      name: 'Xerox',
      logo: '/lovable-uploads/ba4e2b09-12ed-48ad-a4ba-1162ab87ad70.png',
      tier: 'bronze'
    },
    {
      id: 8,
      name: 'Shell',
      logo: '/lovable-uploads/c5b46adc-8c4c-4b59-9a27-4ec841222d92.png',
      tier: 'bronze'
    }
  ];
  
  // Group sponsors by tier
  const platinumSponsors = sponsors.filter(s => s.tier === 'platinum');
  const goldSponsors = sponsors.filter(s => s.tier === 'gold');
  const silverSponsors = sponsors.filter(s => s.tier === 'silver');
  const bronzeSponsors = sponsors.filter(s => s.tier === 'bronze');

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 } 
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 } 
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-px bg-gray-300 w-12"></div>
            <Sparkles className="w-6 h-6 text-team-accent mx-3" />
            <div className="h-px bg-gray-300 w-12"></div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Valued Partners</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Banks o' Dee FC is proud to partner with these organizations that support our club's mission and community initiatives.
          </p>
        </motion.div>

        {/* Platinum tier sponsors - full width */}
        {platinumSponsors.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-10"
          >
            <h3 className="text-lg font-semibold text-center mb-6 text-gray-700">
              <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                PLATINUM PARTNERS
              </span>
            </h3>
            <div className="flex justify-center">
              {platinumSponsors.map(sponsor => (
                <motion.div
                  key={sponsor.id}
                  variants={logoVariants}
                  whileHover="hover"
                  className="px-10 py-8 flex items-center justify-center"
                >
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name} 
                    className="max-h-20 max-w-xs object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    title={sponsor.name}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Gold tier sponsors - carousel */}
        {goldSponsors.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mb-10"
          >
            <h3 className="text-lg font-semibold text-center mb-6 text-gray-700">
              <span className="bg-gradient-to-r from-yellow-500 to-amber-400 bg-clip-text text-transparent">
                GOLD PARTNERS
              </span>
            </h3>
            <div className="relative">
              <Carousel className="w-full max-w-5xl mx-auto">
                <CarouselContent>
                  {goldSponsors.map(sponsor => (
                    <CarouselItem key={sponsor.id} className="md:basis-1/3 lg:basis-1/4">
                      <motion.div
                        variants={logoVariants}
                        whileHover="hover"
                        className="h-28 flex items-center justify-center p-6"
                      >
                        <img 
                          src={sponsor.logo} 
                          alt={sponsor.name} 
                          className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                          title={sponsor.name}
                        />
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="left-0" />
                  <CarouselNext className="right-0" />
                </div>
              </Carousel>
            </div>
          </motion.div>
        )}

        {/* Silver and Bronze tier sponsors - grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {silverSponsors.map(sponsor => (
            <motion.div
              key={sponsor.id}
              variants={logoVariants}
              whileHover="hover" 
              className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center h-24"
            >
              <img 
                src={sponsor.logo} 
                alt={sponsor.name} 
                className="max-h-12 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                title={sponsor.name}
              />
            </motion.div>
          ))}
          
          {bronzeSponsors.map(sponsor => (
            <motion.div
              key={sponsor.id}
              variants={logoVariants}
              whileHover="hover"
              className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center h-24"
            >
              <img 
                src={sponsor.logo} 
                alt={sponsor.name} 
                className="max-h-10 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                title={sponsor.name}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Become a sponsor CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-team-blue to-team-blue/80 text-white border-none shadow-lg rounded-xl overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Become a Club Partner</h3>
              <p className="mb-6 max-w-2xl mx-auto">
                Support Banks o' Dee FC and connect your brand with our passionate community. 
                We offer a range of partnership opportunities to suit businesses of all sizes.
              </p>
              <Button className="bg-team-accent text-team-blue hover:bg-white hover:text-team-blue transition-colors duration-300" asChild>
                <Link to="/sponsor-us">
                  Sponsorship Opportunities <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorsSection;

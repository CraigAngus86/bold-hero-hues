
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

// Mock sponsors data - replace with real sponsors later
const sponsors = [
  { id: 1, name: "Cala Group", logoUrl: "https://placehold.co/300x100/team-lightBlue/white?text=Cala+Group" },
  { id: 2, name: "Aberdeen Drilling School", logoUrl: "https://placehold.co/300x100/team-white/team-blue?text=Aberdeen+Drilling+School" },
  { id: 3, name: "EnerMech", logoUrl: "https://placehold.co/300x100/team-lightBlue/white?text=EnerMech" },
  { id: 4, name: "Scott Electrical", logoUrl: "https://placehold.co/300x100/team-white/team-blue?text=Scott+Electrical" },
  { id: 5, name: "ADS Energy", logoUrl: "https://placehold.co/300x100/team-lightBlue/white?text=ADS+Energy" },
  { id: 6, name: "SureVoIP", logoUrl: "https://placehold.co/300x100/team-white/team-blue?text=SureVoIP" },
];

const SponsorsCarousel = () => {
  return (
    <section className="py-10 bg-team-gray">
      <div className="container mx-auto px-4">
        <h3 className="text-xl font-semibold text-team-blue mb-6 text-center">Our Sponsors</h3>
        
        <Carousel 
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {sponsors.map((sponsor) => (
              <CarouselItem key={sponsor.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/6">
                <motion.div 
                  className="h-24 p-2 rounded-md bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <img 
                    src={sponsor.logoUrl} 
                    alt={`${sponsor.name} logo`} 
                    className="max-h-full max-w-full object-contain"
                  />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default SponsorsCarousel;

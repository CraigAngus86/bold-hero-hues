
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Expanded sponsors data with dummy logos
const sponsors = [
  { id: 1, name: "Cala Group", logoUrl: "https://placehold.co/300x100/team-lightBlue/white?text=Cala+Group" },
  { id: 2, name: "Aberdeen Drilling School", logoUrl: "https://placehold.co/300x100/team-white/team-blue?text=Aberdeen+Drilling+School" },
  { id: 3, name: "EnerMech", logoUrl: "https://placehold.co/300x100/team-lightBlue/white?text=EnerMech" },
  { id: 4, name: "Scott Electrical", logoUrl: "https://placehold.co/300x100/team-white/team-blue?text=Scott+Electrical" },
  { id: 5, name: "ADS Energy", logoUrl: "https://placehold.co/300x100/team-lightBlue/white?text=ADS+Energy" },
  { id: 6, name: "SureVoIP", logoUrl: "https://placehold.co/300x100/team-white/team-blue?text=SureVoIP" },
  { id: 7, name: "TechSolutions", logoUrl: "https://placehold.co/300x100/team-lightBlue/white?text=TechSolutions" },
  { id: 8, name: "North Sea Services", logoUrl: "https://placehold.co/300x100/team-white/team-blue?text=North+Sea+Services" },
  { id: 9, name: "Aberdeen Digital", logoUrl: "https://placehold.co/300x100/team-lightBlue/white?text=Aberdeen+Digital" },
  { id: 10, name: "Highland Engineering", logoUrl: "https://placehold.co/300x100/team-white/team-blue?text=Highland+Engineering" },
];

const SponsorsCarousel = () => {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );
  
  return (
    <section className="py-10 bg-team-gray">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-team-blue mb-6 text-center">Our Sponsors</h2>
        
        <Carousel 
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplayPlugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {sponsors.map((sponsor) => (
              <CarouselItem key={sponsor.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
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

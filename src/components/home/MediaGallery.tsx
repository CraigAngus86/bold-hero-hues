
import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
  title: string;
  date: string;
}

// Sample media items
const mediaItems: MediaItem[] = [
  {
    id: '1',
    type: 'image',
    src: '/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png',
    title: 'Match action vs Keith FC',
    date: '2025-04-05'
  },
  {
    id: '2',
    type: 'image',
    src: '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png',
    title: 'Youth Academy Training',
    date: '2025-03-28'
  },
  {
    id: '3',
    type: 'image',
    src: '/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png',
    title: 'New Kit Launch',
    date: '2025-03-15'
  },
  {
    id: '4',
    type: 'image',
    src: '/lovable-uploads/ba4e2b09-12ed-48ad-a4ba-1162ab87ad70.png',
    title: 'Community Outreach Event',
    date: '2025-03-10'
  },
  {
    id: '5',
    type: 'image',
    src: '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
    title: 'Season Ticket Holders Event',
    date: '2025-02-28'
  },
  {
    id: '6',
    type: 'image',
    src: '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png',
    title: 'Training Session',
    date: '2025-02-15'
  }
];

const MediaGallery: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkForScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkForScrollPosition();
    window.addEventListener('resize', checkForScrollPosition);
    return () => window.removeEventListener('resize', checkForScrollPosition);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      
      // Check scroll position after animation
      setTimeout(checkForScrollPosition, 400);
    }
  };

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-team-blue">Media Gallery</h2>
          <a href="/gallery" className="text-team-blue font-medium flex items-center hover:underline">
            View All <ChevronRight className="w-5 h-5 ml-1" />
          </a>
        </div>
        
        <div className="relative">
          {/* Navigation Buttons */}
          <button 
            onClick={() => scroll('left')}
            className={cn(
              "absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-all",
              !canScrollLeft && "opacity-0 pointer-events-none"
            )}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-team-blue" />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className={cn(
              "absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-all",
              !canScrollRight && "opacity-0 pointer-events-none"
            )}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-team-blue" />
          </button>
          
          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide pb-6 -mx-4 px-4 space-x-4 scroll-smooth"
            onScroll={checkForScrollPosition}
          >
            {mediaItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ 
                  y: -5, 
                  scale: 1.02,
                  transition: { duration: 0.2 } 
                }}
                className="flex-shrink-0 w-72 bg-white rounded-lg overflow-hidden shadow-md"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.src} 
                    alt={item.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 text-gray-900 truncate">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`.scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }`}
      </style>
    </section>
  );
};

export default MediaGallery;

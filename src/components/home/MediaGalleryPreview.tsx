
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Image, Play, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMediaGallery } from '@/hooks/useMediaGallery';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/date';

// Utility for smooth scrolling
const scrollByAmount = (element: HTMLElement, amount: number) => {
  if (!element) return;
  element.scrollTo({
    left: element.scrollLeft + amount,
    behavior: 'smooth'
  });
};

const MediaGalleryPreview: React.FC = () => {
  const { items, isLoading, error } = useMediaGallery(12, true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    scrollByAmount(scrollContainerRef.current, scrollAmount);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <section className="py-10 bg-team-blue">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-64"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Error state
  if (error || items.length === 0) {
    return (
      <section className="py-10 bg-team-blue">
        <div className="container mx-auto px-4 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Media Gallery</h2>
          <p className="mb-6">Check back soon for photos and videos from our matches and events.</p>
          <Link to="/gallery">
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              View Gallery
            </Button>
          </Link>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-10 bg-team-blue">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Media Gallery</h2>
          <Link 
            to="/gallery" 
            className="text-white font-medium flex items-center hover:underline"
          >
            View All
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        
        <div className="relative">
          {/* Navigation buttons */}
          <button 
            onClick={() => handleScroll('left')} 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-team-blue" />
          </button>
          
          {/* Scrollable container with custom scrollbar hidden */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto py-2 pb-4 space-x-4 hide-scrollbar"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative flex-none w-64 rounded-lg overflow-hidden"
              >
                <Link to={`/gallery/${item.id}`} className="group block">
                  <div className="aspect-video relative">
                    <img 
                      src={item.thumbnail_url || item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <div className="text-white">
                        <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-gray-300">{formatDate(item.created_at, 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    
                    {/* Media type indicator */}
                    <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                      {item.media_type === 'video' ? (
                        <Play className="w-4 h-4 text-white" />
                      ) : (
                        <Image className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <button 
            onClick={() => handleScroll('right')} 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-team-blue" />
          </button>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/gallery">
            <Button className="bg-white text-team-blue hover:bg-gray-100">
              Browse Full Gallery
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MediaGalleryPreview;

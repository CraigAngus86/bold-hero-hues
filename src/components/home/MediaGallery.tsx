
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Image, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock media data
const mediaItems = [
  {
    id: '1',
    type: 'image',
    url: '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
    title: 'Match day atmosphere at Spain Park',
    date: '2025-04-02'
  },
  {
    id: '2',
    type: 'image',
    url: '/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png',
    title: 'Team celebrating after victory',
    date: '2025-04-01'
  },
  {
    id: '3',
    type: 'video',
    url: '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png', // Using image as placeholder for video thumbnail
    title: 'Match highlights: Banks o\' Dee vs Keith FC',
    date: '2025-03-30'
  },
  {
    id: '4',
    type: 'image',
    url: '/lovable-uploads/banks-o-dee-dark-logo.png',
    title: 'New kit unveiling ceremony',
    date: '2025-03-28'
  },
  {
    id: '5',
    type: 'image',
    url: '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png',
    title: 'Youth team training session',
    date: '2025-03-25'
  },
  {
    id: '6',
    type: 'video',
    url: '/lovable-uploads/ba4e2b09-12ed-48ad-a4ba-1162ab87ad70.png', // Using image as placeholder for video thumbnail
    title: 'Interview with the manager',
    date: '2025-03-22'
  }
];

const MediaGallery: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-team-blue">Media Gallery</h2>
          <Link to="/gallery">
            <Button variant="outline" className="border-team-blue text-team-blue hover:bg-team-blue hover:text-white">
              View Full Gallery
            </Button>
          </Link>
        </div>
        
        <div className="relative">
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mediaItems.map((item) => (
              <div 
                key={item.id}
                className="flex-none w-64 md:w-72 bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative aspect-video">
                  <img 
                    src={item.url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                        <Play className="h-5 w-5 text-team-blue" fill="currentColor" />
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-3 left-3">
                    {item.type === 'image' ? (
                      <span className="bg-white/80 px-2 py-1 rounded flex items-center text-xs font-medium">
                        <Image className="h-3 w-3 mr-1" />
                        Photo
                      </span>
                    ) : (
                      <span className="bg-white/80 px-2 py-1 rounded flex items-center text-xs font-medium">
                        <Play className="h-3 w-3 mr-1" />
                        Video
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="text-sm font-medium line-clamp-2 mb-1">{item.title}</h3>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default MediaGallery;

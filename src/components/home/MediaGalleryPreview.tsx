
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Image, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface MediaItem {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url: string;
  media_type: 'image' | 'video';
  category: string;
  date_added: string;
  is_featured: boolean;
}

const MediaGalleryPreview: React.FC = () => {
  // Mock data - in a real implementation this would come from an API or database
  const mediaItems: MediaItem[] = [
    {
      id: '1',
      title: 'Match Highlights: Banks o\' Dee vs Formartine',
      description: 'Highlights from our 3-1 victory at Spain Park',
      image_url: '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png',
      thumbnail_url: '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png',
      media_type: 'video',
      category: 'match-highlights',
      date_added: '2025-04-02T10:30:00Z',
      is_featured: true
    },
    {
      id: '2',
      title: 'Team Photo 2024/25 Season',
      description: 'Official team photo for the current season',
      image_url: '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
      thumbnail_url: '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
      media_type: 'image',
      category: 'team-photos',
      date_added: '2025-03-15T09:00:00Z',
      is_featured: true
    },
    {
      id: '3',
      title: 'New Kit Launch',
      description: 'Unveiling our new home kit for the 2024/25 season',
      image_url: '/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png',
      thumbnail_url: '/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png',
      media_type: 'image',
      category: 'club-news',
      date_added: '2025-02-28T14:15:00Z',
      is_featured: true
    },
    {
      id: '4',
      title: 'Spain Park Stadium Improvements',
      description: 'Recent improvements to our home ground',
      image_url: '/lovable-uploads/ba4e2b09-12ed-48ad-a4ba-1162ab87ad70.png',
      thumbnail_url: '/lovable-uploads/ba4e2b09-12ed-48ad-a4ba-1162ab87ad70.png',
      media_type: 'image',
      category: 'club-news',
      date_added: '2025-02-10T11:45:00Z',
      is_featured: true
    },
    {
      id: '5',
      title: 'Interview with Manager Jamie Watt',
      description: 'Pre-match thoughts ahead of crucial cup tie',
      image_url: '/lovable-uploads/banks-o-dee-dark-logo.png',
      thumbnail_url: '/lovable-uploads/banks-o-dee-dark-logo.png',
      media_type: 'video',
      category: 'interviews',
      date_added: '2025-01-20T16:30:00Z',
      is_featured: true
    },
    {
      id: '6',
      title: 'Youth Academy Training Session',
      description: 'Our future stars in action',
      image_url: '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png',
      thumbnail_url: '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png',
      media_type: 'image',
      category: 'youth',
      date_added: '2025-01-05T10:00:00Z',
      is_featured: true
    }
  ];

  const [isScrolling, setIsScrolling] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const checkArrows = () => {
      setShowLeftArrow(gallery.scrollLeft > 0);
      setShowRightArrow(gallery.scrollLeft < gallery.scrollWidth - gallery.clientWidth - 10);
    };

    gallery.addEventListener('scroll', checkArrows);
    checkArrows(); // Initial check

    // Check after images might have loaded
    window.addEventListener('load', checkArrows);
    window.addEventListener('resize', checkArrows);

    return () => {
      gallery.removeEventListener('scroll', checkArrows);
      window.removeEventListener('load', checkArrows);
      window.removeEventListener('resize', checkArrows);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    setIsScrolling(true);

    const scrollAmount = gallery.clientWidth * 0.8;
    const targetScroll = gallery.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);

    gallery.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    // Reset scrolling state after animation
    setTimeout(() => setIsScrolling(false), 500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <section className="bg-team-blue py-12">
      <div className="container mx-auto px-4 relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Media Gallery
          </h2>
          
          <Button 
            asChild
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-team-blue"
          >
            <Link to="/gallery">
              View Full Gallery
            </Link>
          </Button>
        </div>
        
        <div className="relative">
          {/* Left scroll button */}
          {showLeftArrow && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-all"
              onClick={() => scroll('left')}
              disabled={isScrolling}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          
          {/* Right scroll button */}
          {showRightArrow && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-all"
              onClick={() => scroll('right')}
              disabled={isScrolling}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
          
          {/* Gallery */}
          <div 
            ref={galleryRef}
            className="flex space-x-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mediaItems.map((item) => (
              <Card 
                key={item.id}
                className="flex-shrink-0 w-72 md:w-80 bg-white rounded-lg overflow-hidden snap-start cursor-pointer hover:shadow-lg transition-shadow group"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={item.thumbnail_url} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="text-white">
                      <p className="font-medium line-clamp-1">{item.title}</p>
                      {item.description && (
                        <p className="text-sm text-white/80 line-clamp-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Media type indicator */}
                  <div className={cn(
                    "absolute top-2 right-2 rounded-md p-1",
                    item.media_type === 'video' ? "bg-red-500" : "bg-blue-500"
                  )}>
                    {item.media_type === 'video' ? (
                      <Video className="w-4 h-4 text-white" />
                    ) : (
                      <Image className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
                
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-500">{formatDate(item.date_added)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaGalleryPreview;

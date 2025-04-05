
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon, 
  Video, 
  X, 
  Share2,
  Instagram,
  Youtube,
  Twitter,
  Facebook
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

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

const MediaGalleryModern = () => {
  // Mock media items data
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
      is_featured: false
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
      is_featured: false
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
      is_featured: false
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
      is_featured: false
    },
    {
      id: '7',
      title: 'Community Outreach Program',
      description: 'Banks o\' Dee FC giving back to the community',
      image_url: '/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png',
      thumbnail_url: '/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png',
      media_type: 'image',
      category: 'community',
      date_added: '2025-01-03T09:15:00Z',
      is_featured: false
    },
    {
      id: '8',
      title: 'Highland League Trophy Ceremony',
      description: 'Celebrating our league victory',
      image_url: '/lovable-uploads/0617ed5b-43b8-449c-870e-5bba374f7cb4.png',
      thumbnail_url: '/lovable-uploads/0617ed5b-43b8-449c-870e-5bba374f7cb4.png',
      media_type: 'image',
      category: 'club-news',
      date_added: '2024-12-15T18:00:00Z',
      is_featured: false
    }
  ];
  
  // State for filtering and lightbox
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Filter items based on active category
  const filteredItems = activeCategory === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.category === activeCategory);

  // Handle media item click
  const handleItemClick = (item: MediaItem) => {
    setSelectedItem(item);
    setIsLightboxOpen(true);
  };
  
  // Close lightbox
  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };
  
  // Calculate unique categories
  const categories = ['all', ...Array.from(new Set(mediaItems.map(item => item.category)))];
  
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
  }, [activeCategory]); // Re-run when category changes

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
    <section className="bg-team-blue py-12 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Media Gallery
          </h2>
          
          <div className="mt-4 md:mt-0">
            <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="bg-team-navy/50">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category}
                    value={category}
                    className="text-white data-[state=active]:bg-white data-[state=active]:text-team-blue"
                  >
                    {category === 'all' ? 'All' : category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="relative">
          {/* Left scroll button */}
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-all"
              onClick={() => scroll('left')}
              disabled={isScrolling}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          )}
          
          {/* Right scroll button */}
          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-all"
              onClick={() => scroll('right')}
              disabled={isScrolling}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          )}
          
          {/* Gallery */}
          <div 
            ref={galleryRef}
            className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 w-72 md:w-80 snap-start"
                onClick={() => handleItemClick(item)}
              >
                <Card 
                  className="bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group h-full"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={item.thumbnail_url} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
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
                        <ImageIcon className="w-4 h-4 text-white" />
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
              </motion.div>
            ))}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="bg-white/10 rounded-lg p-8 text-center text-white">
              <p>No media items found for this category.</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-8">
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
        
        {/* Lightbox Dialog */}
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogContent className="max-w-5xl w-full p-0 bg-black border-none overflow-hidden max-h-[90vh]">
            <DialogClose className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-1 text-white hover:bg-black">
              <X className="h-5 w-5" />
            </DialogClose>
            
            {selectedItem && (
              <div className="flex flex-col h-full">
                <div className="flex-grow relative">
                  {selectedItem.media_type === 'video' ? (
                    <div className="aspect-video w-full bg-black flex items-center justify-center">
                      <div className="text-white text-center p-4">
                        <p className="mb-2">Video Player Placeholder</p>
                        <p className="text-sm text-gray-400">(Video functionality would be implemented with actual video sources)</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full max-h-[70vh] flex items-center justify-center bg-black">
                      <img
                        src={selectedItem.image_url}
                        alt={selectedItem.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-900 text-white p-4">
                  <h3 className="text-xl font-bold mb-1">{selectedItem.title}</h3>
                  {selectedItem.description && (
                    <p className="text-gray-300 mb-3">{selectedItem.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{formatDate(selectedItem.date_added)}</span>
                    
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-gray-800">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                      
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-blue-400 hover:bg-transparent">
                          <Twitter className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-blue-600 hover:bg-transparent">
                          <Facebook className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-pink-600 hover:bg-transparent">
                          <Instagram className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default MediaGalleryModern;


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
  Facebook,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

interface MediaItem {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  media_type: 'image' | 'video';
  date_added: string;
  is_featured: boolean;
  size: 'small' | 'medium' | 'large';
}

const MediaGalleryModern = () => {
  // Mock media items data
  const mediaItems: MediaItem[] = [
    {
      id: '1',
      title: 'Match Highlights: Banks o\' Dee vs Formartine',
      description: 'Highlights from our 3-1 victory at Spain Park',
      image_url: '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png',
      media_type: 'video',
      date_added: '2025-04-02T10:30:00Z',
      is_featured: true,
      size: 'large'
    },
    {
      id: '2',
      title: 'Team Photo 2024/25 Season',
      description: 'Official team photo for the current season',
      image_url: '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
      media_type: 'image',
      date_added: '2025-03-15T09:00:00Z',
      is_featured: true,
      size: 'medium'
    },
    {
      id: '3',
      title: 'New Kit Launch',
      description: 'Unveiling our new home kit for the 2024/25 season',
      image_url: '/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png',
      media_type: 'image',
      date_added: '2025-02-28T14:15:00Z',
      is_featured: false,
      size: 'small'
    },
    {
      id: '4',
      title: 'Spain Park Stadium Improvements',
      description: 'Recent improvements to our home ground',
      image_url: '/lovable-uploads/ba4e2b09-12ed-48ad-a4ba-1162ab87ad70.png',
      media_type: 'image',
      date_added: '2025-02-10T11:45:00Z',
      is_featured: false,
      size: 'medium'
    },
    {
      id: '5',
      title: 'Interview with Manager Jamie Watt',
      description: 'Pre-match thoughts ahead of crucial cup tie',
      image_url: '/lovable-uploads/banks-o-dee-dark-logo.png',
      media_type: 'video',
      date_added: '2025-01-20T16:30:00Z',
      is_featured: false,
      size: 'small'
    },
    {
      id: '6',
      title: 'Youth Academy Training Session',
      description: 'Our future stars in action',
      image_url: '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png',
      media_type: 'image',
      date_added: '2025-01-05T10:00:00Z',
      is_featured: false,
      size: 'medium'
    },
    {
      id: '7',
      title: 'Community Outreach Program',
      description: 'Banks o\' Dee FC giving back to the community',
      image_url: '/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png',
      media_type: 'image',
      date_added: '2025-01-03T09:15:00Z',
      is_featured: false,
      size: 'small'
    },
    {
      id: '8',
      title: 'Highland League Trophy Ceremony',
      description: 'Celebrating our league victory',
      image_url: '/lovable-uploads/0617ed5b-43b8-449c-870e-5bba374f7cb4.png',
      media_type: 'image',
      date_added: '2024-12-15T18:00:00Z',
      is_featured: false,
      size: 'large'
    }
  ];
  
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  
  // Handle media item click
  const handleItemClick = (item: MediaItem) => {
    setSelectedItem(item);
    setIsLightboxOpen(true);
  };
  
  // Close lightbox
  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <section className="bg-team-blue py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Media Gallery</h2>
          <p className="text-team-lightBlue text-center max-w-2xl mx-auto">
            Explore our latest photos, videos, and media content from matches, training sessions, and community events.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-12 gap-4">
          {mediaItems.map((item) => {
            // Determine column span based on size
            const colSpan = 
              item.size === 'small' ? 'col-span-12 sm:col-span-6 md:col-span-3' :
              item.size === 'medium' ? 'col-span-12 sm:col-span-6 md:col-span-6' :
              'col-span-12 md:col-span-9';
            
            // Determine row span for larger items
            const rowSpan = item.size === 'large' ? 'row-span-2' : '';
            
            // Determine aspect ratio based on size
            const aspectRatio = 
              item.size === 'small' ? 'aspect-square' :
              item.size === 'medium' ? 'aspect-video' :
              'aspect-[16/9]';
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`${colSpan} ${rowSpan}`}
              >
                <div 
                  className={`w-full h-full overflow-hidden rounded-lg cursor-pointer relative group ${aspectRatio}`}
                  onClick={() => handleItemClick(item)}
                >
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100"></div>
                  
                  {/* Media type indicator */}
                  <div className={cn(
                    "absolute top-3 right-3 rounded-full p-2",
                    item.media_type === 'video' ? "bg-red-600" : "bg-blue-600"
                  )}>
                    {item.media_type === 'video' ? (
                      <Video className="w-4 h-4 text-white" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                    <h3 className="text-white font-bold text-lg line-clamp-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-200 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.description}</p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-300">{formatDate(item.date_added)}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-team-lightBlue text-sm">View</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="text-center mt-10">
          <Button 
            asChild
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-team-blue font-medium"
            size="lg"
          >
            <Link to="/gallery" className="inline-flex items-center">
              View Full Gallery <ExternalLink className="w-4 h-4 ml-2" />
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


import React from 'react';
import { Typography } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlayCircle, Image, ArrowRight } from 'lucide-react';

const { H2, Body } = Typography;

const MediaGalleryModern: React.FC = () => {
  // Mock images for the gallery
  const mediaItems = [
    {
      id: 1,
      type: 'image',
      src: '/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png',
      alt: 'Match action shot',
      title: 'Match vs Opponents'
    },
    {
      id: 2,
      type: 'video',
      thumbnail: '/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png',
      alt: 'Goal celebration',
      title: 'Latest Goal Highlights'
    },
    {
      id: 3,
      type: 'image',
      src: '/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png',
      alt: 'Team group photo',
      title: 'Team Photo'
    },
    {
      id: 4,
      type: 'image',
      src: '/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png',
      alt: 'Stadium view',
      title: 'Our Stadium'
    },
    {
      id: 5,
      type: 'image',
      src: '/lovable-uploads/b937e144-e94f-4e75-881f-1e560c6b520a.png',
      alt: 'Trophy celebration',
      title: 'Cup Winners'
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <H2 className="text-white">Media Gallery</H2>
        <Button asChild variant="secondary">
          <Link to="/gallery" className="inline-flex items-center">
            View All <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:grid-rows-2">
        {/* Featured item - larger size */}
        <div className="md:col-span-3 md:row-span-2 relative group overflow-hidden rounded-lg">
          <img
            src={mediaItems[0].src}
            alt={mediaItems[0].alt}
            className="w-full h-full object-cover aspect-video md:aspect-auto"
            style={{ minHeight: '300px' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity group-hover:opacity-90"></div>
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <p className="font-medium text-lg">{mediaItems[0].title}</p>
            <div className="flex items-center text-xs mt-1">
              <Image className="w-4 h-4 mr-1" />
              <span>Gallery Image</span>
            </div>
          </div>
        </div>
        
        {/* Video item */}
        <div className="md:col-span-3 relative group overflow-hidden rounded-lg">
          <img
            src={mediaItems[1].thumbnail}
            alt={mediaItems[1].alt}
            className="w-full h-full object-cover aspect-video"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity group-hover:opacity-90"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-all" />
          </div>
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <p className="font-medium text-lg">{mediaItems[1].title}</p>
            <div className="flex items-center text-xs mt-1">
              <PlayCircle className="w-4 h-4 mr-1" />
              <span>Video</span>
            </div>
          </div>
        </div>
        
        {/* Smaller images row */}
        <div className="md:col-span-1 relative group overflow-hidden rounded-lg">
          <img
            src={mediaItems[2].src}
            alt={mediaItems[2].alt}
            className="w-full h-full object-cover aspect-square"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-90 transition-opacity"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Image className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="md:col-span-1 relative group overflow-hidden rounded-lg">
          <img
            src={mediaItems[3].src}
            alt={mediaItems[3].alt}
            className="w-full h-full object-cover aspect-square"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-90 transition-opacity"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Image className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="md:col-span-1 relative group overflow-hidden rounded-lg">
          <img
            src={mediaItems[4].src}
            alt={mediaItems[4].alt}
            className="w-full h-full object-cover aspect-square"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-90 transition-opacity"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Image className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaGalleryModern;

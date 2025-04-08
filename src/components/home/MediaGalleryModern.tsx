
import React from 'react';
import { Typography } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlayCircle, Image, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const { H2, Body } = Typography;

const MediaGalleryModern: React.FC = () => {
  // Updated with correct image paths
  const mediaItems = [
    {
      id: 1,
      type: 'image',
      src: '/lovable-uploads/74f0cf13-9569-4b38-a479-b24192aeb21f.jpeg',
      alt: 'Ladies U15 team photo',
      title: 'Ladies U15 Team'
    },
    {
      id: 2,
      type: 'video',
      thumbnail: '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png',
      alt: 'Scotland Cup U20 match',
      title: 'Scotland Cup U20 Highlights'
    },
    {
      id: 3,
      type: 'image',
      src: '/lovable-uploads/9ca9c466-2008-4fa8-8258-979a7b5ae9f8.jpeg',
      alt: 'Girls team in action',
      title: 'Girls Team Action'
    },
    {
      id: 4,
      type: 'image',
      src: '/lovable-uploads/a4a5a911-98e0-48ad-95dc-f7cb62d5af63.jpeg',
      alt: 'Junior training session',
      title: 'Junior Training'
    },
    {
      id: 5,
      type: 'image',
      src: '/lovable-uploads/8cc4f482-ddc3-4ec8-9bc0-95e302028272.jpeg',
      alt: 'Youth section players',
      title: 'Youth Development'
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <H2 className="text-white">Media Gallery</H2>
        <Button asChild variant="secondary" className="bg-white text-primary-800 hover:bg-gray-100">
          <Link to="/gallery" className="inline-flex items-center">
            View All <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:grid-rows-2">
        {/* Featured item - larger size */}
        <div className="md:col-span-3 md:row-span-2 relative group overflow-hidden rounded-lg shadow-md">
          <img
            src={mediaItems[0].src}
            alt={mediaItems[0].alt}
            className="w-full h-full object-cover aspect-video md:aspect-auto"
            style={{ minHeight: '300px' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity group-hover:opacity-90"></div>
          <div className="absolute bottom-0 left-0 p-5 text-white">
            <p className="font-semibold text-lg">{mediaItems[0].title}</p>
            <div className="flex items-center text-xs mt-1 text-white/80">
              <Image className="w-4 h-4 mr-1" />
              <span>Gallery Image</span>
            </div>
          </div>
        </div>
        
        {/* Video item */}
        <div className="md:col-span-3 relative group overflow-hidden rounded-lg shadow-md">
          <img
            src={mediaItems[1].thumbnail}
            alt={mediaItems[1].alt}
            className="w-full h-full object-cover aspect-video"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity group-hover:opacity-90"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="w-16 h-16 text-white opacity-90 group-hover:opacity-100 transition-all" />
          </div>
          <div className="absolute bottom-0 left-0 p-5 text-white">
            <p className="font-semibold text-lg">{mediaItems[1].title}</p>
            <div className="flex items-center text-xs mt-1 text-white/80">
              <PlayCircle className="w-4 h-4 mr-1" />
              <span>Video</span>
            </div>
          </div>
        </div>
        
        {/* Smaller images row */}
        {mediaItems.slice(2, 5).map((item, index) => (
          <div key={item.id} className="md:col-span-1 relative group overflow-hidden rounded-lg shadow-md">
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-full object-cover aspect-square"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-90 transition-opacity"></div>
            <div className="absolute inset-0 p-2">
              <div className="h-full flex flex-col justify-end">
                <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">{item.title}</p>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Image className="w-8 h-8 text-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaGalleryModern;

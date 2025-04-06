
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ImageMetadata } from '@/types/images';

interface ImagesGridProps {
  images: ImageMetadata[];
  getImageUrl: (name: string) => string;
  onImageClick: (name: string) => void;
}

const ImagesGrid: React.FC<ImagesGridProps> = ({ images, getImageUrl, onImageClick }) => {
  return (
    <>
      {images.map(image => (
        <Card 
          key={image.id}
          className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
          onClick={() => onImageClick(image.file_name)}
        >
          <CardContent className="p-0 aspect-square relative group">
            <img 
              src={image.url || getImageUrl(image.file_name)} 
              alt={image.alt_text || image.file_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs truncate">
              {image.file_name}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default ImagesGrid;

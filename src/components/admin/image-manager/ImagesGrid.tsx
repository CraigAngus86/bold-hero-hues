
import { Card, CardContent } from '@/components/ui/card';

interface ImagesGridProps {
  images: any[];
  getImageUrl: (name: string) => string;
  onImageClick: (name: string) => void;
}

const ImagesGrid = ({ images, getImageUrl, onImageClick }: ImagesGridProps) => {
  return (
    <>
      {images
        .filter(item => !item.name.endsWith('.folder'))
        .map(image => (
        <Card 
          key={image.id}
          className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
          onClick={() => onImageClick(image.name)}
        >
          <CardContent className="p-0 aspect-square relative group">
            <img 
              src={getImageUrl(image.name)} 
              alt={image.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs truncate">
              {image.name.substring(0, 8)}...
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default ImagesGrid;

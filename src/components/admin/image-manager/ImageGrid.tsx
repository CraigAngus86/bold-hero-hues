
import React from 'react';
import { ImageMetadata, ImageFolder } from '@/types/images';
import { Button } from '@/components/ui/button';
import { Download, Pencil, Trash2, ExternalLink, Share2 } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { toast } from 'sonner';
import { deleteImage } from '@/services/imageService';

interface ImageGridProps {
  images: ImageMetadata[];
  currentFolder: ImageFolder | null;
  onImageDeleted: () => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  currentFolder,
  onImageDeleted,
}) => {
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(
      () => {
        toast.success('Image URL copied to clipboard');
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast.error('Failed to copy URL');
      }
    );
  };

  const handleDelete = async (image: ImageMetadata) => {
    if (window.confirm(`Are you sure you want to delete ${image.file_name}?`)) {
      try {
        await deleteImage(image.id);
        toast.success('Image deleted successfully');
        onImageDeleted();
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('Failed to delete image');
      }
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden">
          <CardContent className="p-0 h-48 relative">
            <img
              src={image.url}
              alt={image.alt_text || image.file_name}
              className="w-full h-full object-cover"
            />
          </CardContent>
          <CardFooter className="flex flex-col p-3 gap-2">
            <div className="w-full truncate text-sm font-medium">
              {image.file_name}
            </div>
            <div className="w-full flex justify-between items-center">
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => copyToClipboard(image.url)}
                  title="Copy URL"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => window.open(image.url, '_blank')}
                  title="Open in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  title="Download"
                  asChild
                >
                  <a href={image.url} download={image.file_name}>
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive hover:text-destructive" 
                onClick={() => handleDelete(image)}
                title="Delete image"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ImageGrid;

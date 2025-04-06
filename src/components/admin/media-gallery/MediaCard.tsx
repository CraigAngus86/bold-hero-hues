
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { FileImage, FileVideo } from 'lucide-react';
import { ImageMetadata } from '@/services/images/media-types';

interface MediaCardProps {
  media: ImageMetadata;
  isSelected: boolean;
  onSelect: () => void;
  onClick: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({
  media,
  isSelected,
  onSelect,
  onClick,
}) => {
  const isVideo = media.type.startsWith('video/');
  const isImage = media.type.startsWith('image/');
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toUpperCase() || '';
  };

  const getRelativeDate = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Unknown date';
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200",
        isSelected ? "ring-2 ring-primary" : "hover:shadow-md"
      )}
    >
      <div className="relative">
        <div 
          className="absolute top-2 left-2 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          <Checkbox checked={isSelected} />
        </div>

        <div 
          className="aspect-square bg-muted cursor-pointer"
          onClick={onClick}
        >
          {isImage ? (
            <img
              src={media.url}
              alt={media.altText || media.name} // Use altText instead of alt_text
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          ) : isVideo ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <FileVideo className="h-12 w-12 text-gray-400" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <FileImage className="h-12 w-12 text-gray-400" />
              <div className="absolute bottom-0 w-full bg-gray-800 bg-opacity-70 text-center text-white py-1">
                {getFileExtension(media.name)}
              </div>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-3">
        <div className="truncate text-sm font-medium">{media.name}</div>
        <div className="flex items-center justify-between mt-1">
          <Badge variant="outline" className="text-xs">
            {isImage ? 'Image' : isVideo ? 'Video' : 'File'}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatFileSize(media.size)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 text-xs text-muted-foreground">
        {getRelativeDate(media.createdAt)}
      </CardFooter>
    </Card>
  );
};

export default MediaCard;

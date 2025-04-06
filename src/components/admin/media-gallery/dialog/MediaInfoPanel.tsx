
import React from 'react';
import { Calendar, Paintbrush, Tag as TagIcon } from 'lucide-react';
import { ImageMetadata } from '@/services/images/types';

interface MediaInfoPanelProps {
  media: ImageMetadata;
  mediaTypeIcon: React.ReactNode;
  formatDate: (dateString: string) => string;
}

const MediaInfoPanel: React.FC<MediaInfoPanelProps> = ({ 
  media, 
  mediaTypeIcon, 
  formatDate 
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div>
        <span className="text-muted-foreground flex items-center gap-1">
          {mediaTypeIcon} Type
        </span>
        <p className="font-medium">{media.type}</p>
      </div>
      
      <div>
        <span className="text-muted-foreground flex items-center gap-1">
          <Calendar className="h-4 w-4" /> Created
        </span>
        <p className="font-medium">{formatDate(media.createdAt)}</p>
      </div>
      
      <div>
        <span className="text-muted-foreground flex items-center gap-1">
          <Paintbrush className="h-4 w-4" /> Dimensions
        </span>
        <p className="font-medium">
          {media.dimensions 
            ? `${media.dimensions.width}×${media.dimensions.height}` 
            : media.width && media.height 
              ? `${media.width}×${media.height}`
              : 'Unknown'}
        </p>
      </div>
      
      <div>
        <span className="text-muted-foreground flex items-center gap-1">
          <TagIcon className="h-4 w-4" /> Size
        </span>
        <p className="font-medium">
          {Math.round(media.size / 1024)} KB
        </p>
      </div>
    </div>
  );
};

export default MediaInfoPanel;

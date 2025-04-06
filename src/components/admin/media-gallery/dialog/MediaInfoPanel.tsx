
import React from 'react';
import { ImageMetadata } from '@/services/images';

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
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Type:</span>
        <div className="flex items-center gap-1.5">
          {mediaTypeIcon}
          <span>{media.type}</span>
        </div>
      </div>

      <div>
        <span className="text-muted-foreground">Size:</span>{' '}
        <span>{formatFileSize(media.size)}</span>
      </div>

      {media.width && media.height && (
        <div>
          <span className="text-muted-foreground">Dimensions:</span>{' '}
          <span>{media.width} x {media.height}px</span>
        </div>
      )}

      <div>
        <span className="text-muted-foreground">Created:</span>{' '}
        <span>{formatDate(media.createdAt)}</span>
      </div>
      
      {media.updatedAt && (
        <div>
          <span className="text-muted-foreground">Last updated:</span>{' '}
          <span>{formatDate(media.updatedAt)}</span>
        </div>
      )}
    </div>
  );
};

export default MediaInfoPanel;

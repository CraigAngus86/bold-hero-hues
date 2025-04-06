
import React from 'react';
import { ImageMetadata } from '@/services/images';
import { FileVideo, FileImage } from 'lucide-react';

interface MediaPreviewProps {
  media: ImageMetadata;
}

const MediaPreviewPanel: React.FC<MediaPreviewProps> = ({ media }) => {
  const isImage = media.type.startsWith('image/');
  const isVideo = media.type.startsWith('video/');
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-muted overflow-hidden rounded-md mb-4 w-full aspect-square">
        {isImage ? (
          <img
            src={media.url}
            alt={media.alt_text || media.name}
            className="w-full h-full object-contain"
          />
        ) : isVideo ? (
          <div className="flex items-center justify-center h-full bg-black/10">
            <FileVideo className="h-12 w-12 text-muted-foreground" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <FileImage className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <div className="text-center w-full">
        <h3 className="font-medium truncate mb-1">{media.name}</h3>
        <p className="text-sm text-muted-foreground">
          {isImage ? 'Image' : isVideo ? 'Video' : 'File'}
        </p>
      </div>
    </div>
  );
};

export default MediaPreviewPanel;

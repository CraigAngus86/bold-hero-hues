
import React from 'react';
import { FileImage, FileVideo, File as FileIcon } from 'lucide-react';
import { ImageMetadata } from '@/services/images/types';

interface MediaPreviewPanelProps {
  media: ImageMetadata;
}

const MediaPreviewPanel: React.FC<MediaPreviewPanelProps> = ({ media }) => {
  return (
    <div className="aspect-square bg-muted rounded-md overflow-hidden flex items-center justify-center">
      {media.type.startsWith('image/') ? (
        <img
          src={media.url}
          alt={media.alt_text || media.name}
          className="w-full h-full object-contain"
        />
      ) : media.type.startsWith('video/') ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <FileVideo className="h-16 w-16 text-gray-400" />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <FileIcon className="h-16 w-16 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default MediaPreviewPanel;

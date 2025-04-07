
import React from 'react';
import { DropZone } from './DropZone';
import { ImagePreview } from './ImagePreview';
import { useImageUploaderContext } from './ImageUploaderContext';

interface ImageUploaderProps {
  aspectRatio?: 'square' | 'video' | 'auto' | '16:9' | '4:3' | '3:2' | '1:1';
  allowMetadata?: boolean;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  aspectRatio = 'auto',
  allowMetadata = true,
  className = '',
}) => {
  const { previewUrl } = useImageUploaderContext();
  
  // Determine aspect ratio class
  let aspectRatioClass = '';
  switch (aspectRatio) {
    case 'square':
    case '1:1':
      aspectRatioClass = 'aspect-square';
      break;
    case 'video':
    case '16:9':
      aspectRatioClass = 'aspect-video';
      break;
    case '4:3':
      aspectRatioClass = 'aspect-4/3';
      break;
    case '3:2':
      aspectRatioClass = 'aspect-3/2';
      break;
    default:
      aspectRatioClass = '';
  }

  return (
    <div className={`image-uploader ${className}`}>
      {previewUrl ? (
        <ImagePreview aspectRatioClass={aspectRatioClass} allowMetadata={allowMetadata} />
      ) : (
        <DropZone inputId="image-upload-input" />
      )}
    </div>
  );
};

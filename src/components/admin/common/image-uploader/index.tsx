
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { imageUploadConfigs } from '@/services/images';
import { DropZone } from './DropZone';
import { ImagePreview } from './ImagePreview';
import { getAspectRatioClass } from './utils';
import { ImageUploaderProps } from './types';
import { ImageUploaderProvider } from './ImageUploaderContext';

export function ImageUploader({
  type = 'general',
  initialImageUrl = null,
  folderPath,
  onUploadComplete,
  className = '',
  title,
  allowMetadata = false,
  alt = '',
  description = '',
  tags = [],
  aspectRatio = 'auto',
  customSize,
}: ImageUploaderProps) {
  const config = imageUploadConfigs[type];
  const maxSizeMB = config.maxSizeMB;
  const acceptedTypes = config.acceptedTypes;
  const aspectRatioClass = getAspectRatioClass(aspectRatio);
  
  const optimizationOptions = {
    ...config.optimizationOptions,
    ...(customSize || {})
  };

  return (
    <ImageUploaderProvider
      initialImageUrl={initialImageUrl}
      acceptedTypes={acceptedTypes}
      maxSizeMB={maxSizeMB}
      onUploadComplete={onUploadComplete}
      bucket={config.bucket}
      folderPath={folderPath}
      optimizationOptions={optimizationOptions}
      initialAlt={alt}
      initialDescription={description}
      initialTags={tags}
    >
      <Card className={`overflow-hidden ${className}`}>
        <CardContent className="p-4">
          {title && <h3 className="font-medium mb-2">{title}</h3>}
          <ImageUploaderContent 
            inputId={`imageInput-${type}`}
            aspectRatioClass={aspectRatioClass}
            allowMetadata={allowMetadata}
          />
        </CardContent>
      </Card>
    </ImageUploaderProvider>
  );
}

interface ImageUploaderContentProps {
  inputId: string;
  aspectRatioClass: string;
  allowMetadata: boolean;
}

const ImageUploaderContent: React.FC<ImageUploaderContentProps> = ({ 
  inputId,
  aspectRatioClass,
  allowMetadata 
}) => {
  const { 
    previewUrl,
    dragActive,
    setDragActive,
    handleFileSelection
  } = useImageUploaderContext();

  return !previewUrl ? (
    <DropZone
      inputId={inputId}
    />
  ) : (
    <ImagePreview
      aspectRatioClass={aspectRatioClass}
      allowMetadata={allowMetadata}
    />
  );
};

export default ImageUploader;

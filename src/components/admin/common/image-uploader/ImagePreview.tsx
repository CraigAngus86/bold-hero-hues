
import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetadataFields } from './MetadataFields';
import { useImageUploaderContext } from './ImageUploaderContext';

interface ImagePreviewProps {
  aspectRatioClass: string;
  allowMetadata: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  aspectRatioClass,
  allowMetadata,
}) => {
  const {
    previewUrl,
    altText,
    clearSelection,
    isUploading,
    progress,
    handleUpload
  } = useImageUploaderContext();

  return (
    <div className="relative">
      <div className={`relative rounded-md overflow-hidden bg-white ${aspectRatioClass}`}>
        <img
          src={previewUrl || ''}
          alt={altText || "Preview"}
          className="w-full h-full object-contain"
        />
      </div>
      <button
        onClick={clearSelection}
        className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
        aria-label="Remove"
      >
        <X className="h-4 w-4 text-white" />
      </button>
      
      {allowMetadata && <MetadataFields />}
      
      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={clearSelection} disabled={isUploading}>
          Cancel
        </Button>
        <Button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading {progress}%
            </>
          ) : (
            'Upload Image'
          )}
        </Button>
      </div>
    </div>
  );
};

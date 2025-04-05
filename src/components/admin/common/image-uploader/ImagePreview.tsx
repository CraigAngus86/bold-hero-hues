
import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetadataFields } from './MetadataFields';
import { ImagePreviewProps } from './types';

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  previewUrl,
  aspectRatioClass,
  altText,
  onClear,
  allowMetadata,
  imageDescription,
  setAltText,
  setImageDescription,
  imageTags,
  setImageTags,
  tagInput,
  setTagInput,
  handleAddTag,
  handleRemoveTag,
  handleTagKeyDown,
  isUploading,
  progress,
  onUpload,
}) => {
  return (
    <div className="relative">
      <div className={`relative rounded-md overflow-hidden bg-white ${aspectRatioClass}`}>
        <img
          src={previewUrl}
          alt={altText || "Preview"}
          className="w-full h-full object-contain"
        />
      </div>
      <button
        onClick={onClear}
        className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
        aria-label="Remove"
      >
        <X className="h-4 w-4 text-white" />
      </button>
      
      {allowMetadata && (
        <MetadataFields
          altText={altText}
          setAltText={setAltText}
          imageDescription={imageDescription}
          setImageDescription={setImageDescription}
          imageTags={imageTags}
          tagInput={tagInput}
          setTagInput={setTagInput}
          handleAddTag={handleAddTag}
          handleRemoveTag={handleRemoveTag}
          handleTagKeyDown={handleTagKeyDown}
          setImageTags={setImageTags}
        />
      )}
      
      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={onClear} disabled={isUploading}>
          Cancel
        </Button>
        <Button onClick={onUpload} disabled={isUploading}>
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

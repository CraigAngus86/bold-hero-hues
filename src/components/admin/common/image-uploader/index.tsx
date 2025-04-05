
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useImageUpload, imageUploadConfigs, ImageOptimizationOptions } from '@/services/images';
import { DropZone } from './DropZone';
import { ImagePreview } from './ImagePreview';
import { getAspectRatioClass } from './utils';
import { ImageUploaderProps } from './types';

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
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState(alt);
  const [imageDescription, setImageDescription] = useState(description);
  const [imageTags, setImageTags] = useState<string[]>(tags);
  const [tagInput, setTagInput] = useState('');
  const { upload, isUploading, progress } = useImageUpload();
  
  const config = imageUploadConfigs[type];
  const maxSizeMB = config.maxSizeMB;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const acceptedTypes = config.acceptedTypes;
  
  const optimizationOptions: ImageOptimizationOptions = {
    ...config.optimizationOptions,
    ...(customSize || {})
  };

  const aspectRatioClass = getAspectRatioClass(aspectRatio);
  
  const handleFileSelection = (file: File) => {
    if (file.size > maxSizeBytes) {
      toast.error(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }
    
    if (!file.type.match(acceptedTypes.replace(/,/g, '|'))) {
      toast.error(`Invalid file type. Please upload a supported image format.`);
      return;
    }
    
    setSelectedFile(file);
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    
    if (!altText) {
      const fileName = file.name.split('.')[0];
      setAltText(fileName.replace(/-|_/g, ' '));
    }
  };
  
  const clearSelection = () => {
    if (previewUrl && previewUrl !== initialImageUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(initialImageUrl);
    setSelectedFile(null);
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !imageTags.includes(tagInput.trim())) {
      setImageTags([...imageTags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setImageTags(imageTags.filter(tag => tag !== tagToRemove));
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      const metadata = {
        alt_text: altText || selectedFile.name.split('.')[0],
        description: imageDescription,
        tags: imageTags
      };
      
      const result = await upload(
        selectedFile, 
        config.bucket, 
        folderPath,
        true, 
        metadata, 
        optimizationOptions
      );
      
      if (result.success && result.data) {
        toast.success('Image uploaded successfully');
        clearSelection();
        if (onUploadComplete) onUploadComplete(result.data.url);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image');
    }
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4">
        {title && <h3 className="font-medium mb-2">{title}</h3>}
        
        {!previewUrl ? (
          <DropZone
            acceptedTypes={acceptedTypes}
            maxSizeMB={maxSizeMB}
            onFileSelected={handleFileSelection}
            dragActive={dragActive}
            setDragActive={setDragActive}
            inputId={`imageInput-${type}`}
          />
        ) : (
          <ImagePreview
            previewUrl={previewUrl}
            aspectRatioClass={aspectRatioClass}
            altText={altText}
            onClear={clearSelection}
            allowMetadata={allowMetadata}
            imageDescription={imageDescription}
            setAltText={setAltText}
            setImageDescription={setImageDescription}
            imageTags={imageTags}
            setImageTags={setImageTags}
            tagInput={tagInput}
            setTagInput={setTagInput}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
            handleTagKeyDown={handleTagKeyDown}
            isUploading={isUploading}
            progress={progress}
            onUpload={handleUpload}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default ImageUploader;

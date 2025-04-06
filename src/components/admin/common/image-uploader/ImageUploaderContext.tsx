
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { useImageUpload } from '@/services/images';
import { BucketType, ImageOptimizationOptions } from '@/services/images/types';
import { useImageUploadState } from './hooks/useImageUploadState';
import { useImageUploadHandlers } from './hooks/useImageUploadHandlers';

interface ImageUploaderContextType {
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  altText: string;
  setAltText: (text: string) => void;
  imageDescription: string;
  setImageDescription: (desc: string) => void;
  imageTags: string[];
  setImageTags: (tags: string[]) => void;
  tagInput: string;
  setTagInput: (input: string) => void;
  dragActive: boolean;
  setDragActive: (active: boolean) => void;
  isUploading: boolean;
  progress: number;
  acceptedTypes: string;
  handleFileSelection: (file: File) => void;
  clearSelection: () => void;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
  handleTagKeyDown: (e: React.KeyboardEvent) => void;
  handleUpload: () => Promise<void>;
}

interface ImageUploaderProviderProps {
  children: ReactNode;
  initialImageUrl: string | null;
  acceptedTypes: string;
  maxSizeMB: number;
  onUploadComplete?: (imageUrl: string) => void;
  bucket: BucketType;
  folderPath?: string;
  optimizationOptions: ImageOptimizationOptions;
  initialAlt?: string;
  initialDescription?: string;
  initialTags?: string[];
}

export const ImageUploaderContext = createContext<ImageUploaderContextType | undefined>(undefined);

export const ImageUploaderProvider: React.FC<ImageUploaderProviderProps> = ({
  children,
  initialImageUrl,
  acceptedTypes,
  maxSizeMB,
  onUploadComplete,
  bucket,
  folderPath,
  optimizationOptions,
  initialAlt = '',
  initialDescription = '',
  initialTags = [],
}) => {
  // Use our custom hooks to organize the state and handlers
  const state = useImageUploadState({
    initialImageUrl,
    initialAlt,
    initialDescription,
    initialTags
  });
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  const handlers = useImageUploadHandlers({
    ...state,
    acceptedTypes,
    maxSizeBytes,
    bucket,
    folderPath,
    optimizationOptions,
    onUploadComplete
  });
  
  const value = {
    ...state,
    ...handlers,
    acceptedTypes
  };
  
  return (
    <ImageUploaderContext.Provider value={value}>
      {children}
    </ImageUploaderContext.Provider>
  );
};

export const useImageUploaderContext = () => {
  const context = useContext(ImageUploaderContext);
  if (context === undefined) {
    throw new Error('useImageUploaderContext must be used within an ImageUploaderProvider');
  }
  return context;
};

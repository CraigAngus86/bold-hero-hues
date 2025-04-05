
import { useState } from 'react';
import { toast } from 'sonner';
import { uploadImage } from './api';
import { optimizeImage } from './utils';
import { BucketType } from './config';
import { ImageMetadata, ImageOptimizationOptions } from './types';

// Hook for image uploading with loading state
export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const upload = async (
    file: File, 
    bucket: BucketType, 
    path?: string, 
    optimize = true,
    metadata?: Partial<ImageMetadata>,
    optimizationOptions?: ImageOptimizationOptions
  ) => {
    setIsUploading(true);
    setProgress(10);
    
    try {
      let fileToUpload = file;
      
      // Optimize image if requested
      if (optimize && file.type.startsWith('image/')) {
        setProgress(20);
        fileToUpload = await optimizeImage(file, optimizationOptions);
        setProgress(40);
      }
      
      const result = await uploadImage(fileToUpload, bucket, path, metadata);
      setProgress(100);
      
      return result;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  return { upload, isUploading, progress };
}

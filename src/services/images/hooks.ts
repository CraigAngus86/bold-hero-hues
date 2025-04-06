
import { useState } from 'react';
import { uploadImage } from './api';
import { optimizeImage } from './optimizationUtils';
import { ImageOptimizationOptions, BucketType, UploadResult } from './types';
import { toast } from 'sonner';

/**
 * Custom hook for image upload functionality
 */
export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  /**
   * Upload an image to storage
   * @param file Image file to upload
   * @param bucket Destination bucket
   * @param folder Optional folder path within bucket
   * @param optimize Whether to optimize the image
   * @param metadata Optional metadata for the image
   * @param optimizationOptions Optional optimization settings
   * @returns Upload result with URL
   */
  const upload = async (
    file: File,
    bucket: BucketType = 'images',
    folder: string = '',
    optimize: boolean = true,
    metadata: Record<string, any> = {},
    optimizationOptions?: ImageOptimizationOptions
  ): Promise<UploadResult> => {
    setIsUploading(true);
    setProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Optimize if requested
      let fileToUpload = file;
      if (optimize && file.type.startsWith('image/')) {
        try {
          fileToUpload = await optimizeImage(file, optimizationOptions);
        } catch (error) {
          console.warn('Image optimization failed, using original file:', error);
        }
      }
      
      // Upload the image
      const result = await uploadImage(fileToUpload, bucket, folder, metadata);
      
      // Cleanup and complete
      clearInterval(progressInterval);
      setProgress(100);
      
      if (!result.success) {
        throw result.error;
      }
      
      return { 
        success: true, 
        url: result.url,
        path: result.path,
        id: result.id
      };
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image');
      return { success: false, error };
    } finally {
      // Reset after a short delay to allow animations
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 500);
    }
  };

  return {
    upload,
    isUploading,
    progress
  };
};

export default useImageUpload;


import { useState, useCallback } from 'react';
import { uploadImage, getImages, deleteImage, updateImageMetadata } from './api';
import { BucketType, ImageOptimizationOptions, StoredImageMetadata, UploadResult } from './types';
import { imageStorageConfig } from './config';

/**
 * Hook for uploading images
 */
export const useImageUpload = (bucket: BucketType = 'images') => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const upload = useCallback(
    async (file: File, options?: ImageOptimizationOptions): Promise<UploadResult> => {
      if (!imageStorageConfig.allowedTypes.includes(file.type)) {
        setUploadError('Unsupported file type');
        return { 
          success: false, 
          error: 'Unsupported file type. Allowed types: ' + imageStorageConfig.allowedTypes.join(', ') 
        };
      }
      
      if (file.size > imageStorageConfig.maxSizeMB * 1024 * 1024) {
        setUploadError(`File size exceeds limit of ${imageStorageConfig.maxSizeMB}MB`);
        return { 
          success: false, 
          error: `File size exceeds limit of ${imageStorageConfig.maxSizeMB}MB` 
        };
      }
      
      setIsUploading(true);
      setUploadError(null);
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) clearInterval(progressInterval);
          return Math.min(prev + 10, 90);
        });
      }, 300);
      
      try {
        const result = await uploadImage(file, bucket, options);
        clearInterval(progressInterval);
        
        if (result.success) {
          setUploadProgress(100);
          setTimeout(() => setUploadProgress(0), 1000);
        } else {
          setUploadError(result.error || 'Upload failed');
        }
        
        return result;
      } catch (error) {
        clearInterval(progressInterval);
        const message = error instanceof Error ? error.message : 'Unknown error';
        setUploadError(message);
        return { success: false, error: message };
      } finally {
        setIsUploading(false);
      }
    },
    [bucket]
  );
  
  const resetUpload = useCallback(() => {
    setUploadError(null);
    setUploadProgress(0);
  }, []);
  
  return {
    upload,
    isUploading,
    uploadProgress,
    uploadError,
    resetUpload
  };
};

/**
 * Hook for fetching images
 */
export const useImageGallery = (initialBucket?: BucketType) => {
  const [images, setImages] = useState<StoredImageMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentBucket, setCurrentBucket] = useState<BucketType | undefined>(initialBucket);
  
  const fetchImages = useCallback(
    async (
      bucket?: BucketType,
      limit = 20,
      offset = 0,
      searchTerm?: string,
      tags?: string[]
    ) => {
      setIsLoading(true);
      setError(null);
      
      try {
        const selectedBucket = bucket || currentBucket;
        const { data, count } = await getImages(selectedBucket, limit, offset, searchTerm, tags);
        setImages(data);
        setTotalCount(count);
        if (bucket) setCurrentBucket(bucket);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch images');
      } finally {
        setIsLoading(false);
      }
    },
    [currentBucket]
  );
  
  const removeImage = useCallback(async (id: string): Promise<boolean> => {
    setError(null);
    try {
      const success = await deleteImage(id);
      if (success) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        setTotalCount((prev) => Math.max(0, prev - 1));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
      return false;
    }
  }, []);
  
  const updateImage = useCallback(async (
    id: string,
    updates: Partial<StoredImageMetadata>
  ): Promise<StoredImageMetadata | null> => {
    setError(null);
    try {
      const updatedImage = await updateImageMetadata(id, updates);
      if (updatedImage) {
        setImages((prev) => 
          prev.map((img) => (img.id === id ? updatedImage : img))
        );
      }
      return updatedImage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update image');
      return null;
    }
  }, []);
  
  return {
    images,
    isLoading,
    error,
    totalCount,
    currentBucket,
    fetchImages,
    removeImage,
    updateImage,
    setCurrentBucket
  };
};

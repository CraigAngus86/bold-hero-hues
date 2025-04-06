
import { useState, useCallback } from 'react';
import { uploadImage } from './api';
import { UseImageUploadOptions, UseImageUploadResult, StoredImageMetadata, ImageUploadResult } from './types';

export function useImageUpload({
  bucket = 'images',
  folderPath,
  onSuccess,
  onError
}: UseImageUploadOptions = {}): UseImageUploadResult {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  
  // Config for the uploader
  const config = {
    bucketName: bucket
  };
  
  const validateFile = (file: File): boolean => {
    // Size validation (default 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError(new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`));
      return false;
    }
    
    return true;
  };
  
  const upload = useCallback(async (file: File, metadata?: Partial<StoredImageMetadata>): Promise<ImageUploadResult> => {
    if (!validateFile(file)) {
      return { success: false, error: error?.message || 'Invalid file' };
    }
    
    setUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      // Upload file
      const result = await uploadImage(file, bucket, folderPath, metadata);
      
      // Clear progress interval
      clearInterval(progressInterval);
      
      if (result.success) {
        setProgress(100);
        if (onSuccess && result.url) {
          onSuccess(result.url);
        }
      } else {
        throw new Error(result.error || 'Upload failed');
      }
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown upload error'));
      if (onError) {
        onError(err instanceof Error ? err : new Error('Unknown upload error'));
      }
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown upload error' 
      };
    } finally {
      // Small delay to show 100% completion
      setTimeout(() => {
        setUploading(false);
      }, 300);
    }
  }, [bucket, folderPath, onSuccess, onError, error]);
  
  const cancelUpload = useCallback(() => {
    // Not implemented yet
    setUploading(false);
    setProgress(0);
  }, []);
  
  const resetState = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);
  
  return {
    uploading,
    isUploading: uploading, // Alias for consistency
    progress,
    uploadProgress: progress, // Alias for consistency
    error,
    upload,
    uploadFile: upload, // Alias for consistency
    cancelUpload,
    resetState
  };
}

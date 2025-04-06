
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { uploadImage } from './api';
import { UseImageUploadOptions, UseImageUploadResult, BucketType, ImageUploadResult } from './types';

export function useImageUpload({
  bucket = BucketType.PUBLIC,
  folderPath,
  onSuccess,
  onError
}: UseImageUploadOptions = {}): UseImageUploadResult {
  const [isUploading, setIsUploading] = useState(false);
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
  
  const uploadFile = useCallback(async (file: File, metadata?: any): Promise<ImageUploadResult> => {
    if (!validateFile(file)) {
      return { success: false, error: error?.message || 'Invalid file' };
    }
    
    setIsUploading(true);
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
        setIsUploading(false);
      }, 300);
    }
  }, [bucket, folderPath, onSuccess, onError, error]);
  
  // Alias for backward compatibility
  const upload = uploadFile;
  
  const uploadFiles = useCallback(async (files: File[], options?: any): Promise<ImageUploadResult[]> => {
    return Promise.all(files.map(file => uploadFile(file, options)));
  }, [uploadFile]);
  
  const cancelUpload = useCallback(() => {
    // Not implemented yet
    setIsUploading(false);
    setProgress(0);
  }, []);
  
  const resetState = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
  }, []);
  
  return {
    isUploading,
    uploading: isUploading, // Alias for backward compatibility
    progress,
    uploadProgress: progress, // Alias for backward compatibility
    error,
    uploadFile,
    uploadFiles,
    upload, // Alias for backward compatibility
    cancelUpload,
    resetState
  };
}

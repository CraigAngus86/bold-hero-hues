
import { useState, useCallback } from 'react';
import { uploadImage } from './api';
import { BucketType, UseImageUploadOptions, UseImageUploadResult } from './types';

/**
 * Hook for handling image uploads
 */
export function useImageUpload(options: UseImageUploadOptions = {}): UseImageUploadResult {
  const {
    bucket = BucketType.IMAGES,
    folderPath,
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    autoUpload = false,
    onSuccess,
    onError
  } = options;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  // Create preview when a file is selected
  const selectFile = useCallback((file: File) => {
    // Check file size
    if (file.size > maxSize) {
      const error = new Error(`File size exceeds the ${maxSize / (1024 * 1024)}MB limit`);
      setError(error);
      if (onError) onError(error);
      return;
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      const error = new Error(`File type ${file.type} is not allowed`);
      setError(error);
      if (onError) onError(error);
      return;
    }

    setSelectedFile(file);
    setError(null);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Auto upload if enabled
    if (autoUpload) {
      uploadFile(file);
    }
  }, [maxSize, allowedTypes, autoUpload, onError]);

  // Upload the selected file
  const uploadFile = useCallback(async (file: File, options = {}) => {
    if (!file) {
      return { success: false, error: 'No file selected' };
    }
    
    setIsUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      // Track upload progress - in a real implementation this would use proper progress tracking
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);
      
      const result = await uploadImage(file, {
        bucket,
        folderPath,
        ...options
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      if (onSuccess && result.url) {
        onSuccess(result.url);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown upload error');
      setError(error);
      if (onError) onError(error);
      
      return {
        success: false,
        error: error.message
      };
    } finally {
      setIsUploading(false);
    }
  }, [bucket, folderPath, onSuccess, onError]);

  // Simplified upload function that returns just the URL
  const upload = useCallback(async (file: File): Promise<string> => {
    const result = await uploadFile(file);
    if (!result.success || !result.url) {
      throw new Error(result.error || 'Failed to upload image');
    }
    return result.url;
  }, [uploadFile]);

  // Reset state
  const resetUpload = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setProgress(0);
  }, []);

  return {
    selectedFile,
    setSelectedFile,
    preview,
    previewUrl: preview, // Alias for backward compatibility
    isUploading,
    uploading: isUploading, // Alias for backward compatibility
    error,
    progress,
    uploadProgress: progress, // Alias for backward compatibility
    selectFile,
    uploadFile,
    upload,
    resetUpload,
    resetState: resetUpload // Alias for backward compatibility
  };
}

export default useImageUpload;

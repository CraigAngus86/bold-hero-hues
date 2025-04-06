
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { uploadImage } from './api';
import { 
  UseImageUploadOptions, 
  UseImageUploadResult, 
  BucketType, 
  ImageUploadResult 
} from './types';

export function useImageUpload(options: UseImageUploadOptions = {}): UseImageUploadResult {
  const {
    bucket = 'images',
    folderPath,
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/*'],
    onSuccess,
    onError,
  } = options;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  
  const validateFile = (file: File): boolean => {
    // Size validation
    if (maxSize && file.size > maxSize) {
      const errorMsg = `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
      setError(new Error(errorMsg));
      toast.error(errorMsg);
      return false;
    }
    
    // Type validation if specific types are provided
    if (allowedTypes && allowedTypes.length > 0 && allowedTypes[0] !== '*') {
      const fileType = file.type;
      const isValidType = allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          // Handle wildcard types like 'image/*'
          const mainType = type.split('/')[0];
          return fileType.startsWith(`${mainType}/`);
        }
        return type === fileType;
      });
      
      if (!isValidType) {
        const errorMsg = `File type not allowed. Supported types: ${allowedTypes.join(', ')}`;
        setError(new Error(errorMsg));
        toast.error(errorMsg);
        return false;
      }
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
  }, [bucket, folderPath, onSuccess, onError, error, validateFile]);
  
  // Simple upload interface for compatibility
  const upload = async (file: File): Promise<string> => {
    const result = await uploadFile(file);
    if (result.success && result.data?.url) {
      return result.data.url;
    }
    throw new Error(result.error || 'Upload failed');
  };
  
  const uploadFiles = useCallback(async (files: File[], options?: any): Promise<ImageUploadResult[]> => {
    return Promise.all(files.map(file => uploadFile(file, options)));
  }, [uploadFile]);
  
  const selectFile = useCallback((file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, [validateFile]);
  
  const cancelUpload = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
  }, []);
  
  const resetState = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsUploading(false);
    setProgress(0);
    setError(null);
  }, [previewUrl]);
  
  return {
    selectedFile,
    setSelectedFile,
    previewUrl,
    preview: previewUrl, // Alias for backward compatibility
    isUploading,
    uploading: isUploading, // Alias for backward compatibility
    progress,
    uploadProgress: progress, // Alias for backward compatibility
    error,
    selectFile,
    uploadFile,
    upload, // Simple interface for compatibility
    uploadFiles,
    cancelUpload,
    resetState,
    resetUpload: resetState
  };
}

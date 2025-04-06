
import { useState } from 'react';
import { BucketType, ImageOptimizationOptions, UploadResult, StoredImageMetadata } from './types';

/**
 * Hook for handling image uploads
 */
export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  /**
   * Upload an image file
   */
  const upload = async (file: File, options?: ImageOptimizationOptions): Promise<UploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError('');

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 15);
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      // Prepare form data
      const formData = new FormData();
      formData.append('file', file);
      
      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value.toString());
          }
        });
      }
      
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear the progress interval
      clearInterval(interval);
      setUploadProgress(100);

      // Create a mock result with a public URL
      const mockResult: UploadResult = {
        success: true,
        data: {
          publicUrl: URL.createObjectURL(file),
          metadata: {
            id: `mock-${Date.now()}`,
            file_name: file.name,
            storage_path: `uploads/${options?.folder || 'default'}/${file.name}`,
            bucket_id: 'images',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: null,
            description: null,
            alt_text: null,
            tags: null,
            dimensions: null,
            // Added properties to fix type errors
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type,
            size: file.size,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      };

      return mockResult;
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setUploadError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError('');
  };

  return {
    upload,
    isUploading,
    uploadProgress,
    uploadError,
    resetUpload,
    // For backward compatibility
    progress: uploadProgress
  };
}

export const imageUploadConfigs: Record<BucketType, ImageUploadConfig> = {
  news: {
    maxSizeMB: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    dimensions: {
      minWidth: 800,
      minHeight: 450,
      maxWidth: 2000,
      maxHeight: 1500
    }
  },
  team: {
    maxSizeMB: 3,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    dimensions: {
      minWidth: 300,
      minHeight: 300,
      maxWidth: 1000,
      maxHeight: 1000
    }
  },
  sponsors: {
    maxSizeMB: 2,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    dimensions: {
      maxWidth: 800,
      maxHeight: 800
    }
  },
  fixtures: {
    maxSizeMB: 3,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  general: {
    maxSizeMB: 10,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  }
};

export * from './types';

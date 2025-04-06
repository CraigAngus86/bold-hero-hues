
import { useState } from 'react';
import { ImageOptimizationOptions, UploadResult } from './types';

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
    resetUpload
  };
}

export const imageUploadConfigs = {
  playerPhoto: {
    maxSizeMB: 5,
    acceptedTypes: ['image/jpeg', 'image/png'],
    dimensions: {
      width: 500,
      height: 500,
      aspect: 1
    },
    folder: 'player_images'
  },
  sponsorLogo: {
    maxSizeMB: 2,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/svg+xml'],
    dimensions: {
      width: 300,
      height: 200,
      aspect: 1.5
    },
    folder: 'sponsor_logos'
  },
  newsImage: {
    maxSizeMB: 5,
    acceptedTypes: ['image/jpeg', 'image/png'],
    dimensions: {
      width: 1200,
      height: 675,
      aspect: 16/9
    },
    folder: 'news_images'
  },
  teamLogo: {
    maxSizeMB: 2,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/svg+xml'],
    dimensions: {
      width: 200,
      height: 200,
      aspect: 1
    },
    folder: 'team_logos'
  },
  galleryImage: {
    maxSizeMB: 10,
    acceptedTypes: ['image/jpeg', 'image/png'],
    dimensions: {
      width: 1920,
      height: 1080,
      aspect: 16/9
    },
    folder: 'gallery'
  }
};


import { supabase } from '@/lib/supabase';
import { useState, useCallback } from 'react';
import {
  BucketType,
  UseImageUploadOptions,
  UseImageUploadResult,
  StoredImageMetadata,
  ImageDimensions,
  ImageUploadConfig,
  ImageOptimizationOptions,
  ImageUploadResult
} from './types';

// Default bucket configurations
export const imageUploadConfigs = {
  avatars: {
    bucketName: 'avatars',
    allowedTypes: 'image/jpeg,image/png,image/webp',
    maxSizeMB: 2,
    bucket: 'avatars' as BucketType,
    optimizationOptions: {
      maxWidth: 400,
      maxHeight: 400,
      quality: 80,
      format: 'webp' as const
    }
  },
  posts: {
    bucketName: 'posts',
    allowedTypes: 'image/jpeg,image/png,image/webp',
    maxSizeMB: 5,
    bucket: 'posts' as BucketType,
    optimizationOptions: {
      maxWidth: 1200,
      maxHeight: 800,
      quality: 85,
      format: 'webp' as const
    }
  },
  products: {
    bucketName: 'products',
    allowedTypes: 'image/jpeg,image/png,image/webp',
    maxSizeMB: 5,
    bucket: 'products' as BucketType,
    optimizationOptions: {
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 85,
      format: 'webp' as const
    }
  },
  general: {
    bucketName: 'general',
    allowedTypes: 'image/jpeg,image/png,image/webp,image/gif',
    maxSizeMB: 10,
    bucket: 'general' as BucketType,
    optimizationOptions: {
      maxWidth: 1500,
      maxHeight: 1500,
      quality: 80,
      format: 'webp' as const
    }
  },
  media: {
    bucketName: 'media',
    allowedTypes: 'image/jpeg,image/png,image/webp,image/gif,video/mp4',
    maxSizeMB: 20,
    bucket: 'media' as BucketType,
    optimizationOptions: {
      maxWidth: 2000,
      maxHeight: 2000,
      quality: 85,
      format: 'webp' as const
    }
  },
  images: {
    bucketName: 'images',
    allowedTypes: 'image/jpeg,image/png,image/webp,image/gif',
    maxSizeMB: 10,
    bucket: 'images' as BucketType,
    optimizationOptions: {
      maxWidth: 1500,
      maxHeight: 1500,
      quality: 80,
      format: 'webp' as const
    }
  }
};

/**
 * Hook for uploading images to Supabase Storage
 */
export function useImageUpload(options?: Partial<UseImageUploadOptions>): UseImageUploadResult {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  
  const bucket = options?.bucket || 'general';
  const config = imageUploadConfigs[bucket];
  
  const resetState = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
    if (abortController) {
      abortController.abort();
    }
    setAbortController(null);
  }, [abortController]);

  const cancelUpload = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setUploading(false);
      setProgress(0);
    }
  }, [abortController]);

  const uploadFile = useCallback(async (
    file: File, 
    metadata?: Partial<StoredImageMetadata>
  ): Promise<ImageUploadResult> => {
    if (!file) {
      const error = new Error('No file provided');
      setError(error);
      return { success: false, error: error.message };
    }

    // Validate file type
    if (config.allowedTypes && !config.allowedTypes.includes(file.type)) {
      const error = new Error(`File type not allowed. Allowed types: ${config.allowedTypes}`);
      setError(error);
      return { success: false, error: error.message };
    }

    // Validate file size
    const maxSizeBytes = config.maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const error = new Error(`File size exceeds maximum allowed (${config.maxSizeMB}MB)`);
      setError(error);
      return { success: false, error: error.message };
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const controller = new AbortController();
      setAbortController(controller);

      // Generate a unique file name to prevent collisions
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Construct storage path
      const folderPath = options?.folderPath || '';
      const filePath = folderPath ? `${folderPath.replace(/^\/|\/$/g, '')}/${fileName}` : fileName;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(config.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(config.bucketName)
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      // Store metadata in database if provided
      if (metadata) {
        // Create full metadata object
        const fullMetadata: Partial<StoredImageMetadata> = {
          ...metadata,
          file_name: file.name,
          storage_path: filePath,
          bucket_id: config.bucketName,
          url: publicUrlData.publicUrl,
          name: file.name,
          type: file.type,
          size: file.size
        };

        // Store in database
        const { error: metadataError } = await supabase
          .from('image_metadata')
          .insert([fullMetadata]);

        if (metadataError) {
          console.error('Error saving image metadata:', metadataError);
        }
      }

      setProgress(100);
      setUploading(false);

      // Call success callback if provided
      if (options?.onSuccess) {
        options.onSuccess(publicUrlData.publicUrl);
      }

      return {
        success: true,
        url: publicUrlData.publicUrl,
        metadata: metadata as StoredImageMetadata,
        data: {
          url: publicUrlData.publicUrl
        }
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error during upload');
      setError(error);
      setUploading(false);
      
      // Call error callback if provided
      if (options?.onError) {
        options.onError(error);
      }
      
      return { success: false, error: error.message };
    }
  }, [config, options]);

  return {
    uploading,
    isUploading: uploading,
    progress,
    uploadProgress: progress,
    error,
    upload: uploadFile,
    uploadFile,
    cancelUpload,
    resetState
  };
}

// Helper function to create a folder in a bucket
export async function createFolder(bucket: BucketType, folderPath: string): Promise<boolean> {
  try {
    // Create an empty file as a placeholder to represent the folder
    const folderMarker = new File([''], '.folder', { type: 'application/octet-stream' });
    const path = `${folderPath.replace(/\/$/, '')}/.folder`;
    
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, folderMarker);
      
    return !error;
  } catch (error) {
    console.error('Error creating folder:', error);
    return false;
  }
}

// Export image metadata types and helper functions
export type { BucketType, ImageOptimizationOptions, StoredImageMetadata, ImageDimensions, ImageUploadResult };
export { createFolder };


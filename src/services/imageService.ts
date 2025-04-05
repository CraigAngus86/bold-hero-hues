
import { supabase } from '@/services/supabase/supabaseClient';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { handleDbOperation, DbServiceResponse } from './utils/dbService';

// Available bucket types
export type BucketType = 'news_images' | 'player_images' | 'sponsor_images' | 'general_images';

// Image metadata interface
export interface ImageMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  bucketType: BucketType;
  url: string;
  alt_text?: string;
  description?: string;
  tags?: string[];
  dimensions?: {
    width: number;
    height: number;
  };
  createdAt: string;
}

// Image optimization options
export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  preserveAspectRatio?: boolean;
}

/**
 * Upload an image to a specific bucket
 */
export async function uploadImage(
  file: File, 
  bucketId: BucketType, 
  path?: string,
  metadata?: Partial<ImageMetadata>
): Promise<DbServiceResponse<ImageMetadata>> {
  return handleDbOperation(
    async () => {
      // Generate a unique filename to prevent overwriting
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;

      // Upload the file to storage
      const { data, error } = await supabase
        .storage
        .from(bucketId)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase
        .storage
        .from(bucketId)
        .getPublicUrl(data.path);
        
      // If we have image dimensions, store them
      let dimensions;
      if (file.type.startsWith('image/')) {
        dimensions = await getImageDimensions(file);
      }
      
      // Store metadata if provided
      if (metadata || dimensions) {
        const metadataToStore = {
          bucket_id: bucketId,
          storage_path: data.path,
          file_name: fileName,
          alt_text: metadata?.alt_text || file.name.split('.')[0],
          description: metadata?.description,
          tags: metadata?.tags,
          dimensions: dimensions ? { width: dimensions.width, height: dimensions.height } : undefined
        };
        
        await supabase
          .from('image_metadata')
          .insert([metadataToStore]);
      }

      return {
        id: data.path,
        name: fileName,
        size: file.size,
        type: file.type,
        bucketType: bucketId,
        url: publicUrl,
        alt_text: metadata?.alt_text,
        description: metadata?.description,
        tags: metadata?.tags,
        dimensions: dimensions,
        createdAt: new Date().toISOString()
      };
    },
    `Failed to upload image to ${bucketId}`
  );
}

/**
 * Get a list of images from a specific bucket
 */
export async function getImages(
  bucketId: BucketType,
  path?: string
): Promise<DbServiceResponse<ImageMetadata[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .storage
        .from(bucketId)
        .list(path || '', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) throw error;

      // Map storage objects to ImageMetadata
      const images = await Promise.all(data
        .filter(item => !item.id.endsWith('/')) // Filter out folders
        .map(async (item) => {
          const filePath = path ? `${path}/${item.name}` : item.name;
          const { data: { publicUrl } } = supabase
            .storage
            .from(bucketId)
            .getPublicUrl(filePath);
            
          // Try to get metadata for this image
          const { data: metadataData } = await supabase
            .from('image_metadata')
            .select('*')
            .eq('bucket_id', bucketId)
            .eq('storage_path', filePath)
            .single();

          return {
            id: item.id,
            name: item.name,
            size: item.metadata?.size || 0,
            type: item.metadata?.mimetype || '',
            bucketType: bucketId,
            url: publicUrl,
            alt_text: metadataData?.alt_text,
            description: metadataData?.description,
            tags: metadataData?.tags,
            dimensions: metadataData?.dimensions,
            createdAt: item.created_at
          };
        }));

      return images;
    },
    `Failed to fetch images from ${bucketId}`
  );
}

/**
 * Delete an image from a specific bucket
 */
export async function deleteImage(
  bucketId: BucketType,
  path: string
): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      // First delete metadata
      await supabase
        .from('image_metadata')
        .delete()
        .eq('bucket_id', bucketId)
        .eq('storage_path', path);
      
      // Then delete the image
      const { error } = await supabase
        .storage
        .from(bucketId)
        .remove([path]);

      if (error) throw error;
      return true;
    },
    `Failed to delete image from ${bucketId}`
  );
}

/**
 * Get public URL for an image
 */
export function getPublicUrl(bucketId: BucketType, path: string): string {
  const { data: { publicUrl } } = supabase
    .storage
    .from(bucketId)
    .getPublicUrl(path);

  return publicUrl;
}

/**
 * Move an image to a different path or bucket
 */
export async function moveImage(
  sourceBucketId: BucketType,
  sourcePath: string,
  destinationBucketId: BucketType,
  destinationPath: string
): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      // First download the file
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from(sourceBucketId)
        .download(sourcePath);

      if (downloadError) throw downloadError;

      if (!fileData) {
        throw new Error(`File not found at ${sourcePath}`);
      }

      // Then upload to new location
      const { error: uploadError } = await supabase
        .storage
        .from(destinationBucketId)
        .upload(destinationPath, fileData, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Update metadata
      await supabase
        .from('image_metadata')
        .update({ 
          bucket_id: destinationBucketId,
          storage_path: destinationPath
        })
        .eq('bucket_id', sourceBucketId)
        .eq('storage_path', sourcePath);

      // Finally delete from old location
      const { error: deleteError } = await supabase
        .storage
        .from(sourceBucketId)
        .remove([sourcePath]);

      if (deleteError) throw deleteError;

      return true;
    },
    `Failed to move image from ${sourceBucketId}/${sourcePath} to ${destinationBucketId}/${destinationPath}`
  );
}

/**
 * Create a folder in a bucket
 */
export async function createFolder(
  bucketId: BucketType,
  folderPath: string
): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      // Create an empty file with .folder extension to represent a folder
      const { error } = await supabase
        .storage
        .from(bucketId)
        .upload(`${folderPath}/.folder`, new Blob(['']));

      if (error && error.message !== 'The resource already exists') {
        throw error;
      }

      return true;
    },
    `Failed to create folder ${folderPath} in ${bucketId}`
  );
}

/**
 * Update image metadata
 */
export async function updateImageMetadata(
  bucketId: BucketType,
  path: string,
  metadata: Partial<{
    alt_text: string;
    description: string;
    tags: string[];
  }>
): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      const { error } = await supabase
        .from('image_metadata')
        .update(metadata)
        .eq('bucket_id', bucketId)
        .eq('storage_path', path);
        
      if (error) throw error;
      return true;
    },
    `Failed to update metadata for image ${path}`
  );
}

/**
 * Get image metadata
 */
export async function getImageMetadata(
  bucketId: BucketType,
  path: string
): Promise<DbServiceResponse<any>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('image_metadata')
        .select('*')
        .eq('bucket_id', bucketId)
        .eq('storage_path', path)
        .single();
        
      if (error) throw error;
      return data;
    },
    `Failed to get metadata for image ${path}`
  );
}

/**
 * Get image dimensions
 */
async function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        resolve(null);
      };
      img.src = URL.createObjectURL(file);
    } catch (err) {
      console.error('Error getting image dimensions:', err);
      resolve(null);
    }
  });
}

/**
 * Optimize an image before uploading (resize, compress)
 */
export async function optimizeImage(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<File> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    format = 'jpeg',
    preserveAspectRatio = true
  } = options;
  
  return new Promise((resolve, reject) => {
    try {
      // Create an image element to load the file
      const img = new Image();
      img.onload = () => {
        // Create a canvas to draw and resize the image
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions if the image is larger than max dimensions
        if (preserveAspectRatio) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        } else {
          width = Math.min(width, maxWidth);
          height = Math.min(height, maxHeight);
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw the resized image on the canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to blob
        const mimeType = format === 'jpeg' ? 'image/jpeg' : 
                         format === 'png' ? 'image/png' : 'image/webp';
                         
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not create blob from canvas'));
              return;
            }
            
            // Create new file from blob
            const optimizedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, `.${format}`),
              { type: mimeType, lastModified: Date.now() }
            );
            
            resolve(optimizedFile);
          },
          mimeType,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = URL.createObjectURL(file);
    } catch (error) {
      console.error('Error optimizing image:', error);
      // Return original file if optimization fails
      resolve(file);
    }
  });
}

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

// Predefined upload configurations for different image types
export const imageUploadConfigs = {
  news: {
    bucket: 'news_images' as BucketType,
    maxSizeMB: 10,
    acceptedTypes: 'image/png,image/jpeg,image/webp',
    optimizationOptions: {
      maxWidth: 1200,
      maxHeight: 800,
      quality: 0.85,
      format: 'webp' as const
    }
  },
  player: {
    bucket: 'player_images' as BucketType,
    maxSizeMB: 5,
    acceptedTypes: 'image/png,image/jpeg,image/webp',
    optimizationOptions: {
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.85,
      format: 'webp' as const
    }
  },
  sponsor: {
    bucket: 'sponsor_images' as BucketType,
    maxSizeMB: 5,
    acceptedTypes: 'image/png,image/jpeg,image/svg+xml',
    optimizationOptions: {
      maxWidth: 600,
      maxHeight: 400,
      quality: 0.9,
      format: 'webp' as const
    }
  },
  general: {
    bucket: 'general_images' as BucketType,
    maxSizeMB: 10,
    acceptedTypes: 'image/png,image/jpeg,image/webp,image/svg+xml',
    optimizationOptions: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'webp' as const
    }
  }
};

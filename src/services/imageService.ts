
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
  createdAt: string;
}

/**
 * Upload an image to a specific bucket
 */
export async function uploadImage(
  file: File, 
  bucketId: BucketType, 
  path?: string
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

      return {
        id: data.path,
        name: fileName,
        size: file.size,
        type: file.type,
        bucketType: bucketId,
        url: publicUrl,
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
      const images = data
        .filter(item => !item.id.endsWith('/')) // Filter out folders
        .map(item => {
          const filePath = path ? `${path}/${item.name}` : item.name;
          const { data: { publicUrl } } = supabase
            .storage
            .from(bucketId)
            .getPublicUrl(filePath);

          return {
            id: item.id,
            name: item.name,
            size: item.metadata?.size || 0,
            type: item.metadata?.mimetype || '',
            bucketType: bucketId,
            url: publicUrl,
            createdAt: item.created_at
          };
        });

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
 * Optimize an image before uploading (resize, compress)
 */
export async function optimizeImage(
  file: File,
  maxWidth = 1200,
  quality = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      // Create an image element to load the file
      const img = new Image();
      img.onload = () => {
        // Create a canvas to draw and resize the image
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions if the image is larger than maxWidth
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
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
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not create blob from canvas'));
              return;
            }
            
            // Create new file from blob
            const optimizedFile = new File(
              [blob],
              file.name,
              { type: 'image/jpeg', lastModified: Date.now() }
            );
            
            resolve(optimizedFile);
          },
          'image/jpeg',
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
  
  const upload = async (file: File, bucket: BucketType, path?: string, optimize = true) => {
    setIsUploading(true);
    setProgress(10);
    
    try {
      let fileToUpload = file;
      
      // Optimize image if requested
      if (optimize && file.type.startsWith('image/')) {
        fileToUpload = await optimizeImage(file);
        setProgress(30);
      }
      
      const result = await uploadImage(fileToUpload, bucket, path);
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

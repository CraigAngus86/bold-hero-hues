import { supabase } from '@/services/supabase/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { BucketType } from './config';
import { getImageDimensions } from './utils';
import { ImageMetadata, StoredImageMetadata } from './types';
import { handleDbOperation, DbServiceResponse } from '../utils/dbService';

type RpcFunction = 
  | 'store_image_metadata' 
  | 'get_image_metadata' 
  | 'delete_image_metadata' 
  | 'move_image_metadata' 
  | 'update_image_metadata';

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
      
      // Store metadata using stored procedure function
      if (metadata || dimensions) {
        // Using Supabase's rpc method to store metadata
        const { error: metadataError } = await supabase
          .rpc<any>('store_image_metadata' as RpcFunction, {
            bucket_id: bucketId,
            storage_path: data.path,
            file_name: fileName,
            alt_text: metadata?.alt_text || file.name.split('.')[0],
            description: metadata?.description,
            tags: metadata?.tags,
            dimensions: dimensions ? JSON.stringify(dimensions) : null
          });
        
        if (metadataError) throw metadataError;
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
            
          // Get metadata using rpc function
          const { data: metadataData, error: metadataError } = await supabase
            .rpc<StoredImageMetadata>('get_image_metadata' as RpcFunction, { 
              p_bucket_id: bucketId,
              p_storage_path: filePath
            });
            
          if (metadataError) console.error('Error fetching metadata:', metadataError);

          // Create a type-safe wrapper around the metadata response
          const typedMetadata = metadataData as StoredImageMetadata | null;

          return {
            id: item.id,
            name: item.name,
            size: item.metadata?.size || 0,
            type: item.metadata?.mimetype || '',
            bucketType: bucketId,
            url: publicUrl,
            alt_text: typedMetadata?.alt_text,
            description: typedMetadata?.description,
            tags: typedMetadata?.tags,
            dimensions: typedMetadata?.dimensions,
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
      // Delete metadata using rpc function
      await supabase
        .rpc<any>('delete_image_metadata' as RpcFunction, {
          p_bucket_id: bucketId,
          p_storage_path: path
        });
      
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

      // Update metadata using rpc function
      const { error: moveError } = await supabase
        .rpc<any>('move_image_metadata' as RpcFunction, {
          p_source_bucket_id: sourceBucketId,
          p_source_path: sourcePath,
          p_dest_bucket_id: destinationBucketId,
          p_dest_path: destinationPath
        });
      
      if (moveError) throw moveError;

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
      // Update metadata using rpc function
      const { error } = await supabase
        .rpc<any>('update_image_metadata' as RpcFunction, {
          p_bucket_id: bucketId,
          p_storage_path: path,
          p_alt_text: metadata.alt_text,
          p_description: metadata.description,
          p_tags: metadata.tags
        });
        
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
): Promise<DbServiceResponse<StoredImageMetadata>> {
  return handleDbOperation(
    async () => {
      // Get metadata using rpc function
      const { data, error } = await supabase
        .rpc<StoredImageMetadata>('get_image_metadata' as RpcFunction, {
          p_bucket_id: bucketId,
          p_storage_path: path
        });
        
      if (error) throw error;
      return data;
    },
    `Failed to get metadata for image ${path}`
  );
}

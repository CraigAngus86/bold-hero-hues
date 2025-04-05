import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BucketType, ImageMetadata, StoredImageMetadata } from './types';
import { v4 as uuidv4 } from 'uuid';

// Function to get the public URL for an image
export function getPublicUrl(bucketId: BucketType, path: string): string {
  const { data } = supabase.storage.from(bucketId).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Upload an image to storage and save metadata
 */
export async function uploadImage(
  file: File,
  bucket: BucketType,
  folderPath?: string, 
  metadata?: Partial<ImageMetadata>
): Promise<{ success: boolean; data?: ImageMetadata; error?: any }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;
    
    // Upload file to storage bucket
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }
    
    // Get public URL of uploaded file
    const url = getPublicUrl(bucket, filePath);
    
    // Store metadata in database
    const imageMetadata: StoredImageMetadata = {
      bucket_id: bucket,
      storage_path: filePath,
      file_name: file.name,
      alt_text: metadata?.alt_text,
      description: metadata?.description,
      tags: metadata?.tags,
      dimensions: metadata?.dimensions
    };
    
    const { error: metadataError } = await supabase
      .from('image_metadata')
      .insert(imageMetadata);

    if (metadataError) {
      console.warn('Error storing image metadata:', metadataError);
      // Continue even if metadata storage fails
    }
    
    // Return success with image data
    return {
      success: true,
      data: {
        id: fileName,
        name: file.name,
        size: file.size,
        type: file.type,
        bucketType: bucket,
        url,
        alt_text: metadata?.alt_text,
        description: metadata?.description,
        tags: metadata?.tags,
        dimensions: metadata?.dimensions,
        createdAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error };
  }
}

/**
 * Get images from a specific folder
 */
export async function getImages(
  bucket: BucketType,
  folderPath?: string
): Promise<{ success: boolean; data?: ImageMetadata[]; error?: any }> {
  try {
    // List files in storage bucket with optional folder path
    const path = folderPath || '';
    const { data: files, error: listError } = await supabase.storage
      .from(bucket)
      .list(path, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (listError) {
      throw listError;
    }

    if (!files || files.length === 0) {
      return { success: true, data: [] };
    }

    // Get metadata for all files
    const images: ImageMetadata[] = files
      .filter(file => !file.id.endsWith('/')) // Filter out folders
      .map(file => {
        const filePath = folderPath ? `${folderPath}/${file.name}` : file.name;
        const url = getPublicUrl(bucket, filePath);
        
        return {
          id: file.id,
          name: file.name,
          size: file.metadata?.size || 0,
          type: file.metadata?.mimetype || '',
          bucketType: bucket,
          url,
          createdAt: file.created_at || new Date().toISOString()
        };
      });

    return { success: true, data: images };
  } catch (error) {
    console.error('Error fetching images:', error);
    return { success: false, error };
  }
}

/**
 * Delete an image from storage and remove its metadata
 */
export async function deleteImage(
  bucket: BucketType,
  path: string
): Promise<{ success: boolean; error?: any }> {
  try {
    // Delete file from storage
    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (deleteError) {
      throw deleteError;
    }

    // Delete metadata from database
    const { error: metadataError } = await supabase
      .from('image_metadata')
      .delete()
      .eq('bucket_id', bucket)
      .eq('storage_path', path);

    if (metadataError) {
      console.warn('Error deleting image metadata:', metadataError);
      // Continue even if metadata deletion fails
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { success: false, error };
  }
}

/**
 * Move an image to a new location
 */
export async function moveImage(
  bucket: BucketType,
  oldPath: string,
  newPath: string
): Promise<{ success: boolean; error?: any }> {
  try {
    // Copy file to new location
    const { error: copyError } = await supabase.storage
      .from(bucket)
      .copy(oldPath, newPath);

    if (copyError) {
      throw copyError;
    }

    // Delete the old file
    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([oldPath]);

    if (deleteError) {
      throw deleteError;
    }

    // Update metadata in database
    const { error: metadataError } = await supabase
      .from('image_metadata')
      .update({ storage_path: newPath })
      .eq('bucket_id', bucket)
      .eq('storage_path', oldPath);

    if (metadataError) {
      console.warn('Error updating image metadata:', metadataError);
      // Continue even if metadata update fails
    }

    return { success: true };
  } catch (error) {
    console.error('Error moving image:', error);
    return { success: false, error };
  }
}

/**
 * Create a new folder in storage
 */
export async function createFolder(
  bucket: BucketType,
  folderPath: string,
  folderName: string
): Promise<{ success: boolean; error?: any }> {
  try {
    // Create a placeholder file to represent the folder
    const path = folderPath ? `${folderPath}/${folderName}/.folder` : `${folderName}/.folder`;
    const content = new Blob([''], { type: 'text/plain' });
    
    // Upload placeholder file
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, content);

    if (error) {
      throw error;
    }

    // Create folder entry in database
    const fullPath = folderPath ? `${folderPath}/${folderName}` : folderName;
    const { error: dbError } = await supabase
      .from('image_folders')
      .insert({
        name: folderName,
        path: fullPath,
        parent_id: null // This would need to be determined based on the folderPath
      });

    if (dbError) {
      console.warn('Error creating folder in database:', dbError);
      // Continue even if database entry fails
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating folder:', error);
    return { success: false, error };
  }
}

/**
 * Update image metadata
 */
export async function updateImageMetadata(
  bucket: BucketType,
  path: string,
  metadata: Partial<StoredImageMetadata>
): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase
      .from('image_metadata')
      .update(metadata)
      .eq('bucket_id', bucket)
      .eq('storage_path', path);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating image metadata:', error);
    return { success: false, error };
  }
}

/**
 * Get image metadata from database
 */
export async function getImageMetadata(
  bucket: BucketType,
  path: string
): Promise<{ success: boolean; data?: StoredImageMetadata; error?: any }> {
  try {
    const { data, error } = await supabase
      .from('image_metadata')
      .select('*')
      .eq('bucket_id', bucket)
      .eq('storage_path', path)
      .single();

    if (error) {
      throw error;
    }

    // Transform the data to match our expected StoredImageMetadata type
    const transformedData: StoredImageMetadata = {
      id: data.id,
      bucket_id: data.bucket_id,
      storage_path: data.storage_path,
      file_name: data.file_name,
      alt_text: data.alt_text,
      description: data.description,
      tags: data.tags,
      // Ensure dimensions is properly typed with a proper check
      dimensions: data.dimensions && 
                 typeof data.dimensions === 'object' && 
                 'width' in data.dimensions && 
                 'height' in data.dimensions ? 
                 { 
                   width: Number(data.dimensions.width), 
                   height: Number(data.dimensions.height) 
                 } : undefined
    };

    return { success: true, data: transformedData };
  } catch (error) {
    console.error('Error fetching image metadata:', error);
    return { success: false, error };
  }
}

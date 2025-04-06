
import { supabase } from '@/integrations/supabase/client';
import { BucketType, StoredImageMetadata, UploadResult } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload an image file to the specified storage bucket
 */
export const uploadImage = async (
  file: File,
  bucket: BucketType = 'images',
  folder: string = '',
  metadata: Record<string, any> = {}
): Promise<UploadResult> => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }
    
    // Create a unique file path to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    // Upload the file to storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error('Upload failed - no data returned');
    }
    
    // Get the public URL for the file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    if (!urlData.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }
    
    // Store file metadata
    const imageMetadata: Partial<StoredImageMetadata> = {
      file_name: file.name,
      storage_path: data.path,
      bucket_id: bucket,
      dimensions: metadata.dimensions || null,
      description: metadata.description || '',
      alt_text: metadata.alt_text || file.name,
      tags: metadata.tags || [],
    };
    
    // Store additional metadata in database
    const { data: metaData, error: metaError } = await supabase
      .from('image_metadata')
      .insert([imageMetadata])
      .select()
      .single();
    
    if (metaError) {
      console.error('Error storing image metadata:', metaError);
      // Don't fail the upload if metadata storage fails
    }
    
    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path,
      id: metaData?.id
    };
  } catch (error) {
    console.error('Image upload failed:', error);
    return {
      success: false,
      error
    };
  }
};

/**
 * Get all images from a folder
 */
export const getImagesFromFolder = async (
  folder: string = '',
  bucket: BucketType = 'images'
): Promise<StoredImageMetadata[]> => {
  try {
    // Get list of files from storage
    const { data: files, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        sortBy: { column: 'created_at', order: 'desc' }
      });
    
    if (error) {
      throw error;
    }
    
    // Filter out directories and get only files
    const fileNames = files
      .filter(file => !file.id.endsWith('/'))
      .map(file => {
        const path = folder ? `${folder}/${file.name}` : file.name;
        return path;
      });
    
    if (fileNames.length === 0) {
      return [];
    }
    
    // Get metadata for these files
    const { data: metadata, error: metaError } = await supabase
      .from('image_metadata')
      .select('*')
      .in('storage_path', fileNames)
      .eq('bucket_id', bucket);
    
    if (metaError) {
      throw metaError;
    }
    
    // For each file, get its public URL and merge with metadata
    const imagesWithUrls: StoredImageMetadata[] = (metadata || []).map(meta => {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(meta.storage_path);
      
      return {
        ...meta,
        url: data.publicUrl
      } as StoredImageMetadata;
    });
    
    return imagesWithUrls;
  } catch (error) {
    console.error('Error getting images from folder:', error);
    return [];
  }
};

/**
 * Get image by ID
 */
export const getImageById = async (id: string): Promise<StoredImageMetadata | null> => {
  try {
    const { data, error } = await supabase
      .from('image_metadata')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Get public URL for the image
    const { data: urlData } = supabase.storage
      .from(data.bucket_id)
      .getPublicUrl(data.storage_path);
    
    return {
      ...data,
      url: urlData.publicUrl
    } as StoredImageMetadata;
  } catch (error) {
    console.error('Error getting image by ID:', error);
    return null;
  }
};

/**
 * Update image metadata
 */
export const updateImageMetadata = async (
  id: string,
  updates: Partial<StoredImageMetadata>
): Promise<StoredImageMetadata | null> => {
  try {
    // Only allow updating certain fields
    const allowedUpdates = {
      alt_text: updates.alt_text,
      description: updates.description,
      tags: updates.tags
    };
    
    const { data, error } = await supabase
      .from('image_metadata')
      .update(allowedUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Get public URL for the image
    const { data: urlData } = supabase.storage
      .from(data.bucket_id)
      .getPublicUrl(data.storage_path);
    
    return {
      ...data,
      url: urlData.publicUrl
    } as StoredImageMetadata;
  } catch (error) {
    console.error('Error updating image metadata:', error);
    return null;
  }
};

/**
 * Delete an image
 */
export const deleteImage = async (id: string): Promise<boolean> => {
  try {
    // First get the image metadata
    const { data, error } = await supabase
      .from('image_metadata')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error('Image not found');
    }
    
    // Delete the file from storage
    const { error: deleteError } = await supabase.storage
      .from(data.bucket_id)
      .remove([data.storage_path]);
    
    if (deleteError) {
      throw deleteError;
    }
    
    // Delete the metadata
    const { error: metaDeleteError } = await supabase
      .from('image_metadata')
      .delete()
      .eq('id', id);
    
    if (metaDeleteError) {
      throw metaDeleteError;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

/**
 * Create a folder
 */
export const createFolder = async (
  name: string,
  parentPath: string = '',
  parentId: string | null = null
): Promise<{ success: boolean; id?: string; error?: any }> => {
  try {
    // Create folder path
    const folderPath = parentPath ? `${parentPath}/${name}` : name;
    
    // Create a placeholder file to represent the folder in storage
    const { error: storageError } = await supabase.storage
      .from('images')
      .upload(`${folderPath}/.folder`, new Blob(['']));
    
    if (storageError && storageError.message !== 'The resource already exists') {
      throw storageError;
    }
    
    // Create folder entry in database
    const { data, error } = await supabase
      .from('image_folders')
      .insert([{
        name,
        path: folderPath,
        parent_id: parentId
      }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error creating folder:', error);
    return { success: false, error };
  }
};

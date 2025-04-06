
import { supabase } from '@/integrations/supabase/client';
import { ImageMetadata, ImageFolder, StoredImageMetadata, ImageUploadResult } from './types';
import { Json } from '@supabase/supabase-js';

/**
 * Upload an image to Supabase Storage
 */
export async function uploadImage(file: File, bucket: string, path?: string, metadata?: Partial<StoredImageMetadata>): Promise<ImageUploadResult> {
  try {
    const filePath = path ? `${path}/${file.name}` : file.name;
    
    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert: true
      });
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Get public URL
    const { data: urlData } = await supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    if (!uploadData || !urlData) {
      throw new Error('Failed to upload image or get URL');
    }
    
    // Save metadata to database
    const imageMetadata: Partial<StoredImageMetadata> = {
      bucket_id: bucket,
      storage_path: filePath,
      file_name: file.name,
      type: file.type,
      size: file.size,
      ...metadata,
      name: metadata?.name || file.name,
    };
    
    // Insert metadata into database
    const { data: metadataData, error: metadataError } = await supabase
      .from('image_metadata')
      .insert(imageMetadata)
      .select()
      .single();
    
    if (metadataError) {
      throw metadataError;
    }
    
    return {
      success: true,
      url: urlData.publicUrl,
      data: {
        url: urlData.publicUrl
      },
      metadata: {
        ...metadataData,
        url: urlData.publicUrl,
        name: metadataData.name || file.name,
        type: file.type,
        size: file.size
      }
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get all images from a bucket
 */
export async function getImages(bucket: string, path?: string): Promise<ImageMetadata[]> {
  try {
    let query = supabase
      .from('image_metadata')
      .select('*')
      .eq('bucket_id', bucket);
    
    if (path) {
      query = query.eq('storage_path', path);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    if (!data || !data.length) {
      return [];
    }
    
    return Promise.all(data.map(async (item) => {
      // Get public URL for each image
      const { data: urlData } = await supabase.storage
        .from(bucket)
        .getPublicUrl(item.storage_path);
      
      return {
        ...item,
        url: urlData.publicUrl,
      };
    }));
  } catch (error) {
    console.error('Error getting images:', error);
    return [];
  }
}

/**
 * Get a single image by ID
 */
export async function getImage(id: string): Promise<ImageMetadata | null> {
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
    
    // Get public URL
    const { data: urlData } = await supabase.storage
      .from(data.bucket_id)
      .getPublicUrl(data.storage_path);
    
    return {
      ...data,
      url: urlData.publicUrl
    };
  } catch (error) {
    console.error('Error getting image:', error);
    return null;
  }
}

/**
 * Update image metadata
 */
export async function updateImage(id: string, metadata: Partial<ImageMetadata>): Promise<ImageMetadata | null> {
  try {
    // Convert ImageDimensions to JSON for storage
    const dbMetadata = {
      ...metadata,
      dimensions: metadata.dimensions as unknown as Json
    };
    
    const { data, error } = await supabase
      .from('image_metadata')
      .update(dbMetadata)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Get public URL
    const { data: urlData } = await supabase.storage
      .from(data.bucket_id)
      .getPublicUrl(data.storage_path);
    
    return {
      ...data,
      url: urlData.publicUrl
    };
  } catch (error) {
    console.error('Error updating image:', error);
    return null;
  }
}

/**
 * Delete an image and its metadata
 */
export async function deleteImage(id: string): Promise<boolean> {
  try {
    // First get the image to find the path in storage
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
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(data.bucket_id)
      .remove([data.storage_path]);
    
    if (storageError) {
      throw storageError;
    }
    
    // Delete metadata
    const { error: deleteError } = await supabase
      .from('image_metadata')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      throw deleteError;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Create a new folder
 */
export async function createFolder(name: string, path?: string): Promise<ImageFolder | null> {
  try {
    const folderPath = path ? `${path}/${name}` : name;
    
    // Create folder entry in database
    const { data, error } = await supabase
      .from('image_folders')
      .insert({
        name,
        path: folderPath,
        parent_id: path ? path : null
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      path: data.path,
      parentId: data.parent_id
    };
  } catch (error) {
    console.error('Error creating folder:', error);
    return null;
  }
}

/**
 * Get all folders
 */
export async function getFolders(): Promise<ImageFolder[]> {
  try {
    const { data, error } = await supabase
      .from('image_folders')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    if (!data || !data.length) {
      return [];
    }
    
    return data.map(folder => ({
      id: folder.id,
      name: folder.name,
      path: folder.path,
      parentId: folder.parent_id
    }));
  } catch (error) {
    console.error('Error getting folders:', error);
    return [];
  }
}

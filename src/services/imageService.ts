
import { supabase } from '@/lib/supabase';
import { ImageFolder, ImageMetadata, adaptDbImageMetadata, adaptDbImageFolder } from '@/types/images';

/**
 * Get all images from the database
 */
export async function getAllImages(bucketId = 'images'): Promise<ImageMetadata[]> {
  try {
    // First get image metadata from the database
    const { data: dbImages, error } = await supabase
      .from('image_metadata')
      .select('*')
      .eq('bucket_id', bucketId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }

    // Get public URLs for each image
    const images = dbImages.map(img => {
      const { data: { publicUrl } } = supabase
        .storage
        .from(bucketId)
        .getPublicUrl(img.storage_path);

      return adaptDbImageMetadata({
        ...img,
        url: publicUrl
      });
    });
    
    return images;
  } catch (error) {
    console.error('Error getting all images:', error);
    return [];
  }
}

/**
 * Get images by folder path
 */
export async function getImagesByFolder(folderPath: string, bucketId = 'images'): Promise<ImageMetadata[]> {
  try {
    // Normalize the folder path if it doesn't have a trailing slash
    const normalizedPath = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;
    
    // First get image metadata from the database that match the folder path
    const { data: dbImages, error } = await supabase
      .from('image_metadata')
      .select('*')
      .eq('bucket_id', bucketId)
      .like('storage_path', `${normalizedPath}%`)
      .not('storage_path', 'like', `${normalizedPath}*/%`) // Don't include subdirectories
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }

    // Get public URLs for each image
    const images = dbImages.map(img => {
      const { data: { publicUrl } } = supabase
        .storage
        .from(bucketId)
        .getPublicUrl(img.storage_path);

      return adaptDbImageMetadata({
        ...img,
        url: publicUrl
      });
    });
    
    return images;
  } catch (error) {
    console.error(`Error getting images from folder '${folderPath}':`, error);
    return [];
  }
}

/**
 * Get image folders from the database
 */
export async function getImageFolders(): Promise<ImageFolder[]> {
  try {
    const { data, error } = await supabase
      .from('image_folders')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data.map(adaptDbImageFolder);
  } catch (error) {
    console.error('Error getting image folders:', error);
    return [];
  }
}

/**
 * Create a new image folder
 */
export async function createImageFolder(name: string, path: string, parentId?: string): Promise<ImageFolder | null> {
  try {
    const { data, error } = await supabase
      .from('image_folders')
      .insert({
        name,
        path,
        parent_id: parentId || null
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return adaptDbImageFolder(data);
  } catch (error) {
    console.error('Error creating folder:', error);
    return null;
  }
}

/**
 * Update image metadata
 */
export async function updateImageMetadata(id: string, updates: Partial<ImageMetadata>): Promise<boolean> {
  try {
    // Convert frontend field names to database field names if needed
    const dbUpdates: any = {
      alt_text: updates.alt_text || updates.altText,
      description: updates.description,
      tags: updates.tags || updates.categories,
      // Don't allow updating sensitive fields like storage_path, file_name, etc.
    };
    
    // Remove undefined values
    Object.keys(dbUpdates).forEach(key => {
      if (dbUpdates[key] === undefined) {
        delete dbUpdates[key];
      }
    });
    
    const { error } = await supabase
      .from('image_metadata')
      .update(dbUpdates)
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating image metadata:', error);
    return false;
  }
}

/**
 * Delete an image and its metadata
 */
export async function deleteImage(id: string): Promise<boolean> {
  try {
    // First get the image metadata to know the storage path
    const { data: image, error: fetchError } = await supabase
      .from('image_metadata')
      .select('storage_path, bucket_id')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Delete from storage
    const { error: storageError } = await supabase
      .storage
      .from(image.bucket_id)
      .remove([image.storage_path]);
      
    if (storageError) throw storageError;
    
    // Delete metadata
    const { error: metadataError } = await supabase
      .from('image_metadata')
      .delete()
      .eq('id', id);
      
    if (metadataError) throw metadataError;
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

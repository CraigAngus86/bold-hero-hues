
import { BucketType, ImageOptimizationOptions, StoredImageMetadata, UploadResult } from './types';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { getImageDimensions, optimizeImage } from './utils';

/**
 * Upload an image to storage with optional optimization
 */
export const uploadImage = async (
  file: File,
  bucket: BucketType = 'images',
  options?: ImageOptimizationOptions
): Promise<UploadResult> => {
  try {
    // Generate a unique filename to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${bucket}/${fileName}`;
    
    // Optimize the image if options are provided
    let fileToUpload = file;
    if (options) {
      fileToUpload = await optimizeImage(file, options);
    }
    
    // Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Get a public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    // Get image dimensions
    const dimensions = await getImageDimensions(fileToUpload);
    
    // Store metadata in the database
    const metadata: Partial<StoredImageMetadata> = {
      file_name: fileName,
      storage_path: filePath,
      bucket_id: bucket,
      dimensions,
      content_type: fileToUpload.type,
      file_size: fileToUpload.size
    };
    
    const { data: metaData, error: metaError } = await supabase
      .from('image_metadata')
      .insert([metadata])
      .select()
      .single();
    
    if (metaError) {
      console.error('Failed to store image metadata:', metaError);
    }
    
    return {
      success: true,
      url: publicUrl,
      path: uploadData.path,
      data: metaData as StoredImageMetadata,
      id: metaData?.id
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

/**
 * Get images with optional filtering
 */
export const getImages = async (
  bucket?: BucketType,
  limit = 100,
  offset = 0,
  searchTerm?: string,
  tags?: string[]
): Promise<{
  data: StoredImageMetadata[];
  count: number;
}> => {
  try {
    let query = supabase.from('image_metadata').select('*', { count: 'exact' });
    
    // Apply filters
    if (bucket) {
      query = query.eq('bucket_id', bucket);
    }
    
    if (searchTerm) {
      query = query.or(`file_name.ilike.%${searchTerm}%,alt_text.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    
    if (tags && tags.length > 0) {
      // Filter by any of the specified tags
      query = query.contains('tags', tags);
    }
    
    // Apply pagination
    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      throw error;
    }
    
    // Get public URLs for all images
    const imagesWithUrls = data.map(image => {
      const { data: { publicUrl } } = supabase.storage
        .from(image.bucket_id)
        .getPublicUrl(image.storage_path);
      
      return {
        ...image,
        url: publicUrl
      } as StoredImageMetadata;
    });
    
    return {
      data: imagesWithUrls,
      count: count || 0
    };
  } catch (error) {
    console.error('Error getting images:', error);
    return { data: [], count: 0 };
  }
};

/**
 * Get a single image by ID
 */
export const getImageMetadata = async (id: string): Promise<StoredImageMetadata | null> => {
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
    const { data: { publicUrl } } = supabase.storage
      .from(data.bucket_id)
      .getPublicUrl(data.storage_path);
    
    return {
      ...data,
      url: publicUrl
    } as StoredImageMetadata;
  } catch (error) {
    console.error('Error getting image metadata:', error);
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
    const { data, error } = await supabase
      .from('image_metadata')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Get public URL for the image
    const { data: { publicUrl } } = supabase.storage
      .from(data.bucket_id)
      .getPublicUrl(data.storage_path);
    
    return {
      ...data,
      url: publicUrl
    } as StoredImageMetadata;
  } catch (error) {
    console.error('Error updating image metadata:', error);
    return null;
  }
};

/**
 * Delete an image and its metadata
 */
export const deleteImage = async (id: string): Promise<boolean> => {
  try {
    // First, get the image metadata to know which bucket and path to delete
    const { data, error: metaError } = await supabase
      .from('image_metadata')
      .select('*')
      .eq('id', id)
      .single();
    
    if (metaError) {
      throw metaError;
    }
    
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from(data.bucket_id)
      .remove([data.storage_path]);
    
    if (storageError) {
      throw storageError;
    }
    
    // Delete the metadata
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
};

/**
 * Get public URL for a file path
 */
export const getPublicUrl = (bucket: BucketType, path: string): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

/**
 * Move an image to a different location
 */
export const moveImage = async (
  id: string,
  newBucket: BucketType,
  newPath: string
): Promise<boolean> => {
  try {
    // Get current image info
    const { data: image, error: getError } = await supabase
      .from('image_metadata')
      .select('*')
      .eq('id', id)
      .single();
    
    if (getError) throw getError;
    
    // Download the file
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(image.bucket_id)
      .download(image.storage_path);
    
    if (downloadError) throw downloadError;
    
    // Upload to new location
    const { error: uploadError } = await supabase.storage
      .from(newBucket)
      .upload(newPath, fileData, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) throw uploadError;
    
    // Update the metadata
    const { error: updateError } = await supabase
      .from('image_metadata')
      .update({
        bucket_id: newBucket,
        storage_path: newPath
      })
      .eq('id', id);
    
    if (updateError) throw updateError;
    
    // Delete from old location
    const { error: deleteError } = await supabase.storage
      .from(image.bucket_id)
      .remove([image.storage_path]);
    
    if (deleteError) {
      console.warn('Failed to delete original image:', deleteError);
    }
    
    return true;
  } catch (error) {
    console.error('Error moving image:', error);
    return false;
  }
};

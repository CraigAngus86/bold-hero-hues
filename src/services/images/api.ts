
import { supabase } from '@/integrations/supabase/client';
import { 
  ImageOptimizationOptions, 
  StoredImageMetadata,
  BucketType,
  ImageSearchParams
} from './types';
import { generateUniqueFilename, optimizeImage, extractImageMetadata } from './utils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload an image to Supabase storage
 */
export const uploadImage = async (
  file: File,
  bucketName: BucketType,
  folderPath: string = '',
  options: ImageOptimizationOptions = {}
): Promise<{ url: string; data: any } | { error: any }> => {
  try {
    // Generate a unique filename
    const uniqueFilename = generateUniqueFilename(file.name);
    const filePath = folderPath ? `${folderPath}/${uniqueFilename}` : uniqueFilename;
    
    // Optimize the image if requested
    let fileToUpload = file;
    if (options.maxWidth || options.maxHeight || options.quality || options.convertToFormat) {
      fileToUpload = await optimizeImage(file, options) as File;
    }
    
    // Upload the file to Supabase
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) throw error;
    
    // Get the public URL
    const { data: urlData } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    // Store metadata
    const metadata = await extractImageMetadata(file);
    const metadataResult = await storeImageMetadata(bucketName, filePath, file.name, metadata, options.metadata);
    
    return {
      url: urlData.publicUrl,
      data: {
        ...data,
        metadata: metadataResult
      }
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { error };
  }
};

/**
 * Store image metadata in the database
 */
const storeImageMetadata = async (
  bucketName: string,
  storagePath: string,
  fileName: string,
  fileMetadata: Record<string, any> = {},
  customMetadata: Record<string, any> = {}
) => {
  try {
    // Prepare metadata object
    const metadata = {
      id: uuidv4(),
      bucket_id: bucketName,
      storage_path: storagePath,
      file_name: fileName,
      file_size: fileMetadata.size || 0,
      content_type: fileMetadata.type || 'application/octet-stream',
      alt_text: customMetadata?.alt_text || '',
      description: customMetadata?.description || '',
      tags: customMetadata?.tags || [],
      categories: customMetadata?.categories || [],
      dimensions: fileMetadata.width && fileMetadata.height ? 
        { width: fileMetadata.width, height: fileMetadata.height } : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Store metadata in the database
    const { data, error } = await supabase
      .from('image_metadata')
      .insert([metadata])
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error storing image metadata:', error);
    return null;
  }
};

/**
 * Get images from a specific bucket and folder
 */
export const getImages = async (
  bucketName: BucketType,
  folderPath: string = '',
  searchParams: ImageSearchParams = {}
): Promise<{
  data: StoredImageMetadata[];
  count: number;
  error?: any;
}> => {
  try {
    // List files in the storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from(bucketName)
      .list(folderPath, {
        sortBy: { column: 'name', order: 'asc' }
      });
    
    if (storageError) throw storageError;
    
    // Get metadata for the files
    let query = supabase
      .from('image_metadata')
      .select('*', { count: 'exact' })
      .eq('bucket_id', bucketName);
    
    if (folderPath) {
      // Use like to match files in the specific folder
      query = query.ilike('storage_path', `${folderPath}%`);
    }
    
    // Apply search filters
    if (searchParams.search) {
      query = query.or(`file_name.ilike.%${searchParams.search}%,alt_text.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`);
    }
    
    if (searchParams.tags && searchParams.tags.length > 0) {
      query = query.contains('tags', searchParams.tags);
    }
    
    if (searchParams.categories && searchParams.categories.length > 0) {
      query = query.overlaps('categories', searchParams.categories);
    }
    
    if (searchParams.type) {
      query = query.ilike('content_type', `${searchParams.type}/%`);
    }
    
    if (searchParams.startDate) {
      query = query.gte('created_at', searchParams.startDate);
    }
    
    if (searchParams.endDate) {
      query = query.lte('created_at', searchParams.endDate);
    }
    
    // Apply sorting
    if (searchParams.sortBy) {
      const field = searchParams.sortBy === 'name' ? 'file_name' : searchParams.sortBy;
      const ascending = searchParams.sortDirection !== 'desc';
      query = query.order(field, { ascending });
    } else {
      // Default sorting by created date, newest first
      query = query.order('created_at', { ascending: false });
    }
    
    // Apply pagination
    if (searchParams.page !== undefined && searchParams.pageSize !== undefined) {
      const start = searchParams.page * searchParams.pageSize;
      const end = start + searchParams.pageSize - 1;
      query = query.range(start, end);
    }
    
    // Execute the query
    const { data: metadataData, error: metadataError, count } = await query;
    
    if (metadataError) throw metadataError;
    
    // Return the combined data
    return {
      data: metadataData || [],
      count: count || 0,
    };
  } catch (error) {
    console.error('Error getting images:', error);
    return {
      data: [],
      count: 0,
      error
    };
  }
};

/**
 * Delete an image
 */
export const deleteImage = async (
  bucketName: BucketType,
  filePath: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    // Delete the file from storage
    const { error: storageError } = await supabase
      .storage
      .from(bucketName)
      .remove([filePath]);
    
    if (storageError) throw storageError;
    
    // Delete the metadata from the database
    const { error: metadataError } = await supabase
      .from('image_metadata')
      .delete()
      .eq('bucket_id', bucketName)
      .eq('storage_path', filePath);
    
    if (metadataError) throw metadataError;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { success: false, error };
  }
};

/**
 * Get the public URL for an image
 */
export const getPublicUrl = (
  bucketName: BucketType,
  filePath: string
): string => {
  const { data } = supabase
    .storage
    .from(bucketName)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};

/**
 * Move an image to a different location
 */
export const moveImage = async (
  sourceBucket: BucketType,
  sourcePath: string,
  destinationBucket: BucketType,
  destinationPath: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    // Copy the file to the new location
    const { data, error: copyError } = await supabase
      .storage
      .from(sourceBucket)
      .copy(sourcePath, destinationPath, {
        destinationBucket: destinationBucket
      });
    
    if (copyError) throw copyError;
    
    // Delete the original file
    const { error: removeError } = await supabase
      .storage
      .from(sourceBucket)
      .remove([sourcePath]);
    
    if (removeError) throw removeError;
    
    // Update the metadata
    const { error: metadataError } = await supabase
      .from('image_metadata')
      .update({
        bucket_id: destinationBucket,
        storage_path: destinationPath,
        updated_at: new Date().toISOString()
      })
      .eq('bucket_id', sourceBucket)
      .eq('storage_path', sourcePath);
    
    if (metadataError) throw metadataError;
    
    return { success: true };
  } catch (error) {
    console.error('Error moving image:', error);
    return { success: false, error };
  }
};

/**
 * Create a folder in a bucket
 */
export const createFolder = async (
  bucketName: BucketType,
  folderPath: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    // Create an empty file as a placeholder to create the folder
    const placeholderPath = `${folderPath}/.folder`;
    const placeholderContent = new Blob([''], { type: 'text/plain' });
    
    const { error } = await supabase
      .storage
      .from(bucketName)
      .upload(placeholderPath, placeholderContent);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error creating folder:', error);
    return { success: false, error };
  }
};

/**
 * Update image metadata
 */
export const updateImageMetadata = async (
  bucketName: BucketType,
  filePath: string,
  metadata: Partial<StoredImageMetadata>
): Promise<{ success: boolean; data?: StoredImageMetadata; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('image_metadata')
      .update({
        ...metadata,
        updated_at: new Date().toISOString()
      })
      .eq('bucket_id', bucketName)
      .eq('storage_path', filePath)
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error updating image metadata:', error);
    return { success: false, error };
  }
};

/**
 * Get image metadata
 */
export const getImageMetadata = async (
  bucketName: BucketType,
  filePath: string
): Promise<{ data?: StoredImageMetadata; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('image_metadata')
      .select()
      .eq('bucket_id', bucketName)
      .eq('storage_path', filePath)
      .single();
    
    if (error) throw error;
    
    return { data };
  } catch (error) {
    console.error('Error getting image metadata:', error);
    return { error };
  }
};

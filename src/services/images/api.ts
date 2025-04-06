
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { 
  ImageMetadata, 
  StoredImageMetadata, 
  ImageUploadResult,
  ImageDimensions
} from './types';

// Helper functions to convert between API/DB and frontend data models
const mapStoredToImageMetadata = (stored: StoredImageMetadata, url?: string): ImageMetadata => {
  return {
    id: stored.id,
    file_name: stored.file_name,
    storage_path: stored.storage_path,
    bucket_id: stored.bucket_id,
    url: url || '',
    alt_text: stored.alt_text,
    description: stored.description,
    dimensions: stored.dimensions,
    tags: stored.tags,
    created_at: stored.created_at,
    updated_at: stored.updated_at,
    created_by: stored.created_by,
    
    // Aliases for frontend compatibility
    name: stored.file_name,
    type: stored.type || 'image', 
    size: stored.size,
    width: stored.dimensions?.width,
    height: stored.dimensions?.height,
    altText: stored.alt_text,
    createdAt: stored.created_at,
    updatedAt: stored.updated_at,
    path: stored.storage_path,
    bucket: stored.bucket_id
  };
};

// Upload an image to storage
export async function uploadImage(
  file: File, 
  bucket: string, 
  folder?: string, 
  metadata?: Partial<StoredImageMetadata>
): Promise<ImageUploadResult> {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Create storage path
    const storagePath = folder 
      ? `${folder.replace(/^\/|\/$/g, '')}/${fileName}` 
      : fileName;
    
    // Upload to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);
    
    // Extract image dimensions if possible
    let dimensions: ImageDimensions | undefined;
    if (file.type.startsWith('image/')) {
      dimensions = await getImageDimensions(file);
    }
    
    // Create metadata record
    const imageMetadata: Partial<StoredImageMetadata> = {
      bucket_id: bucket,
      storage_path: storagePath,
      file_name: file.name,
      alt_text: metadata?.alt_text || '',
      description: metadata?.description || '',
      dimensions: dimensions,
      tags: metadata?.tags || [],
      size: file.size,
      type: file.type,
      ...metadata
    };
    
    // Store metadata in database
    const { error: metadataError, data: storedMetadata } = await supabase
      .from('image_metadata')
      .insert(imageMetadata)
      .select()
      .single();
    
    if (metadataError) {
      console.warn('Failed to store image metadata:', metadataError);
    }
    
    // Return success with metadata
    const result: ImageMetadata = {
      id: storedMetadata?.id || uuidv4(),
      file_name: file.name,
      name: file.name,
      storage_path: storagePath,
      bucket_id: bucket,
      url: publicUrl,
      alt_text: metadata?.alt_text || '',
      description: metadata?.description || '',
      dimensions: dimensions,
      file_size: file.size,
      size: file.size,
      content_type: file.type,
      type: file.type,
      tags: metadata?.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: metadata?.created_by,
      width: dimensions?.width,
      height: dimensions?.height,
      altText: metadata?.alt_text || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      path: storagePath,
      bucket: bucket,
    };
    
    return {
      success: true,
      metadata: result,
      data: {
        url: publicUrl,
        path: storagePath,
        bucket
      },
      url: publicUrl
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image'
    };
  }
}

// Get image dimensions from File object
async function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.src = URL.createObjectURL(file);
  });
}

// Get a list of images
export async function getImages(bucket: string, folder?: string): Promise<ImageMetadata[]> {
  try {
    // Query image metadata
    const { data: metadataList, error: metadataError } = await supabase
      .from('image_metadata')
      .select('*')
      .eq('bucket_id', bucket)
      .order('created_at', { ascending: false });
    
    if (metadataError) throw metadataError;
    
    // Filter by folder if specified
    const filteredMetadata = folder 
      ? metadataList.filter(item => item.storage_path.startsWith(folder)) 
      : metadataList;
    
    // Get public URL for each image and map to frontend format
    const images = await Promise.all(
      filteredMetadata.map(async (item) => {
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(item.storage_path);
        
        return mapStoredToImageMetadata(item, publicUrl);
      })
    );
    
    return images;
  } catch (error) {
    console.error('Error getting images:', error);
    return [];
  }
}

// Get a single image by ID
export async function getImage(id: string): Promise<ImageMetadata | null> {
  try {
    const { data, error } = await supabase
      .from('image_metadata')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    // Get URL
    const { data: { publicUrl } } = supabase.storage
      .from(data.bucket_id)
      .getPublicUrl(data.storage_path);
    
    return mapStoredToImageMetadata(data, publicUrl);
  } catch (error) {
    console.error('Error getting image:', error);
    return null;
  }
}

// Update image metadata
export async function updateImage(
  id: string, 
  metadata: Partial<ImageMetadata>
): Promise<ImageMetadata | null> {
  try {
    // Map frontend to stored format
    const storedMetadata: Partial<StoredImageMetadata> = {
      alt_text: metadata.alt_text || metadata.altText,
      description: metadata.description,
      tags: metadata.tags
    };
    
    const { data, error } = await supabase
      .from('image_metadata')
      .update(storedMetadata)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    // Get URL
    const { data: { publicUrl } } = supabase.storage
      .from(data.bucket_id)
      .getPublicUrl(data.storage_path);
    
    return mapStoredToImageMetadata(data, publicUrl);
  } catch (error) {
    console.error('Error updating image:', error);
    return null;
  }
}

// Delete an image
export async function deleteImage(id: string): Promise<boolean> {
  try {
    // Get image metadata first
    const { data, error } = await supabase
      .from('image_metadata')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Image not found');
    
    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from(data.bucket_id)
      .remove([data.storage_path]);
    
    if (deleteError) throw deleteError;
    
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

// Get image folders
export async function getFolders(bucket = 'images'): Promise<ImageFolder[]> {
  try {
    const { data, error } = await supabase
      .from('image_folders')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return (data || []).map(folder => ({
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

// Create a new folder
export async function createFolder(name: string, parentId?: string): Promise<ImageFolder | null> {
  try {
    // Get parent path if parentId is provided
    let parentPath = '/';
    if (parentId) {
      const { data: parent } = await supabase
        .from('image_folders')
        .select('path')
        .eq('id', parentId)
        .single();
      
      if (parent) {
        parentPath = parent.path === '/' ? '/' : `${parent.path}/`;
      }
    }
    
    const folderPath = `${parentPath}${name}`;
    
    const { data, error } = await supabase
      .from('image_folders')
      .insert({
        name,
        path: folderPath,
        parent_id: parentId || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
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

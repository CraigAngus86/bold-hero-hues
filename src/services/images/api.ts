import { supabase } from '@/lib/supabase';
import { unwrapPromise } from '@/lib/supabaseHelpers';
import { v4 as uuidv4 } from 'uuid';
import { 
  ImageMetadata, 
  StoredImageMetadata, 
  ImageUploadResult,
  ImageDimensions,
  ImageFolder
} from './types';

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

export async function uploadImage(
  file: File, 
  bucket: string, 
  folder?: string, 
  metadata?: Partial<StoredImageMetadata>
): Promise<ImageUploadResult> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    const storagePath = folder 
      ? `${folder.replace(/^\/|\/$/g, '')}/${fileName}` 
      : fileName;
    
    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);
    
    let dimensions: ImageDimensions | undefined;
    if (file.type.startsWith('image/')) {
      dimensions = await getImageDimensions(file);
    }
    
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
    
    const { error: metadataError, data: storedMetadata } = await supabase
      .from('image_metadata')
      .insert(imageMetadata)
      .select()
      .single();
    
    if (metadataError) {
      console.warn('Failed to store image metadata:', metadataError);
    }
    
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

export async function getImages(bucket: string, folder?: string): Promise<ImageMetadata[]> {
  try {
    const { data: metadataList, error: metadataError } = await supabase
      .from('image_metadata')
      .select('*')
      .eq('bucket_id', bucket)
      .order('created_at', { ascending: false });
    
    if (metadataError) throw metadataError;
    
    const filteredMetadata = folder 
      ? metadataList.filter(item => item.storage_path.startsWith(folder)) 
      : metadataList;
    
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

export async function getImage(id: string): Promise<ImageMetadata | null> {
  try {
    const { data, error } = await supabase
      .from('image_metadata')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    const { data: { publicUrl } } = supabase.storage
      .from(data.bucket_id)
      .getPublicUrl(data.storage_path);
    
    return mapStoredToImageMetadata(data, publicUrl);
  } catch (error) {
    console.error('Error getting image:', error);
    return null;
  }
}

export async function updateImage(
  id: string, 
  metadata: Partial<ImageMetadata>
): Promise<ImageMetadata | null> {
  try {
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
    
    const { data: { publicUrl } } = supabase.storage
      .from(data.bucket_id)
      .getPublicUrl(data.storage_path);
    
    return mapStoredToImageMetadata(data, publicUrl);
  } catch (error) {
    console.error('Error updating image:', error);
    return null;
  }
}

export async function deleteImage(id: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('image_metadata')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Image not found');
    
    const { error: deleteError } = await supabase.storage
      .from(data.bucket_id)
      .remove([data.storage_path]);
    
    if (deleteError) throw deleteError;
    
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

export async function getFolders(parentId: string | null = null): Promise<ImageFolder[]> {
  try {
    const { data, error } = await supabase
      .from('image_folders')
      .select('*')
      .eq('parent_id', parentId);
    
    if (error) {
      console.error('Error fetching folders:', error);
      throw error;
    }
    
    return data.map(folder => ({
      id: folder.id,
      name: folder.name,
      path: folder.path,
      parentId: folder.parent_id
    }));
  } catch (error) {
    console.error('Error in getFolders:', error);
    return [];
  }
}

export async function createFolder(name: string, parentId: string | null = null): Promise<ImageFolder | null> {
  try {
    let path = '';
    
    if (parentId) {
      const { data: parentFolder } = await supabase
        .from('image_folders')
        .select('path')
        .eq('id', parentId)
        .single();
      
      if (parentFolder) {
        path = `${parentFolder.path}/${name}`;
      }
    } else {
      path = `/${name}`;
    }
    
    const { data, error } = await supabase
      .from('image_folders')
      .insert([
        {
          name,
          parent_id: parentId,
          path
        }
      ])
      .select();
    
    if (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return null;
    }
    
    return {
      id: data[0].id,
      name: data[0].name,
      path: data[0].path,
      parentId: data[0].parent_id
    };
  } catch (error) {
    console.error('Error in createFolder:', error);
    return null;
  }
}

export const getMediaCount = async (): Promise<{ count: number }> => {
  try {
    const response = await unwrapPromise(
      supabase
        .from('image_metadata')
        .select('*', { count: 'exact', head: true })
    );
    
    return { 
      count: response.count || 0 
    };
  } catch (error) {
    console.error('Error getting media count:', error);
    return { count: 0 };
  }
};

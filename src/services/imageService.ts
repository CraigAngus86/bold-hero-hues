
import { supabase } from '@/integrations/supabase/client';
import { uploadImage, getImage, getImages, updateImage, deleteImage, getFolders, createFolder } from './images/api';
import { ImageMetadata, ImageFolder } from './images/types';

// Export API functions
export {
  uploadImage,
  getImage,
  getImages,
  updateImage,
  deleteImage,
  getFolders,
  createFolder
};

// Upload an image with additional metadata
export const uploadImageWithMetadata = async (
  file: File,
  bucket: string,
  metadata: Partial<ImageMetadata>
) => {
  return uploadImage(file, bucket, metadata.path, metadata);
};

// Get images by category
export const getImagesByCategory = async (bucket: string, category: string): Promise<ImageMetadata[]> => {
  try {
    const { data, error } = await supabase
      .from('image_metadata')
      .select('*')
      .eq('bucket_id', bucket)
      .eq('categories', `{${category}}`);
    
    if (error) throw error;
    
    if (!data || !data.length) return [];
    
    return Promise.all(data.map(async (item) => {
      const { data: urlData } = await supabase.storage
        .from(bucket)
        .getPublicUrl(item.storage_path);
      
      return {
        ...item,
        url: urlData.publicUrl
      };
    }));
  } catch (error) {
    console.error('Error getting images by category:', error);
    return [];
  }
};

// Get images by tag
export const getImagesByTag = async (bucket: string, tag: string): Promise<ImageMetadata[]> => {
  try {
    const { data, error } = await supabase
      .from('image_metadata')
      .select('*')
      .eq('bucket_id', bucket)
      .contains('tags', [tag]);
    
    if (error) throw error;
    
    if (!data || !data.length) return [];
    
    return Promise.all(data.map(async (item) => {
      const { data: urlData } = await supabase.storage
        .from(bucket)
        .getPublicUrl(item.storage_path);
      
      return {
        ...item,
        url: urlData.publicUrl
      };
    }));
  } catch (error) {
    console.error('Error getting images by tag:', error);
    return [];
  }
};

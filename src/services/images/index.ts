
import { supabase } from '@/lib/supabase';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface UploadResult {
  url: string;
  path: string;
  filename: string;
  filesize: number;
  mime: string;
  dimensions?: ImageDimensions;
  error?: string;
}

/**
 * Uploads an image to Supabase storage
 */
export async function uploadImage(
  file: File, 
  folder = 'general',
  maxFileSize = 10485760 // 10MB
): Promise<UploadResult> {
  try {
    // Validate file size
    if (file.size > maxFileSize) {
      throw new Error(`File size exceeds limit of ${Math.floor(maxFileSize/1024/1024)}MB`);
    }
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    
    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, { upsert: true });
      
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    // Get image dimensions asynchronously
    const dimensions = await getImageDimensions(file);
    
    return {
      url: publicUrl,
      path: filePath,
      filename: fileName,
      filesize: file.size,
      mime: file.type,
      dimensions
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      url: '',
      path: '',
      filename: '',
      filesize: 0,
      mime: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Gets image dimensions from File
 */
async function getImageDimensions(file: File): Promise<ImageDimensions | undefined> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(undefined);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      resolve(undefined);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Deletes an image from Supabase storage
 */
export async function deleteImage(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('images')
      .remove([path]);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Gets a list of image files from a folder
 */
export async function getImageFiles(folder: string = ''): Promise<any[]> {
  try {
    const { data, error } = await supabase.storage
      .from('images')
      .list(folder, { sortBy: { column: 'created_at', order: 'desc' } });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error getting image files:', error);
    return [];
  }
}

// Image upload configuration for different content types
export const imageConfig = {
  news: {
    bucketName: 'images',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeMB: 5
  },
  profiles: {
    bucketName: 'images',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeMB: 2
  },
  fixtures: {
    bucketName: 'images',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeMB: 5
  },
  sponsors: {
    bucketName: 'images',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    maxSizeMB: 2
  },
  gallery: {
    bucketName: 'images',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeMB: 10
  }
};

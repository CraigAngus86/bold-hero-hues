
import { ImageOptimizationOptions } from './types';

/**
 * Optimizes an image based on the provided options
 * This is a placeholder implementation that would normally use a library like sharp
 * or browser-based canvas resizing
 */
export const optimizeImage = async (
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<Blob> => {
  // In a real implementation, we would use libraries like browser-image-compression
  // or create a canvas-based solution for client-side optimization
  
  // For now, we'll return the original file as a demonstration
  console.log('Image optimization requested with options:', options);
  return file;
};

/**
 * Calculate dimensions while preserving aspect ratio
 */
export const calculateDimensions = (
  width: number,
  height: number,
  maxWidth?: number,
  maxHeight?: number
): { width: number; height: number } => {
  if (!maxWidth && !maxHeight) {
    return { width, height };
  }
  
  const aspectRatio = width / height;
  
  if (maxWidth && maxHeight) {
    if (width > maxWidth || height > maxHeight) {
      if (width / maxWidth > height / maxHeight) {
        return {
          width: maxWidth,
          height: Math.round(maxWidth / aspectRatio),
        };
      } else {
        return {
          width: Math.round(maxHeight * aspectRatio),
          height: maxHeight,
        };
      }
    }
    return { width, height };
  } else if (maxWidth) {
    if (width > maxWidth) {
      return {
        width: maxWidth,
        height: Math.round(maxWidth / aspectRatio),
      };
    }
    return { width, height };
  } else if (maxHeight) {
    if (height > maxHeight) {
      return {
        width: Math.round(maxHeight * aspectRatio),
        height: maxHeight,
      };
    }
    return { width, height };
  }
  
  return { width, height };
};

/**
 * Get image dimensions from a file
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not an image file'));
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
      URL.revokeObjectURL(img.src); // Clean up
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src); // Clean up
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Generate a unique filename
 */
export const generateUniqueFilename = (originalFilename: string): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const extension = originalFilename.split('.').pop();
  
  return `${timestamp}-${random}.${extension}`;
};

/**
 * Extract metadata from an image file
 */
export const extractImageMetadata = async (file: File) => {
  const metadata: Record<string, any> = {
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: file.lastModified,
  };
  
  if (file.type.startsWith('image/')) {
    try {
      const dimensions = await getImageDimensions(file);
      metadata.width = dimensions.width;
      metadata.height = dimensions.height;
    } catch (error) {
      console.error('Error extracting image dimensions:', error);
    }
  }
  
  return metadata;
};

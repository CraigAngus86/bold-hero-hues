import { ImageDimensions, ImageOptimizationOptions } from './types';

/**
 * Get dimensions of an image
 */
export const getImageDimensions = async (file: File): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Optimize an image based on options
 */
export const optimizeImage = async (
  file: File,
  options: ImageOptimizationOptions
): Promise<File> => {
  const { maxWidth, maxHeight, quality = 85, format } = options;
  
  // If no optimization needed, return original
  if (!maxWidth && !maxHeight && !format) {
    return file;
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }
    
    img.onload = () => {
      let { width, height } = img;
      
      // Calculate new dimensions while maintaining aspect ratio
      if (maxWidth && width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (maxHeight && height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to specified format or keep original
      const outputFormat = format || file.type;
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          
          const optimizedFile = new File(
            [blob],
            file.name.split('.')[0] + getExtensionFromMimeType(outputFormat),
            { type: outputFormat }
          );
          
          resolve(optimizedFile);
        },
        outputFormat,
        quality ? quality / 100 : undefined
      );
      
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for optimization'));
      URL.revokeObjectURL(img.src);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Get file extension from MIME type
 */
const getExtensionFromMimeType = (mimeType: string): string => {
  switch (mimeType) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'image/gif':
      return '.gif';
    case 'image/svg+xml':
      return '.svg';
    default:
      return '.jpg';
  }
};

/**
 * Convert a base64 string to a File object
 */
export const base64ToFile = (base64: string, fileName: string): File => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], fileName, { type: mime });
};

/**
 * Convert file size to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate a thumbnail version of an image
 */
export const generateThumbnail = async (file: File, maxSize = 200): Promise<File> => {
  return optimizeImage(file, {
    maxWidth: maxSize,
    maxHeight: maxSize,
    quality: 70,
  });
};

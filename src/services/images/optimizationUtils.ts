import { ImageOptimizationOptions } from './types';

/**
 * Default image optimization options
 */
export const defaultOptimizationOptions: ImageOptimizationOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8
};

/**
 * Optimize an image using browser canvas API
 */
export const optimizeImage = async (
  file: File,
  options: ImageOptimizationOptions = defaultOptimizationOptions
): Promise<File> => {
  // Create a FileReader to read the image file
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = async (event) => {
      try {
        if (!event.target?.result || typeof event.target.result !== 'string') {
          throw new Error('Failed to read image file');
        }
        
        // Create an image element to load the file
        const img = new Image();
        
        // Wait for the image to load
        const imageLoadPromise = new Promise<void>((resolveImage, rejectImage) => {
          img.onload = () => resolveImage();
          img.onerror = () => rejectImage(new Error('Failed to load image'));
        });
        
        // Set image source to the result from FileReader
        img.src = event.target.result;
        await imageLoadPromise;
        
        // Calculate dimensions while maintaining aspect ratio
        const { width, height } = calculateDimensions(
          img.width,
          img.height,
          options.maxWidth || 1200,
          options.maxHeight || 1200
        );
        
        // Create a canvas to resize the image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw the image on the canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert the canvas to a Blob
        const format = options.format || determineOutputFormat(file.type);
        const quality = options.quality || 0.8;
        
        const blob = await new Promise<Blob>((resolveBlob, rejectBlob) => {
          canvas.toBlob(
            (result) => {
              if (result) {
                resolveBlob(result);
              } else {
                rejectBlob(new Error('Failed to create image blob'));
              }
            },
            `image/${format}`,
            quality
          );
        });
        
        // Create a new File from the Blob
        const optimizedFile = new File(
          [blob],
          // Change extension if format is different
          updateFileExtension(file.name, format),
          {
            type: `image/${format}`,
            lastModified: Date.now(),
          }
        );
        
        resolve(optimizedFile);
      } catch (error) {
        console.error('Error optimizing image:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    // Read the file as a data URL
    reader.readAsDataURL(file);
  });
};

/**
 * Calculate dimensions while maintaining aspect ratio
 */
const calculateDimensions = (
  origWidth: number,
  origHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  // If image is smaller than max dimensions, return original size
  if (origWidth <= maxWidth && origHeight <= maxHeight) {
    return { width: origWidth, height: origHeight };
  }
  
  // Calculate aspect ratio
  const ratio = Math.min(maxWidth / origWidth, maxHeight / origHeight);
  
  // Return new dimensions
  return {
    width: Math.round(origWidth * ratio),
    height: Math.round(origHeight * ratio),
  };
};

/**
 * Determine the output format for the image
 */
const determineOutputFormat = (mimeType: string): string => {
  // Default to webp for best compression/quality ratio
  const defaultFormat = 'webp';
  
  // If original is PNG with transparency, keep as PNG to preserve alpha
  if (mimeType === 'image/png') {
    // In a real implementation, we would check if the PNG has transparency
    // For now, just default to webp
    return 'webp';
  }
  
  // For SVG, keep as SVG or convert to PNG to preserve quality
  if (mimeType === 'image/svg+xml') {
    return 'png';
  }
  
  return defaultFormat;
};

/**
 * Update file extension based on output format
 */
const updateFileExtension = (fileName: string, format: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return `${fileName}.${format}`;
  }
  
  const baseName = fileName.substring(0, lastDotIndex);
  return `${baseName}.${format}`;
};

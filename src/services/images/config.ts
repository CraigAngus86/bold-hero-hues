
import { ImageOptimizationOptions, BucketType } from './types';

// Image upload configuration presets
export const imageUploadConfigs = {
  // Default configuration
  default: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 80,
    convertToFormat: 'webp',
    generateThumbnail: true,
    thumbnailSize: 300,
    compressionLevel: 6,
  } as ImageOptimizationOptions,
  
  // High quality images
  highQuality: {
    maxWidth: 2560,
    maxHeight: 1440,
    quality: 90,
    convertToFormat: 'webp',
    generateThumbnail: true,
    thumbnailSize: 400,
    compressionLevel: 4,
  } as ImageOptimizationOptions,
  
  // Thumbnails
  thumbnail: {
    maxWidth: 300,
    maxHeight: 300,
    quality: 75,
    convertToFormat: 'webp',
    generateThumbnail: false,
    compressionLevel: 7,
  } as ImageOptimizationOptions,
  
  // Profile pictures
  avatar: {
    maxWidth: 500,
    maxHeight: 500,
    quality: 85,
    convertToFormat: 'webp',
    generateThumbnail: true,
    thumbnailSize: 150,
    compressionLevel: 6,
  } as ImageOptimizationOptions,
  
  // Banner images
  banner: {
    maxWidth: 1920,
    maxHeight: 600,
    quality: 85,
    convertToFormat: 'webp',
    generateThumbnail: true,
    thumbnailSize: 600,
    compressionLevel: 6,
  } as ImageOptimizationOptions,
};

// Storage bucket configurations
export const storageBuckets = {
  public: {
    id: 'public',
    name: 'Public Bucket',
    isPublic: true,
    allowedMimeTypes: ['image/*', 'video/*', 'application/pdf'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  
  images: {
    id: 'images',
    name: 'Images',
    isPublic: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
  
  avatars: {
    id: 'avatars',
    name: 'User Avatars',
    isPublic: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 2 * 1024 * 1024, // 2MB
  },
  
  private: {
    id: 'private',
    name: 'Private Storage',
    isPublic: false,
    allowedMimeTypes: ['*/*'],
    maxFileSize: 50 * 1024 * 1024, // 50MB
  },
  
  media: {
    id: 'media',
    name: 'Media Library',
    isPublic: true,
    allowedMimeTypes: [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'video/mp4', 'video/webm', 'video/ogg',
      'audio/mpeg', 'audio/wav', 'audio/ogg'
    ],
    maxFileSize: 100 * 1024 * 1024, // 100MB
  },
};

// File validations
export const validateFile = (
  file: File, 
  bucket: BucketType = 'public'
): { valid: boolean; error?: string } => {
  const bucketConfig = storageBuckets[bucket] || storageBuckets.public;
  
  // Check file size
  if (file.size > bucketConfig.maxFileSize) {
    const maxSizeMB = bucketConfig.maxFileSize / (1024 * 1024);
    return {
      valid: false,
      error: `File size exceeds the maximum allowed size of ${maxSizeMB}MB`
    };
  }
  
  // Check mime type if specific types are allowed
  if (bucketConfig.allowedMimeTypes[0] !== '*/*') {
    const isAllowedType = bucketConfig.allowedMimeTypes.some(type => {
      if (type.endsWith('/*')) {
        // Handle wildcard mime types like 'image/*'
        const category = type.split('/')[0];
        return file.type.startsWith(`${category}/`);
      }
      return file.type === type;
    });
    
    if (!isAllowedType) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${bucketConfig.allowedMimeTypes.join(', ')}`
      };
    }
  }
  
  return { valid: true };
};

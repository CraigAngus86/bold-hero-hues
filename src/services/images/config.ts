
import { ImageOptimizationOptions } from './types';

/**
 * Default image optimization options
 */
export const defaultOptimizationOptions: ImageOptimizationOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8,
  format: 'webp'
};

/**
 * Predefined optimization settings for different types of images
 */
export const imageUploadConfigs = {
  default: {
    maxSizeMB: 5,
    acceptedTypes: 'image/png,image/jpeg,image/webp',
    optimizationOptions: defaultOptimizationOptions
  },
  highQuality: {
    maxSizeMB: 10,
    acceptedTypes: 'image/png,image/jpeg',
    optimizationOptions: {
      maxWidth: 2400,
      maxHeight: 2400,
      quality: 0.9,
      format: 'webp'
    }
  },
  thumbnail: {
    maxSizeMB: 2,
    acceptedTypes: 'image/png,image/jpeg,image/webp',
    optimizationOptions: {
      maxWidth: 400,
      maxHeight: 400,
      quality: 0.7,
      format: 'webp'
    }
  },
  avatar: {
    maxSizeMB: 1,
    acceptedTypes: 'image/png,image/jpeg',
    optimizationOptions: {
      maxWidth: 256,
      maxHeight: 256,
      quality: 0.8,
      format: 'webp'
    }
  },
  banner: {
    maxSizeMB: 5,
    acceptedTypes: 'image/png,image/jpeg',
    optimizationOptions: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.8,
      format: 'webp'
    }
  },
  sponsor: {
    maxSizeMB: 3,
    acceptedTypes: 'image/png,image/jpeg,image/svg+xml',
    optimizationOptions: {
      maxWidth: 800,
      maxHeight: 600,
      quality: 0.9,
      format: 'webp'
    }
  }
};


import { z } from 'zod';

// Updated ImageUploadConfig interface with all required properties
export interface ImageUploadConfig {
  maxSizeMB: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  acceptedTypes?: string[];
  folder?: string;
  maxFileSize?: number; // For backward compatibility 
}

// Validation schemas for image options
export const imageUploadSchema = z.object({
  maxSizeMB: z.number().default(5),
  minWidth: z.number().optional(),
  minHeight: z.number().optional(),
  maxWidth: z.number().optional(),
  maxHeight: z.number().optional(),
  acceptedTypes: z.array(z.string()).optional(),
  folder: z.string().optional(),
  maxFileSize: z.number().optional()
});

export type ImageOptimizationOptions = {
  folder?: string;
  alt?: string;
  description?: string;
  tags?: string[];
};

// Pre-defined configs for different types of images
export const imageUploadConfigs: Record<string, ImageUploadConfig> = {
  profile: {
    maxSizeMB: 1,
    minWidth: 200,
    minHeight: 200,
    maxWidth: 800,
    maxHeight: 800,
    acceptedTypes: ['image/jpeg', 'image/png'],
    folder: 'profile_images',
    maxFileSize: 1 * 1024 * 1024 // 1MB
  },
  
  news: {
    maxSizeMB: 3,
    minWidth: 800,
    minHeight: 450,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    folder: 'news_images',
    maxFileSize: 3 * 1024 * 1024 // 3MB
  },
  
  sponsors: {
    maxSizeMB: 2,
    maxWidth: 1200,
    acceptedTypes: ['image/png', 'image/jpeg', 'image/svg+xml'],
    folder: 'sponsor_logos',
    maxFileSize: 2 * 1024 * 1024 // 2MB
  },
  
  team: {
    maxSizeMB: 2,
    folder: 'team_photos',
    maxFileSize: 2 * 1024 * 1024 // 2MB
  },
  
  general: {
    maxSizeMB: 5,
    folder: 'uploads',
    maxFileSize: 5 * 1024 * 1024 // 5MB
  }
};

export const imageStorageConfig = {
  bucketName: 'media'
};

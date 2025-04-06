
import { BucketType, ImageUploadConfig } from "./types";

export const imageUploadConfigs: Record<BucketType, ImageUploadConfig> = {
  news: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    dimensions: {
      minWidth: 800,
      minHeight: 450,
      maxWidth: 2000,
      maxHeight: 1500
    }
  },
  team: {
    maxFileSize: 3 * 1024 * 1024, // 3MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    dimensions: {
      minWidth: 300,
      minHeight: 300,
      maxWidth: 1000,
      maxHeight: 1000
    }
  },
  sponsors: {
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    dimensions: {
      maxWidth: 800,
      maxHeight: 800
    }
  },
  fixtures: {
    maxFileSize: 3 * 1024 * 1024, // 3MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  general: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  }
};


// Available bucket types
export type BucketType = 'news_images' | 'player_images' | 'sponsor_images' | 'general_images';

// Predefined upload configurations for different image types
export const imageUploadConfigs = {
  news: {
    bucket: 'news_images' as BucketType,
    maxSizeMB: 10,
    acceptedTypes: 'image/png,image/jpeg,image/webp',
    optimizationOptions: {
      maxWidth: 1200,
      maxHeight: 800,
      quality: 0.85,
      format: 'webp' as const
    }
  },
  player: {
    bucket: 'player_images' as BucketType,
    maxSizeMB: 5,
    acceptedTypes: 'image/png,image/jpeg,image/webp',
    optimizationOptions: {
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.85,
      format: 'webp' as const
    }
  },
  sponsor: {
    bucket: 'sponsor_images' as BucketType,
    maxSizeMB: 5,
    acceptedTypes: 'image/png,image/jpeg,image/svg+xml',
    optimizationOptions: {
      maxWidth: 600,
      maxHeight: 400,
      quality: 0.9,
      format: 'webp' as const
    }
  },
  general: {
    bucket: 'general_images' as BucketType,
    maxSizeMB: 10,
    acceptedTypes: 'image/png,image/jpeg,image/webp,image/svg+xml',
    optimizationOptions: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'webp' as const
    }
  }
};

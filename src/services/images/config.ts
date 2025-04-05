
import { BucketType } from './types';

export const imageUploadConfigs = {
  news: {
    bucket: 'news' as BucketType,
    maxSizeMB: 5,
    acceptedTypes: 'image/jpeg,image/png,image/webp',
    optimizationOptions: {
      maxWidth: 1200,
      maxHeight: 800,
      quality: 80,
      format: 'webp' as const
    }
  },
  newsBucket: 'news' as BucketType,
  player: {
    bucket: 'players' as BucketType,
    maxSizeMB: 3,
    acceptedTypes: 'image/jpeg,image/png,image/webp',
    optimizationOptions: {
      maxWidth: 500,
      maxHeight: 500,
      quality: 80,
      format: 'webp' as const
    }
  },
  sponsor: {
    bucket: 'sponsors' as BucketType,
    maxSizeMB: 2,
    acceptedTypes: 'image/jpeg,image/png,image/webp,image/svg+xml',
    optimizationOptions: {
      maxWidth: 300,
      maxHeight: 200,
      quality: 90,
      format: 'webp' as const
    }
  },
  general: {
    bucket: 'general' as BucketType,
    maxSizeMB: 10,
    acceptedTypes: 'image/jpeg,image/png,image/webp,image/svg+xml',
    optimizationOptions: {
      maxWidth: 1600,
      maxHeight: 1200,
      quality: 80,
      format: 'webp' as const
    }
  }
};

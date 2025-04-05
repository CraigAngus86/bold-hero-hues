
// This file is kept for backward compatibility, but all functionality has been moved to the images/ directory
import type { 
  BucketType,
  ImageMetadata,
  ImageOptimizationOptions,
  StoredImageMetadata 
} from './images/types';

export type { 
  BucketType,
  ImageMetadata,
  ImageOptimizationOptions,
  StoredImageMetadata 
};

import { 
  uploadImage,
  getImages,
  deleteImage,
  getPublicUrl,
  moveImage,
  createFolder,
  updateImageMetadata,
  getImageMetadata,
} from './images/api';

import {
  optimizeImage
} from './images/utils';

import {
  useImageUpload,
  imageUploadConfigs
} from './images';

// Re-export everything to maintain backwards compatibility
export {
  uploadImage,
  getImages,
  deleteImage,
  getPublicUrl,
  moveImage,
  createFolder,
  updateImageMetadata,
  getImageMetadata,
  optimizeImage,
  useImageUpload,
  imageUploadConfigs
};

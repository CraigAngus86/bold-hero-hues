
// This file is kept for backward compatibility, but all functionality has been moved to the images/ directory
import { 
  BucketType,
  ImageMetadata,
  ImageOptimizationOptions,
  StoredImageMetadata,
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
} from './images';

// Re-export everything to maintain backwards compatibility
export {
  BucketType,
  ImageMetadata,
  ImageOptimizationOptions,
  StoredImageMetadata,
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

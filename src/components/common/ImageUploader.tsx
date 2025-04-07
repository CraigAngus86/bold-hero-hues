
import { ImageUploader } from './image-uploader';
import { useImageUploaderContext, ImageUploaderProvider } from './image-uploader/ImageUploaderContext';
import { BucketType } from '@/types/system';

// Re-export everything for backward compatibility
export { ImageUploader, useImageUploaderContext, ImageUploaderProvider, BucketType };
export default ImageUploader;

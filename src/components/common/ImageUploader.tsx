
import React from 'react';
import { ImageUploader as ImageUploaderComponent } from '@/components/admin/common/image-uploader';
import { 
  useImageUploaderContext, 
  ImageUploaderProvider 
} from '@/components/admin/common/image-uploader/ImageUploaderContext';
import { BucketType } from '@/types/system/images';

// Re-export everything for backward compatibility
export { 
  ImageUploaderComponent as ImageUploader, 
  useImageUploaderContext, 
  ImageUploaderProvider, 
  BucketType 
};
export default ImageUploaderComponent;

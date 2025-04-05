
import { BucketType, ImageOptimizationOptions } from '@/services/images';

export interface ImageUploaderProps {
  type?: 'news' | 'player' | 'sponsor' | 'general';
  initialImageUrl?: string | null;
  folderPath?: string;
  onUploadComplete?: (imageUrl: string) => void;
  className?: string;
  title?: string;
  allowMetadata?: boolean;
  alt?: string;
  description?: string;
  tags?: string[];
  aspectRatio?: 'auto' | 'square' | 'video' | '16:9' | '4:3' | '3:2' | '1:1';
  customSize?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  };
}

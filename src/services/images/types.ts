
// Define BucketType with all required bucket types
export type BucketType = 'news' | 'players' | 'sponsors' | 'general' | 'news_images' | 'player_images';

// Image metadata interface
export interface ImageMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  bucketType?: BucketType;
  url: string;
  alt_text?: string;
  description?: string;
  tags?: string[];
  categories?: string[];
  dimensions?: {
    width: number;
    height: number;
  };
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt?: string;
  bucket?: string;
  path?: string;
}

// Image optimization options
export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  preserveAspectRatio?: boolean;
}

// Define interface for the metadata stored in the database
export interface StoredImageMetadata {
  id?: string;
  bucket_id: string;
  storage_path: string;
  file_name: string;
  alt_text?: string;
  description?: string;
  tags?: string[];
  dimensions?: {
    width: number;
    height: number;
  };
  categories?: string[];
}


export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageMetadata {
  id: string;
  name: string;
  file_name: string;
  url: string;
  storage_path: string;
  bucket_id: string;
  type: string;
  size: number;
  dimensions: ImageDimensions;
  alt_text?: string;
  description?: string;
  tags?: string[];
  categories?: string[];
  created_at: string;
  updated_at: string;
  createdAt?: string;
  updatedAt?: string;
  created_by?: string;
  width?: number;
  height?: number;
}

export interface StoredImageMetadata extends ImageMetadata {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface UploadResult {
  success: boolean;
  data?: {
    publicUrl: string;
    metadata: StoredImageMetadata;
    url?: string;
  };
  error?: string;
}

export type BucketType = 'news' | 'team' | 'sponsors' | 'fixtures' | 'general';

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'original';
  folder?: string;
}

export interface ImageUploadConfig {
  maxSizeMB: number;
  allowedTypes: string[];
  dimensions?: {
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  };
}

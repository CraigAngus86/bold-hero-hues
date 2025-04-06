
export interface ImageDimensions {
  width: number;
  height: number;
}

export interface StoredImageMetadata {
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
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface UploadResult {
  publicUrl: string;
  metadata: StoredImageMetadata;
}

export type BucketType = 'news' | 'team' | 'sponsors' | 'fixtures' | 'general';

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'original';
}

export interface ImageUploadConfig {
  maxFileSize: number;
  allowedTypes: string[];
  dimensions?: {
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  };
}

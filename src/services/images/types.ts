
/**
 * Image optimization options
 */
export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: string;
}

/**
 * Available bucket types
 */
export type BucketType = 'images' | 'news' | 'teams' | 'sponsors' | 'media' | 'news_images' | 'player_images' | 'sponsor_logos';

/**
 * Stored image metadata
 */
export interface StoredImageMetadata {
  id: string;
  file_name: string;
  storage_path: string;
  bucket_id: string;
  alt_text?: string;
  description?: string;
  file_size?: number;
  content_type?: string;
  dimensions?: ImageDimensions;
  tags?: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
}

/**
 * Image dimensions
 */
export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Upload result
 */
export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  id?: string;
  data?: StoredImageMetadata;
  error?: any;
}

export type ImageMetadata = StoredImageMetadata;

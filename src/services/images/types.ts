
import { Json } from '@supabase/supabase-js';

export type BucketType = 'avatars' | 'posts' | 'products' | 'general' | 'media' | 'images' | 'sponsors';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface UseImageUploadOptions {
  bucket?: BucketType;
  folderPath?: string;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

export interface ImageUploadConfig {
  bucketName: string;
  allowedTypes: string;
  maxSizeMB: number;
  bucket: BucketType;
  optimizationOptions?: ImageOptimizationOptions;
}

export interface StoredImageMetadata {
  id: string;
  bucket_id: string;
  storage_path: string;
  name: string;
  file_name: string;
  type: string;
  size: number;
  url: string;
  alt_text?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  dimensions?: ImageDimensions;
  categories?: string[];
  tags?: string[];
}

export interface ImageMetadata {
  id: string;
  file_name: string;
  bucket_id: string;
  storage_path: string;
  url: string;
  alt_text?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  dimensions?: ImageDimensions;
  categories?: string[];
  tags?: string[];
}

export interface ImageFolder {
  id: string;
  name: string;
  path: string;
  parentId?: string;
}

export interface ImageUploadResult {
  success: boolean;
  error?: string;
  url?: string;
  metadata?: StoredImageMetadata;
  data?: {
    url: string;
  };
}

export interface UseImageUploadResult {
  uploading: boolean;
  isUploading: boolean; 
  progress: number;
  uploadProgress: number;
  error: Error | null;
  upload: (file: File, metadata?: Partial<StoredImageMetadata>) => Promise<ImageUploadResult>;
  uploadFile: (file: File, metadata?: Partial<StoredImageMetadata>) => Promise<ImageUploadResult>;
  cancelUpload: () => void;
  resetState: () => void;
}

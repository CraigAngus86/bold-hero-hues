
import type { StorageError } from '@supabase/storage-js';

export interface ImageDimensions {
  width?: number;
  height?: number;
}

export interface StoredImageMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  alt_text?: string;
  bucket_id?: string;
  created_at?: string;
  created_by?: string;
  description?: string;
  dimensions?: ImageDimensions;
  file_name?: string;
  storage_path?: string;
  tags?: string[];
  updated_at?: string;
  categories?: string[];
  folder?: string;
}

export interface ImageMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  alt_text?: string;
  description?: string;
  tags?: string[];
  bucket?: string;
  path?: string;
  createdAt: string;
  updatedAt?: string;
  width?: number;
  height?: number;
  categories?: string[];
  folder?: string;
}

export interface ImageFolder {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
}

export interface UploadOptions {
  folder?: string;
  altText?: string;
  description?: string;
  tags?: string[];
}

export interface ImageUploadResult {
  success: boolean;
  data?: StoredImageMetadata;
  error?: StorageError | Error;
  url?: string;
}

export enum BucketType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  TEAM = 'team',
  NEWS = 'news'
}

export interface ImageOptimizationOptions {
  resize?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  };
  compress?: {
    quality?: number;
    lossless?: boolean;
  };
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  transformations?: string[];
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface ImageUploadConfig {
  bucket?: BucketType;
  folder?: string;
  optimization?: ImageOptimizationOptions;
}

export interface UseImageUploadOptions {
  bucket?: BucketType;
  folder?: string;
  folderPath?: string;
  optimization?: ImageOptimizationOptions;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
  onUploadStart?: () => void;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: (result: ImageUploadResult) => void;
}

export interface UseImageUploadResult {
  uploadFile: (file: File, options?: UploadOptions) => Promise<ImageUploadResult>;
  uploadFiles: (files: File[], options?: UploadOptions) => Promise<ImageUploadResult[]>;
  isUploading: boolean;
  uploading?: boolean; // Alias for backward compatibility
  progress: number;
  uploadProgress?: number; // Alias for backward compatibility 
  error: Error | null;
  upload?: (file: File, options?: any) => Promise<ImageUploadResult>;
}

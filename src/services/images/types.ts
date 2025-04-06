
import type { StorageError } from '@supabase/storage-js';
// Define JSON type since it's not exported from supabase
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

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
  folder?: string; // Add folder property to fix errors
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
  folder?: string; // Add folder property
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

export interface UploadResult {
  success: boolean;
  data?: StoredImageMetadata;
  error?: StorageError | Error;
  url?: string;
}

// Add these missing types
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
}

// Export previously missing types
export interface ImageUploadConfig {
  bucket?: BucketType;
  folder?: string;
  optimization?: ImageOptimizationOptions;
}

export interface UseImageUploadOptions {
  bucket?: BucketType;
  folder?: string;
  optimization?: ImageOptimizationOptions;
  onUploadStart?: () => void;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: (result: UploadResult) => void;
  onUploadError?: (error: Error) => void;
}

export interface UseImageUploadResult {
  uploadFile: (file: File, options?: UploadOptions) => Promise<UploadResult>;
  uploadFiles: (files: File[], options?: UploadOptions) => Promise<UploadResult[]>;
  isUploading: boolean;
  progress: number;
  error: Error | null;
}

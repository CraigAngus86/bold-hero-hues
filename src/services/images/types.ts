
// Image service types
export type BucketType = "avatars" | "posts" | "products" | "general" | "media" | "images";

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  resize?: boolean;
  alt?: string;
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
  alt_text?: string;
  description?: string;
  tags?: string[];
  dimensions?: ImageDimensions;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface ImageUploadConfig {
  bucketName: string;
  folderPath?: string;
  allowedTypes: string;
  maxSizeMB: number;
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  metadata?: StoredImageMetadata;
}

// Image upload hooks
export interface UseImageUploadOptions {
  bucket: BucketType;
  folderPath?: string;
  onSuccess?: (url: string, metadata?: StoredImageMetadata) => void;
  onError?: (error: Error) => void;
  optimization?: ImageOptimizationOptions;
}

export interface UseImageUploadResult {
  uploading: boolean;
  progress: number;
  error: Error | null;
  uploadFile: (file: File, metadata?: Partial<StoredImageMetadata>) => Promise<ImageUploadResult>;
  cancelUpload: () => void;
  resetState: () => void;
}

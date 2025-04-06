
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

// Alias for StoredImageMetadata to be used in components that expect ImageMetadata
export type ImageMetadata = StoredImageMetadata;

export interface ImageUploadConfig {
  bucketName: string;
  folderPath?: string;
  allowedTypes: string;
  maxSizeMB: number;
  bucket: BucketType;
  optimizationOptions?: ImageOptimizationOptions;
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  metadata?: StoredImageMetadata;
  data?: {
    url: string;
    [key: string]: any;
  };
}

export type UploadResult = ImageUploadResult;

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
  isUploading: boolean;
  progress: number;
  uploadProgress: number;
  error: Error | null;
  uploadFile: (file: File, metadata?: Partial<StoredImageMetadata>) => Promise<ImageUploadResult>;
  upload: (file: File, metadata?: Partial<StoredImageMetadata>) => Promise<ImageUploadResult>;
  cancelUpload: () => void;
  resetState: () => void;
}

export interface ImageFolder {
  id: string;
  name: string;
  path: string;
  parentId?: string;
  created_at?: string;
  updated_at?: string;
}

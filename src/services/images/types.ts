
export interface ImageMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  createdAt: string;
  updatedAt?: string;
  description?: string;
  altText?: string;
  tags?: string[];
  folderId?: string;
  width?: number;
  height?: number;
}

export interface StoredImageMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  bucket_id?: string;
  storage_path?: string;
  file_name?: string;
  alt_text?: string;
  description?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  dimensions?: any;
}

export type BucketType = "images" | "products" | "avatars" | "players";

export interface ImageFolder {
  id: string;
  name: string;
  path: string;
  parentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ImageFolderResponse {
  success: boolean;
  data?: ImageFolder[];
  error?: string;
}

export interface ImageMetadataResponse {
  success: boolean;
  data?: ImageMetadata[];
  count?: number;
  error?: string;
}

export interface ImageUploadResult {
  success: boolean;
  data?: {
    url: string;
    metadata?: StoredImageMetadata;
  };
  error?: string;
}

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  blur?: boolean;
  grayscale?: boolean;
}

export interface UseImageUploadOptions {
  bucket: BucketType;
  folder?: string;
  maxSize?: number;
  acceptedTypes?: string[];
  optimizationOptions?: ImageOptimizationOptions;
  folderPath?: string;
  onSuccess?: (result: ImageUploadResult) => void;
  onError?: (error: string) => void;
}

export interface UseImageUploadResult {
  uploadFile: (file: File) => Promise<ImageUploadResult>;
  isUploading: boolean;
  progress: number;
  error: Error | null;
  reset: () => void;
  cancelUpload?: () => void;
}

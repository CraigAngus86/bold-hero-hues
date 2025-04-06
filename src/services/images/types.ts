
// Define image metadata type
export interface ImageMetadata {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  width: number;
  height: number;
  altText: string; // Changed from alt_text to follow camelCase conventions
  description?: string;
  createdAt: string; // Changed from created_at to follow camelCase conventions
  updatedAt: string; // Changed from updated_at to follow camelCase conventions
  tags?: string[];
  bucket: string;
  path: string;
  categories?: string[]; // Added for compatibility with components
}

// Storage specific image metadata (from database)
export interface StoredImageMetadata {
  id: string;
  bucket_id: string;
  storage_path: string;
  file_name: string;
  alt_text?: string;
  description?: string;
  dimensions?: any; // Previously Json
  tags?: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
  name?: string;
  type?: string;
  size?: number;
  url?: string;
}

// Define image dimensions type
export interface ImageDimensions {
  width: number;
  height: number;
}

// Define bucket types
export type BucketType = 'images' | 'videos' | 'documents' | 'avatars' | 'posts' | 'products' | 'general' | 'media' | 'sponsors' | 'players';

// Image optimization options
export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

// Define image upload config
export interface ImageUploadConfig {
  bucketName: string;
  allowedTypes: string;
  maxSizeMB: number;
  bucket: BucketType;
  optimizationOptions: ImageOptimizationOptions;
}

// Define image upload result
export interface ImageUploadResult {
  success: boolean;
  error?: string;
  metadata?: ImageMetadata;
  data?: {
    url: string;
    [key: string]: any;
  };
  url?: string; // Added url property needed by components
}

// Define image upload options
export interface UseImageUploadOptions {
  bucket: BucketType;
  folderPath?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  autoUpload?: boolean;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

// Define image upload result
export interface UseImageUploadResult {
  selectedFile: File | null;
  preview: string | null;
  isUploading: boolean;
  uploading?: boolean; // Alias for backward compatibility
  error: Error | null;
  progress: number;
  uploadProgress?: number; // Alias for backward compatibility
  selectFile: (file: File) => void;
  uploadFile: (file: File) => Promise<ImageUploadResult>;
  upload: (file: File) => Promise<string>; // Added for compatibility
  resetUpload: () => void;
  cancelUpload?: () => void;
  resetState?: () => void;
}

// Define image folder type
export interface ImageFolder {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
}

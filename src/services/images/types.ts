
// Define image metadata type
export interface ImageMetadata {
  id: string;
  url: string;
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
  
  // Aliases for frontend component compatibility
  name?: string;
  type?: string;
  size?: number;
  width?: number;
  height?: number;
  altText?: string;
  createdAt?: string;
  updatedAt?: string;
  path?: string;
  bucket?: string;
  categories?: string[];
}

// Storage specific image metadata (from database)
export interface StoredImageMetadata {
  id: string;
  bucket_id: string;
  storage_path: string;
  file_name: string;
  alt_text?: string;
  description?: string;
  dimensions?: ImageDimensions;
  tags?: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
  url: string; // Changed from optional to required
  
  // Optional frontend properties
  name?: string;
  type?: string;
  size?: number;
}

// Define image dimensions type
export interface ImageDimensions {
  width: number;
  height: number;
}

// Define bucket types
export enum BucketType {
  IMAGES = 'images',
  VIDEOS = 'videos',
  DOCUMENTS = 'documents',
  AVATARS = 'avatars',
  POSTS = 'posts',
  PRODUCTS = 'products',
  GENERAL = 'general',
  MEDIA = 'media',
  SPONSORS = 'sponsors',
  PLAYERS = 'players',
  PUBLIC = 'public',
  TEAMS = 'teams' // Added TEAMS bucket
}

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
  bucket?: BucketType;
  folderPath?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  autoUpload?: boolean;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

// Define image upload result
export interface UseImageUploadResult {
  selectedFile?: File | null;
  setSelectedFile?: (file: File | null) => void;
  preview?: string | null;
  previewUrl?: string | null;
  isUploading: boolean;
  uploading?: boolean; // Alias for backward compatibility
  error: Error | null;
  progress: number;
  uploadProgress?: number; // Alias for backward compatibility
  selectFile?: (file: File) => void;
  uploadFile: (file: File, options?: any) => Promise<ImageUploadResult>;
  upload: (file: File) => Promise<string>; // Simple interface for compatibility
  resetUpload?: () => void;
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

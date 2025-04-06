
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
}

// Define image dimensions type
export interface ImageDimensions {
  width: number;
  height: number;
}

// Define bucket types
export type BucketType = 'images' | 'videos' | 'documents';

// Define image upload result
export interface ImageUploadResult {
  success: boolean;
  url?: string; // Added url property needed by components
  error?: string;
  metadata?: ImageMetadata;
}

// Define image upload options
export interface UseImageUploadOptions {
  bucket: BucketType;
  path?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  autoUpload?: boolean;
}

// Define image upload result
export interface UseImageUploadResult {
  selectedFile: File | null;
  preview: string | null;
  isUploading: boolean;
  error: string | null;
  progress: number;
  selectFile: (file: File) => void;
  uploadFile: (file: File) => Promise<ImageUploadResult>;
  resetUpload: () => void;
  upload: (file: File) => Promise<string>; // Added for compatibility
}

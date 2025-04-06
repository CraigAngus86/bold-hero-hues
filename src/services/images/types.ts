
export type BucketType = 'public' | 'private' | 'images' | 'avatars' | 'media';

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  convertToFormat?: 'webp' | 'jpeg' | 'png' | null;
  generateThumbnail?: boolean;
  thumbnailSize?: number;
  compressionLevel?: number;
  metadata?: Record<string, any>;
}

export interface ImageMetadata {
  id: string;
  name: string;
  url: string;
  alt_text?: string;
  description?: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  categories?: string[];
  bucket: string; 
  path: string;
}

export interface StoredImageMetadata {
  id: string;
  bucket_id: string;
  storage_path: string;
  file_name: string;
  file_size: number;
  content_type: string;
  alt_text?: string;
  description?: string;
  tags?: string[];
  categories?: string[];
  dimensions?: { width: number; height: number };
  created_at: string;
  updated_at: string;
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  metadata?: StoredImageMetadata;
}

export interface ImageSearchParams {
  search?: string;
  bucket?: string;
  tags?: string[];
  categories?: string[];
  startDate?: string;
  endDate?: string;
  sortBy?: 'name' | 'size' | 'created_at' | 'updated_at';
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  type?: 'image' | 'video' | 'document';
}

export interface MediaGalleryFilters {
  search: string;
  categories: string[];
  tags: string[];
  dateRange: [Date | null, Date | null];
  fileTypes: string[];
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}


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
  TEAMS = 'teams',
  NEWS = 'news',
  PROFILES = 'profiles'
}

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface ImageMetadata {
  id: string;
  file_name: string;
  storage_path: string;
  bucket_id: string;
  alt_text?: string;
  description?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  tags?: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface StoredImageMetadata extends Omit<ImageMetadata, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  metadata?: ImageMetadata;
  error?: string;
}


// Image metadata type definitions
export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio?: number;
}

export interface ImageMetadata {
  id: string;
  file_name: string;
  storage_path: string;
  bucket_id: string;
  url: string;
  alt_text?: string;
  description?: string;
  tags?: string[];
  dimensions?: ImageDimensions;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface ImageFolder {
  id: string;
  name: string;
  path: string;
  parent_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ImageUploadOptions {
  folder?: string;
  metadata?: Partial<ImageMetadata>;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  metadata?: ImageMetadata;
  error?: string;
}

export enum BucketType {
  IMAGES = 'images',
  PROFILES = 'profiles',
  TEAMS = 'teams',
  NEWS = 'news',
  SPONSORS = 'sponsors',
  DOCUMENTS = 'documents'
}

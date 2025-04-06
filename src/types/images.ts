
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
  
  // Aliases for frontend component compatibility
  name?: string;
  type?: string;
  size?: number;
  width?: number;
  height?: number;
}

export interface ImageFolder {
  id: string;
  name: string;
  path: string;
  parent_id?: string | null;
  created_at?: string;
  updated_at?: string;
  
  // Alias for frontend component compatibility
  parentId?: string | null;
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
  DOCUMENTS = 'documents',
  AVATARS = 'avatars',
  VIDEOS = 'videos',
  PRODUCTS = 'products',
  GENERAL = 'general',
  MEDIA = 'media',
  PLAYERS = 'players',
  PUBLIC = 'public'
}

// Convert DB image metadata to frontend ImageMetadata
export function adaptDbImageMetadata(dbImage: any): ImageMetadata {
  // Parse dimensions if it's a JSON string
  let dimensions: ImageDimensions | undefined;
  if (dbImage.dimensions) {
    try {
      dimensions = typeof dbImage.dimensions === 'string' 
        ? JSON.parse(dbImage.dimensions) 
        : dbImage.dimensions;
    } catch (e) {
      console.error('Failed to parse image dimensions:', e);
    }
  }
  
  return {
    id: dbImage.id,
    file_name: dbImage.file_name,
    storage_path: dbImage.storage_path,
    bucket_id: dbImage.bucket_id,
    url: dbImage.url || '',
    alt_text: dbImage.alt_text || '',
    description: dbImage.description || '',
    tags: dbImage.tags || [],
    dimensions: dimensions,
    created_at: dbImage.created_at,
    updated_at: dbImage.updated_at,
    created_by: dbImage.created_by,
    
    // Add aliases for component compatibility
    name: dbImage.file_name,
    type: dbImage.content_type || '',
    size: dbImage.file_size || 0
  };
}

// Convert ImageFolder from DB format to frontend format
export function adaptDbImageFolder(dbFolder: any): ImageFolder {
  return {
    id: dbFolder.id,
    name: dbFolder.name,
    path: dbFolder.path,
    parent_id: dbFolder.parent_id,
    created_at: dbFolder.created_at,
    updated_at: dbFolder.updated_at,
    
    // Add alias for component compatibility
    parentId: dbFolder.parent_id
  };
}

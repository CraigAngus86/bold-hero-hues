
export interface ImageFolder {
  id: string;
  name: string;
  path: string;
  parentId?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ImageMetadata {
  id: string;
  file_name: string;
  storage_path: string;
  bucket_id: string;
  url: string;
  alt_text?: string;
  description?: string;
  file_size?: number;
  content_type?: string;
  dimensions?: ImageDimensions;
  tags?: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface MediaGallery {
  id: string;
  title: string;
  description?: string;
  cover_image?: string;
  image_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface MediaTag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

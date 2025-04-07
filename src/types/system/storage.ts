
export type BucketType = 'team' | 'news' | 'events' | 'sponsors' | 'general' | 'uploads' | 'products';

export interface StorageFile {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export interface ImageMetadata {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  width: number;
  height: number;
  alt_text?: string;
  description?: string;
  tags?: string[];
  uploadedBy?: string;
  uploadedAt: string;
}

export interface StoredImageMetadata extends ImageMetadata {
  bucket: BucketType;
  path: string;
  url: string;
}

export interface ImageUploadResult {
  url: string;
  metadata: StoredImageMetadata;
}

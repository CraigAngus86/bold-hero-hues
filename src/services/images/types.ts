
export interface ImageDimensions {
  width: number;
  height: number;
}

export interface StoredImageMetadata {
  id: string;
  file_name: string;
  storage_path: string;
  bucket_id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  description: string | null;
  alt_text: string | null;
  tags: string[] | null;
  dimensions: ImageDimensions | null;
  // Added properties to fix type errors
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  categories?: string[];
  width?: number;
  height?: number;
}

export type ImageType = 'profile' | 'gallery' | 'news' | 'sponsor' | 'team' | 'other';

export interface ImageMetadata {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  alt_text?: string;
  description?: string;
  tags?: string[];
  dimensions?: ImageDimensions;
  createdAt: string;
  updatedAt?: string;
  created_by?: string;
  categories?: string[];
  width?: number;
  height?: number;
}

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  folder?: string;
}

export interface UploadResult {
  success: boolean;
  data?: {
    publicUrl: string;
    metadata: StoredImageMetadata;
  };
  error?: string;
}

export interface ImageFolder {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  parent_id?: string | null; // For database compatibility
}

export interface ImageManagerContextType {
  folders: ImageFolder[];
  currentFolder: ImageFolder | null;
  subfolders: ImageFolder[];
  images: any[];
  breadcrumbs: ImageFolder[];
  isUploading: boolean;
  selectedImages: Set<string>;
  focusedImage: ImageMetadata | null;
  navigateToFolder: (folder: ImageFolder) => void;
  navigateUp: () => void;
  navigateToBreadcrumb: (folder: ImageFolder | null) => void;
  uploadFiles: (files: FileList) => Promise<void>;
  selectImage: (imageId: string) => void;
  deselectImage: (imageId: string) => void;
  toggleImageSelection: (imageId: string) => void;
  clearSelection: () => void;
  deleteSelectedImages: () => Promise<void>;
  refreshCurrentFolder: () => Promise<void>;
  viewImage: (imageUrl: string) => void;
}

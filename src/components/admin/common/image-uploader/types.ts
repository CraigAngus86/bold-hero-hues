
import { BucketType, ImageOptimizationOptions } from '@/services/images';

export interface ImageUploaderProps {
  type?: 'news' | 'player' | 'sponsor' | 'general';
  initialImageUrl?: string | null;
  folderPath?: string;
  onUploadComplete?: (imageUrl: string) => void;
  className?: string;
  title?: string;
  allowMetadata?: boolean;
  alt?: string;
  description?: string;
  tags?: string[];
  aspectRatio?: 'auto' | 'square' | 'video' | '16:9' | '4:3' | '3:2' | '1:1';
  customSize?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  };
}

export interface DropZoneProps {
  acceptedTypes: string;
  maxSizeMB: number;
  onFileSelected: (file: File) => void;
  dragActive: boolean;
  setDragActive: (active: boolean) => void;
  inputId: string;
}

export interface ImagePreviewProps {
  previewUrl: string;
  aspectRatioClass: string;
  altText: string;
  onClear: () => void;
  allowMetadata: boolean;
  imageDescription: string;
  setAltText: (text: string) => void;
  setImageDescription: (desc: string) => void;
  imageTags: string[];
  setImageTags: (tags: string[]) => void;
  tagInput: string;
  setTagInput: (input: string) => void;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
  handleTagKeyDown: (e: React.KeyboardEvent) => void;
  isUploading: boolean;
  progress: number;
  onUpload: () => void;
}

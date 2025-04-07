
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { BucketType } from '@/types/system/images';

interface ImageUploaderContextType {
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  altText: string;
  setAltText: (text: string) => void;
  imageDescription: string;
  setImageDescription: (desc: string) => void;
  imageTags: string[];
  setImageTags: (tags: string[]) => void;
  tagInput: string;
  setTagInput: (input: string) => void;
  dragActive: boolean;
  setDragActive: (active: boolean) => void;
  isUploading: boolean;
  progress: number;
  acceptedTypes: string;
  handleFileSelection: (file: File) => void;
  clearSelection: () => void;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
  handleTagKeyDown: (e: React.KeyboardEvent) => void;
  handleUpload: () => Promise<void>;
}

interface ImageUploaderProviderProps {
  children: ReactNode;
  initialImageUrl: string | null;
  acceptedTypes: string;
  maxSizeMB: number;
  onUploadComplete?: (imageUrl: string) => void;
  bucket: BucketType;
  folderPath?: string;
  optimizationOptions?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  };
  initialAlt?: string;
  initialDescription?: string;
  initialTags?: string[];
}

export const ImageUploaderContext = createContext<ImageUploaderContextType | undefined>(undefined);

export const ImageUploaderProvider: React.FC<ImageUploaderProviderProps> = ({
  children,
  initialImageUrl,
  acceptedTypes,
  maxSizeMB,
  onUploadComplete,
  bucket,
  folderPath,
  optimizationOptions,
  initialAlt = '',
  initialDescription = '',
  initialTags = [],
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState(initialAlt);
  const [imageDescription, setImageDescription] = useState(initialDescription);
  const [imageTags, setImageTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  const handleFileSelection = (file: File) => {
    if (!file) return;
    
    // Validate file type
    if (!acceptedTypes.split(',').includes(file.type)) {
      toast.error(`File type not allowed. Accepted: ${acceptedTypes}`);
      return;
    }
    
    // Validate file size
    if (file.size > maxSizeBytes) {
      toast.error(`File too large. Maximum: ${maxSizeMB}MB`);
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };
  
  const clearSelection = () => {
    if (previewUrl && previewUrl !== initialImageUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setSelectedFile(null);
    setPreviewUrl(initialImageUrl);
    setAltText(initialAlt);
    setImageDescription(initialDescription);
    setImageTags(initialTags);
  };
  
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    if (!imageTags.includes(tagInput.trim())) {
      setImageTags([...imageTags, tagInput.trim()]);
    }
    
    setTagInput('');
  };
  
  const handleRemoveTag = (tag: string) => {
    setImageTags(imageTags.filter(t => t !== tag));
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('No file selected');
      return;
    }
    
    setIsUploading(true);
    setProgress(0);
    
    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + 10;
          if (next >= 100) {
            clearInterval(interval);
            return 100;
          }
          return next;
        });
      }, 300);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(interval);
      setProgress(100);
      
      // Mock successful upload
      const uploadedUrl = URL.createObjectURL(selectedFile);
      
      if (onUploadComplete) {
        onUploadComplete(uploadedUrl);
      }
      
      toast.success('Image uploaded successfully');
      
      // Clear selection after successful upload
      setSelectedFile(null);
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setIsUploading(false);
    }
  };
  
  const value: ImageUploaderContextType = {
    previewUrl,
    setPreviewUrl,
    selectedFile,
    setSelectedFile,
    altText,
    setAltText,
    imageDescription,
    setImageDescription,
    imageTags,
    setImageTags,
    tagInput,
    setTagInput,
    dragActive,
    setDragActive,
    isUploading,
    progress,
    acceptedTypes,
    handleFileSelection,
    clearSelection,
    handleAddTag,
    handleRemoveTag,
    handleTagKeyDown,
    handleUpload
  };
  
  return (
    <ImageUploaderContext.Provider value={value}>
      {children}
    </ImageUploaderContext.Provider>
  );
};

export const useImageUploaderContext = () => {
  const context = useContext(ImageUploaderContext);
  if (context === undefined) {
    throw new Error('useImageUploaderContext must be used within an ImageUploaderProvider');
  }
  return context;
};

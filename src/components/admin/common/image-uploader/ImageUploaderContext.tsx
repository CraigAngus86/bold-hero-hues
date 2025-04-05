
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { useImageUpload } from '@/services/images';
import { ImageOptimizationOptions } from '@/services/images/types';

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
  bucket: string;
  folderPath?: string;
  optimizationOptions: ImageOptimizationOptions;
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
  
  const { upload, isUploading, progress } = useImageUpload();
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  const handleFileSelection = (file: File) => {
    if (file.size > maxSizeBytes) {
      toast.error(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }
    
    if (!file.type.match(acceptedTypes.replace(/,/g, '|'))) {
      toast.error(`Invalid file type. Please upload a supported image format.`);
      return;
    }
    
    setSelectedFile(file);
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    
    if (!altText) {
      const fileName = file.name.split('.')[0];
      setAltText(fileName.replace(/-|_/g, ' '));
    }
  };
  
  const clearSelection = () => {
    if (previewUrl && previewUrl !== initialImageUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(initialImageUrl);
    setSelectedFile(null);
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !imageTags.includes(tagInput.trim())) {
      setImageTags([...imageTags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setImageTags(imageTags.filter(tag => tag !== tagToRemove));
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      const metadata = {
        alt_text: altText || selectedFile.name.split('.')[0],
        description: imageDescription,
        tags: imageTags
      };
      
      const result = await upload(
        selectedFile, 
        bucket, 
        folderPath,
        true, 
        metadata, 
        optimizationOptions
      );
      
      if (result.success && result.data) {
        toast.success('Image uploaded successfully');
        clearSelection();
        if (onUploadComplete) onUploadComplete(result.data.url);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image');
    }
  };
  
  const value = {
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
    handleFileSelection,
    clearSelection,
    handleAddTag,
    handleRemoveTag,
    handleTagKeyDown,
    handleUpload,
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

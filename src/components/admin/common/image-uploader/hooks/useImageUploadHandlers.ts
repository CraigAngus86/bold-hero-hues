
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useImageUpload } from '@/services/images';
import { BucketType, ImageOptimizationOptions } from '@/services/images/types';

interface UseImageUploadHandlersProps {
  selectedFile: File | null;
  previewUrl: string | null;
  initialImageUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  setSelectedFile: (file: File | null) => void;
  altText: string;
  setAltText: (text: string) => void;
  imageTags: string[];
  setImageTags: (tags: string[]) => void;
  tagInput: string;
  setTagInput: (input: string) => void;
  imageDescription: string;
  setDragActive: (active: boolean) => void;
  maxSizeBytes: number;
  acceptedTypes: string;
  bucket: BucketType;
  folderPath?: string;
  optimizationOptions: ImageOptimizationOptions;
  onUploadComplete?: (imageUrl: string) => void;
}

export const useImageUploadHandlers = ({
  selectedFile,
  previewUrl,
  initialImageUrl,
  setPreviewUrl,
  setSelectedFile,
  altText,
  setAltText,
  imageTags,
  setImageTags,
  tagInput,
  setTagInput,
  imageDescription,
  setDragActive,
  maxSizeBytes,
  acceptedTypes,
  bucket,
  folderPath,
  optimizationOptions,
  onUploadComplete
}: UseImageUploadHandlersProps) => {
  const { upload, isUploading, progress } = useImageUpload();
  
  const handleFileSelection = useCallback((file: File) => {
    if (file.size > maxSizeBytes) {
      toast.error(`File too large. Maximum size is ${maxSizeBytes / (1024 * 1024)}MB.`);
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
  }, [maxSizeBytes, acceptedTypes, setSelectedFile, setPreviewUrl, altText, setAltText]);
  
  const clearSelection = useCallback(() => {
    if (previewUrl && previewUrl !== initialImageUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(initialImageUrl);
    setSelectedFile(null);
  }, [previewUrl, initialImageUrl, setPreviewUrl, setSelectedFile]);
  
  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !imageTags.includes(tagInput.trim())) {
      setImageTags([...imageTags, tagInput.trim()]);
      setTagInput('');
    }
  }, [tagInput, imageTags, setImageTags, setTagInput]);
  
  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setImageTags(imageTags.filter(tag => tag !== tagToRemove));
  }, [imageTags, setImageTags]);
  
  const handleTagKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  }, [handleAddTag]);
  
  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, [setDragActive]);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, [setDragActive, handleFileSelection]);
  
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
  
  return {
    isUploading,
    progress,
    handleFileSelection,
    clearSelection,
    handleAddTag,
    handleRemoveTag,
    handleTagKeyDown,
    handleDrag,
    handleDrop,
    handleUpload,
  };
};

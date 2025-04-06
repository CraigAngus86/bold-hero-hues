
import { useState } from 'react';
import { toast } from 'sonner';
import { useImageUpload } from '@/services/images';

interface UseImageUploadHandlersProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  altText: string;
  imageDescription: string;
  imageTags: string[];
  tagInput: string;
  setTagInput: (input: string) => void;
  setDragActive: (active: boolean) => void;
  clearSelection: () => void;
  acceptedTypes: string;
  maxSizeBytes: number;
  bucket: string;
  folderPath?: string;
  optimizationOptions: any;
  onUploadComplete?: (imageUrl: string) => void;
}

export function useImageUploadHandlers({
  selectedFile,
  setSelectedFile,
  previewUrl,
  setPreviewUrl,
  altText,
  imageDescription,
  imageTags,
  tagInput,
  setTagInput,
  setDragActive,
  clearSelection,
  acceptedTypes,
  maxSizeBytes,
  bucket,
  folderPath,
  optimizationOptions,
  onUploadComplete
}: UseImageUploadHandlersProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { uploadFile } = useImageUpload();

  // Handle file selection
  const handleFileSelection = (file: File) => {
    if (!file) return;

    // Validate file type
    const fileType = file.type.split('/')[1];
    if (!acceptedTypes.includes(fileType)) {
      toast.error(`File type not supported. Please upload: ${acceptedTypes}`);
      return;
    }

    // Validate file size
    if (file.size > maxSizeBytes) {
      const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024));
      toast.error(`File too large. Maximum file size is ${maxSizeMB}MB.`);
      return;
    }

    setSelectedFile(file);
    const fileURL = URL.createObjectURL(file);
    setPreviewUrl(fileURL);
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  // Handle tag operations
  const handleAddTag = () => {
    if (tagInput.trim() && !imageTags.includes(tagInput.trim())) {
      const updatedTags = [...imageTags, tagInput.trim()];
      // This would update the parent's state
      setTagInput('');
      return updatedTags;
    }
    return imageTags;
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = imageTags.filter(tag => tag !== tagToRemove);
    return updatedTags;
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle upload process
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setProgress(0);
    
    try {
      const uploadOptions = {
        alt: altText || selectedFile.name.split('.')[0],
        description: imageDescription,
        tags: imageTags,
        bucket,
        folderPath,
        optimizationOptions
      };
      
      const result = await uploadFile(selectedFile, uploadOptions, (progress) => {
        setProgress(progress);
      });
      
      if (result.success && result.data) {
        toast.success('Image uploaded successfully');
        clearSelection();
        if (onUploadComplete && result.data.url) {
          onUploadComplete(result.data.url);
        }
      } else {
        throw new Error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    handleFileSelection,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleAddTag,
    handleRemoveTag,
    handleTagKeyDown,
    handleUpload,
    isUploading,
    progress
  };
}

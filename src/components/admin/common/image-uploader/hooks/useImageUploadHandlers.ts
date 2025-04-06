
import { useState } from 'react';
import { toast } from 'sonner';
import { ImageUploadResult } from '@/services/images/types';

export function useImageUploadHandlers({
  selectedFile,
  setSelectedFile,
  previewUrl,
  setPreviewUrl,
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
  uploadFile,
  onUploadComplete
}: {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
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
  uploadFile: (file: File, options?: any) => Promise<ImageUploadResult>;
  onUploadComplete?: (imageUrl: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle file selection
  const handleFileSelection = (file: File) => {
    // Create a preview URL
    const fileURL = URL.createObjectURL(file);
    setPreviewUrl(fileURL);
    setSelectedFile(file);
    
    // Set alt text to file name if empty
    if (!altText) {
      const fileName = file.name.split('.').slice(0, -1).join('.');
      setAltText(fileName);
    }
  };
  
  // Clear the selection
  const clearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setAltText('');
    setImageDescription('');
    setImageTags([]);
    setTagInput('');
  };
  
  // Handle tag operations
  const handleAddTag = () => {
    if (tagInput.trim() === '') return;
    
    const newTag = tagInput.trim().toLowerCase();
    if (!imageTags.includes(newTag)) {
      setImageTags([...imageTags, newTag]);
    }
    setTagInput('');
  };
  
  const handleRemoveTag = (tag: string) => {
    setImageTags(imageTags.filter((t) => t !== tag));
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  // Handle the actual upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('No file selected');
      return;
    }
    
    setIsUploading(true);
    setProgress(0);
    
    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prevProgress + 10;
        });
      }, 200);
      
      // Perform the upload
      const result = await uploadFile(selectedFile, {
        alt_text: altText,
        description: imageDescription,
        tags: imageTags
      });
      
      clearInterval(progressInterval);
      
      if (result.success && result.data?.url) {
        setProgress(100);
        toast.success('Image uploaded successfully');
        
        if (onUploadComplete) {
          onUploadComplete(result.data.url);
        }
        
        clearSelection();
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      setProgress(0);
      toast.error('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
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
    handleUpload
  };
}

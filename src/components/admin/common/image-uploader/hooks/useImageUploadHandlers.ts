
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
  uploadFile: (file: File) => Promise<ImageUploadResult>;
  onUploadComplete?: (url: string) => void;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelection = (file: File) => {
    if (!file) return;

    // Create preview URL
    const filePreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(filePreviewUrl);
    setSelectedFile(file);

    // Attempt to set alt text from filename if empty
    if (!altText && file.name) {
      const fileName = file.name.split('.')[0];
      const cleanName = fileName
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      setAltText(cleanName);
    }
  };

  const clearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setAltText('');
    setImageDescription('');
    setImageTags([]);
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const newTag = tagInput.trim();
      if (!imageTags.includes(newTag)) {
        setImageTags([...imageTags, newTag]);
      }
      setTagInput('');
    }
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

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setIsUploading(true);
      setProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload the file with metadata
      const metadata = {
        altText,
        description: imageDescription,
        tags: imageTags
      };

      const result = await uploadFile(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        const imageUrl = result.url || (result.data && result.data.url) || '';
        toast.success('File uploaded successfully');
        clearSelection();
        
        if (onUploadComplete && imageUrl) {
          onUploadComplete(imageUrl);
        }
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      toast.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    dragActive,
    setDragActive,
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

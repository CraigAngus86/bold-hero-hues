
import { useState } from 'react';
import { toast } from 'sonner';
import { uploadImage } from './api';
import { BucketType, ImageOptimizationOptions } from './types';

interface UseImageUploadProps {
  bucket?: BucketType;
  folderPath?: string;
  options?: ImageOptimizationOptions;
  onComplete?: (url: string, metadata: any) => void;
  onError?: (error: any) => void;
}

export const useImageUpload = ({
  bucket = 'images',
  folderPath = '',
  options = {},
  onComplete,
  onError,
}: UseImageUploadProps = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<any>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  
  const upload = async (file: File): Promise<string | null> => {
    if (!file) return null;
    
    try {
      setIsUploading(true);
      setProgress(0);
      setError(null);
      
      // Simulate progress for better UX (Supabase doesn't provide progress updates)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 400);
      
      const result = await uploadImage(file, bucket, folderPath, options);
      
      clearInterval(progressInterval);
      
      if ('error' in result) {
        setError(result.error);
        setProgress(0);
        if (onError) onError(result.error);
        toast.error('Failed to upload image');
        return null;
      }
      
      setProgress(100);
      setUploadedUrl(result.url);
      if (onComplete) onComplete(result.url, result.data);
      
      toast.success('Image uploaded successfully');
      return result.url;
    } catch (err) {
      setError(err);
      setProgress(0);
      if (onError) onError(err);
      toast.error('An error occurred while uploading');
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  const resetUpload = () => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
    setUploadedUrl(null);
  };
  
  return {
    upload,
    resetUpload,
    isUploading,
    progress,
    error,
    uploadedUrl,
  };
};

export const useImageUploadState = ({ 
  initialImageUrl = null,
  initialAlt = '',
  initialDescription = '',
  initialTags = [],
}: {
  initialImageUrl: string | null;
  initialAlt?: string;
  initialDescription?: string;
  initialTags?: string[];
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
  
  return {
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
    setIsUploading,
    progress,
    setProgress,
  };
};

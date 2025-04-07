
import React, { createContext, useContext, useState } from 'react';
import { BucketType } from '@/types/system/images';

interface ImageUploaderContextProps {
  previewUrl: string | null;
  altText: string;
  isUploading: boolean;
  progress: number;
  bucket: BucketType;
  folderPath: string;
  handleUpload: () => Promise<void>;
  setFile: (file: File | null) => void;
  setPreviewUrl: (url: string | null) => void;
  setAltText: (text: string) => void;
  clearSelection: () => void;
}

const defaultContext: ImageUploaderContextProps = {
  previewUrl: null,
  altText: '',
  isUploading: false,
  progress: 0,
  bucket: BucketType.IMAGES,
  folderPath: '',
  handleUpload: async () => {},
  setFile: () => {},
  setPreviewUrl: () => {},
  setAltText: () => {},
  clearSelection: () => {},
};

const ImageUploaderContext = createContext<ImageUploaderContextProps>(defaultContext);

interface ImageUploaderProviderProps {
  children: React.ReactNode;
  bucket?: BucketType;
  folderPath?: string;
  onUploadComplete?: (url: string) => void;
}

export const ImageUploaderProvider: React.FC<ImageUploaderProviderProps> = ({
  children,
  bucket = BucketType.IMAGES,
  folderPath = '',
  onUploadComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const clearSelection = () => {
    setFile(null);
    setPreviewUrl(null);
    setAltText('');
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    try {
      // Simulate upload progress
      const intervalId = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 15);
          return next > 95 ? 95 : next;
        });
      }, 300);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearInterval(intervalId);
      setProgress(100);

      // In a real app, we'd upload the file to storage here
      const mockUrl = `https://example.com/storage/${bucket}/${folderPath}/${file.name}`;
      
      if (onUploadComplete) {
        onUploadComplete(mockUrl);
      }
      
      // Clear the selection after successful upload
      setTimeout(() => {
        clearSelection();
        setIsUploading(false);
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
    }
  };

  const value = {
    previewUrl,
    altText,
    isUploading,
    progress,
    bucket,
    folderPath,
    handleUpload,
    setFile,
    setPreviewUrl,
    setAltText,
    clearSelection
  };

  return (
    <ImageUploaderContext.Provider value={value}>
      {children}
    </ImageUploaderContext.Provider>
  );
};

export const useImageUploaderContext = () => {
  const context = useContext(ImageUploaderContext);
  if (!context) {
    throw new Error('useImageUploaderContext must be used within an ImageUploaderProvider');
  }
  return context;
};

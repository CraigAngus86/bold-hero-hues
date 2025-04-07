
import React, { createContext, useContext, useState } from 'react';
import { BucketType } from '@/types/system/images';

interface ImageUploaderContextProps {
  previewUrl: string | null;
  altText: string;
  imageDescription: string;  // Added field
  isUploading: boolean;
  progress: number;
  bucket: BucketType;
  folderPath: string;
  imageTags: string[];  // Added field
  tagInput: string;  // Added field
  handleUpload: () => Promise<void>;
  setFile: (file: File | null) => void;
  setPreviewUrl: (url: string | null) => void;
  setAltText: (text: string) => void;
  setImageDescription: (desc: string) => void;  // Added field
  setTagInput: (input: string) => void;  // Added field
  setImageTags: (tags: string[]) => void;  // Added field
  handleAddTag: () => void;  // Added field
  handleRemoveTag: (tag: string) => void;  // Added field
  handleTagKeyDown: (e: React.KeyboardEvent) => void;  // Added field
  clearSelection: () => void;
}

const defaultContext: ImageUploaderContextProps = {
  previewUrl: null,
  altText: '',
  imageDescription: '',  // Added field
  isUploading: false,
  progress: 0,
  bucket: BucketType.IMAGES,
  folderPath: '',
  imageTags: [],  // Added field
  tagInput: '',  // Added field
  handleUpload: async () => {},
  setFile: () => {},
  setPreviewUrl: () => {},
  setAltText: () => {},
  setImageDescription: () => {},  // Added field
  setTagInput: () => {},  // Added field
  setImageTags: () => {},  // Added field
  handleAddTag: () => {},  // Added field
  handleRemoveTag: () => {},  // Added field
  handleTagKeyDown: () => {},  // Added field
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
  const [imageDescription, setImageDescription] = useState('');  // Added field
  const [imageTags, setImageTags] = useState<string[]>([]);  // Added field
  const [tagInput, setTagInput] = useState('');  // Added field
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle adding a tag
  const handleAddTag = () => {
    if (tagInput.trim() === '') return;
    
    const newTag = tagInput.trim().toLowerCase();
    if (!imageTags.includes(newTag)) {
      setImageTags([...imageTags, newTag]);
    }
    setTagInput('');
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tag: string) => {
    setImageTags(imageTags.filter((t) => t !== tag));
  };
  
  // Handle key down event for tag input
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPreviewUrl(null);
    setAltText('');
    setImageDescription('');
    setImageTags([]);
    setTagInput('');
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
    imageDescription,  // Added field
    isUploading,
    progress,
    bucket,
    folderPath,
    imageTags,  // Added field
    tagInput,  // Added field
    handleUpload,
    setFile,
    setPreviewUrl,
    setAltText,
    setImageDescription,  // Added field
    setTagInput,  // Added field
    setImageTags,  // Added field
    handleAddTag,  // Added field
    handleRemoveTag,  // Added field
    handleTagKeyDown,  // Added field
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

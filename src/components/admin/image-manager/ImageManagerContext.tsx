
import React, { createContext, useContext, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useFolders } from './hooks';
import { ImageFolder, ImageManagerContextType } from './types';
import { v4 as uuidv4 } from 'uuid';

// Create context with default values
const ImageManagerContext = createContext<ImageManagerContextType | undefined>(undefined);

// Provider props
interface ImageManagerProviderProps {
  children: React.ReactNode;
}

// Provider component
export const ImageManagerProvider: React.FC<ImageManagerProviderProps> = ({ children }) => {
  const {
    folders,
    currentFolder,
    subfolders,
    breadcrumbs,
    navigateToFolder,
    navigateUp,
    navigateToBreadcrumb
  } = useFolders();

  const [images, setImages] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  // Create new folder
  const createNewFolder = async (folderName: string): Promise<boolean> => {
    try {
      if (!currentFolder) return false;
      
      const newFolderId = uuidv4();
      const newFolderPath = currentFolder.path === '/' 
        ? `/${folderName}` 
        : `${currentFolder.path}/${folderName}`;
      
      const newFolder = {
        id: newFolderId,
        name: folderName,
        path: newFolderPath,
        parent_id: currentFolder.id
      };
      
      const { error } = await supabase
        .from('image_folders')
        .insert(newFolder);
        
      if (error) throw error;
      
      // Navigate to the new folder (adds it to the UI)
      navigateToFolder({
        ...newFolder,
        parentId: newFolder.parent_id
      });
      
      return true;
    } catch (error) {
      console.error('Error creating folder:', error);
      return false;
    }
  };

  // Upload file
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setIsUploading(true);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Create storage path
        const folderPath = currentFolder?.path || '/';
        const fileName = file.name;
        
        // Upload to Supabase Storage
        const { error } = await supabase.storage
          .from('images')
          .upload(`${folderPath}/${fileName}`, file);
          
        if (error) throw error;
      }
      
      // Refresh images
      loadImagesInCurrentFolder();
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Load images in current folder
  const loadImagesInCurrentFolder = async () => {
    if (!currentFolder) return;
    
    try {
      const { data, error } = await supabase.storage
        .from('images')
        .list(currentFolder.path);
        
      if (error) throw error;
      
      // Filter out folders (objects that end with '/')
      const imageFiles = data?.filter(item => !item.name.endsWith('/')) || [];
      setImages(imageFiles);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  // Get image URL
  const getImageUrl = (fileName: string): string => {
    if (!currentFolder) return '';
    
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(`${currentFolder.path}/${fileName}`);
      
    return data?.publicUrl || '';
  };

  // View image
  const viewImage = (url: string) => {
    setSelectedImage(url);
    setImageDialogOpen(true);
  };

  // Context value
  const value: ImageManagerContextType = {
    folders,
    currentFolder,
    subfolders,
    images,
    breadcrumbs,
    isUploading,
    selectedImage,
    newFolderDialogOpen,
    imageDialogOpen,
    setNewFolderDialogOpen,
    setImageDialogOpen,
    setSelectedImage,
    navigateToFolder,
    navigateUp,
    navigateToBreadcrumb,
    createNewFolder,
    handleFileUpload,
    getImageUrl,
    viewImage
  };

  return (
    <ImageManagerContext.Provider value={value}>
      {children}
    </ImageManagerContext.Provider>
  );
};

// Custom hook to use the image manager context
export const useImageManager = (): ImageManagerContextType => {
  const context = useContext(ImageManagerContext);
  if (context === undefined) {
    throw new Error('useImageManager must be used within an ImageManagerProvider');
  }
  return context;
};

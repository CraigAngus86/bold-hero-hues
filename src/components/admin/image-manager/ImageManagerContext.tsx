
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ImageFolder, ImageMetadata } from '@/types/images';
import { getImageFolders, getImagesByFolder, createImageFolder } from '@/services/imageService';
import { toast } from 'sonner';

interface ImageManagerContextType {
  folders: ImageFolder[];
  currentFolder: ImageFolder | null;
  images: ImageMetadata[];
  selectedImage: ImageMetadata | null;
  isLoading: boolean;
  isLoadingImages: boolean;
  loadFolders: () => Promise<void>;
  loadImagesForFolder: (folderId: string) => Promise<void>;
  selectFolder: (folder: ImageFolder | null) => void;
  selectImage: (image: ImageMetadata | null) => void;
  createFolder: (name: string, parentId?: string) => Promise<ImageFolder | null>;
  refreshImages: () => Promise<void>;
}

const ImageManagerContext = createContext<ImageManagerContextType | undefined>(undefined);

export function useImageManager() {
  const context = useContext(ImageManagerContext);
  if (!context) {
    throw new Error('useImageManager must be used within an ImageManagerProvider');
  }
  return context;
}

interface ImageManagerProviderProps {
  children: ReactNode;
}

export function ImageManagerProvider({ children }: ImageManagerProviderProps) {
  const [folders, setFolders] = useState<ImageFolder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<ImageFolder | null>(null);
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  const loadFolders = useCallback(async () => {
    setIsLoading(true);
    try {
      const folderData = await getImageFolders();
      setFolders(folderData);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error('Failed to load image folders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectFolder = useCallback((folder: ImageFolder | null) => {
    setCurrentFolder(folder);
    setSelectedImage(null);
    
    if (folder) {
      loadImagesForFolder(folder.id);
    } else {
      setImages([]);
    }
  }, []);

  const loadImagesForFolder = useCallback(async (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;

    setIsLoadingImages(true);
    try {
      const imageData = await getImagesByFolder(folder.path);
      setImages(imageData);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
    } finally {
      setIsLoadingImages(false);
    }
  }, [folders]);

  const selectImage = useCallback((image: ImageMetadata | null) => {
    setSelectedImage(image);
  }, []);

  const createFolder = useCallback(async (name: string, parentId?: string): Promise<ImageFolder | null> => {
    try {
      // Determine the parent path
      let parentPath = '';
      if (parentId) {
        const parent = folders.find(f => f.id === parentId);
        if (parent) {
          parentPath = parent.path.endsWith('/') ? parent.path : `${parent.path}/`;
        }
      }
      
      // Create the new folder path
      const folderPath = `${parentPath}${name}`;
      
      // Create the folder
      const newFolder = await createImageFolder(name, folderPath, parentId);
      
      if (newFolder) {
        // Refresh the folder list
        await loadFolders();
        toast.success(`Folder "${name}" created successfully`);
        return newFolder;
      } else {
        toast.error('Failed to create folder');
        return null;
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
      return null;
    }
  }, [folders, loadFolders]);

  const refreshImages = useCallback(async () => {
    if (currentFolder) {
      await loadImagesForFolder(currentFolder.id);
    }
  }, [currentFolder, loadImagesForFolder]);

  // Load folders when the provider mounts
  React.useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  const value = {
    folders,
    currentFolder,
    images,
    selectedImage,
    isLoading,
    isLoadingImages,
    loadFolders,
    loadImagesForFolder,
    selectFolder,
    selectImage,
    createFolder,
    refreshImages
  };

  return (
    <ImageManagerContext.Provider value={value}>
      {children}
    </ImageManagerContext.Provider>
  );
}

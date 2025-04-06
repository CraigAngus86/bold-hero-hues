
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ImageFolder, ImageMetadata } from '@/types/images';
import { getImageFolders, getImagesByFolder, createImageFolder } from '@/services/imageService';
import { toast } from 'sonner';

interface ImageManagerContextType {
  folders: ImageFolder[];
  currentFolder: ImageFolder | null;
  subfolders: ImageFolder[];
  images: ImageMetadata[];
  breadcrumbs: Array<{ id: string; name: string; path: string }>;
  isLoading: boolean;
  isLoadingImages: boolean;
  isUploading: boolean;
  selectedImage: ImageMetadata | null;
  newFolderDialogOpen: boolean;
  imageDialogOpen: boolean;
  setNewFolderDialogOpen: (open: boolean) => void;
  setImageDialogOpen: (open: boolean) => void;
  selectFolder: (folder: ImageFolder | null) => void;
  selectImage: (image: ImageMetadata | null) => void;
  createFolder: (name: string, parentId?: string) => Promise<ImageFolder | null>;
  refreshImages: () => Promise<void>;
  navigateToFolder: (folder: ImageFolder) => void;
  navigateUp: () => void;
  navigateToBreadcrumb: (path: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  getImageUrl: (fileName: string) => string;
  viewImage: (url: string) => void;
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
  const [subfolders, setSubfolders] = useState<ImageFolder[]>([]);
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id: string; name: string; path: string }>>([]);
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const loadFolders = useCallback(async () => {
    setIsLoading(true);
    try {
      const folderData = await getImageFolders();
      setFolders(folderData);
      
      // Set root folder if no current folder
      if (!currentFolder && folderData.length > 0) {
        const rootFolder = folderData.find(f => !f.parent_id) || folderData[0];
        setCurrentFolder(rootFolder);
        
        // Set subfolders
        const childFolders = folderData.filter(f => f.parent_id === rootFolder.id);
        setSubfolders(childFolders);
        
        // Set breadcrumbs
        setBreadcrumbs([{ id: rootFolder.id, name: rootFolder.name, path: rootFolder.path }]);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error('Failed to load image folders');
    } finally {
      setIsLoading(false);
    }
  }, [currentFolder]);

  const selectFolder = useCallback((folder: ImageFolder | null) => {
    setCurrentFolder(folder);
    setSelectedImage(null);
    
    if (folder) {
      // Find subfolders
      const childFolders = folders.filter(f => f.parent_id === folder.id);
      setSubfolders(childFolders);
      
      // Update breadcrumbs
      const folderPath = folder.path.split('/').filter(Boolean);
      const newBreadcrumbs = [{ id: 'root', name: 'Root', path: '/' }];
      
      let currentPath = '';
      for (let i = 0; i < folderPath.length; i++) {
        const pathPart = folderPath[i];
        currentPath += `/${pathPart}`;
        
        const matchingFolder = folders.find(f => f.path === currentPath);
        if (matchingFolder) {
          newBreadcrumbs.push({
            id: matchingFolder.id,
            name: matchingFolder.name,
            path: matchingFolder.path
          });
        }
      }
      
      setBreadcrumbs(newBreadcrumbs);
      loadImagesForFolder(folder.path);
    } else {
      setSubfolders([]);
      setBreadcrumbs([]);
      setImages([]);
    }
  }, [folders]);

  const loadImagesForFolder = useCallback(async (folderPath: string) => {
    setIsLoadingImages(true);
    try {
      const imageData = await getImagesByFolder(folderPath);
      setImages(imageData);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
    } finally {
      setIsLoadingImages(false);
    }
  }, []);

  const selectImage = useCallback((image: ImageMetadata | null) => {
    setSelectedImage(image);
    if (image) {
      setImageDialogOpen(true);
    }
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
      await loadImagesForFolder(currentFolder.path);
    }
  }, [currentFolder, loadImagesForFolder]);

  // Navigation functions
  const navigateToFolder = useCallback((folder: ImageFolder) => {
    selectFolder(folder);
  }, [selectFolder]);

  const navigateUp = useCallback(() => {
    if (!currentFolder || !currentFolder.parent_id) return;
    
    const parentFolder = folders.find(f => f.id === currentFolder.parent_id);
    if (parentFolder) {
      selectFolder(parentFolder);
    }
  }, [currentFolder, folders, selectFolder]);

  const navigateToBreadcrumb = useCallback((path: string) => {
    const folder = folders.find(f => f.path === path);
    if (folder) {
      selectFolder(folder);
    }
  }, [folders, selectFolder]);

  // File upload handler
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentFolder || !event.target.files || event.target.files.length === 0) return;
    
    setIsUploading(true);
    // Simulated upload - in a real app, you would call an API endpoint
    setTimeout(() => {
      setIsUploading(false);
      toast.success(`${event.target.files!.length} files uploaded successfully`);
      refreshImages();
      event.target.value = '';
    }, 1500);
  }, [currentFolder, refreshImages]);

  const getImageUrl = useCallback((fileName: string) => {
    if (!currentFolder) return '';
    return `${currentFolder.path}/${fileName}`;
  }, [currentFolder]);

  const viewImage = useCallback((url: string) => {
    // Find the image by URL
    const image = images.find(img => img.url === url);
    if (image) {
      selectImage(image);
    }
  }, [images, selectImage]);

  // Load folders when the provider mounts
  React.useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  const value = {
    folders,
    currentFolder,
    subfolders,
    images,
    breadcrumbs,
    isLoading,
    isLoadingImages,
    isUploading,
    selectedImage,
    newFolderDialogOpen,
    imageDialogOpen,
    setNewFolderDialogOpen,
    setImageDialogOpen,
    selectFolder,
    selectImage,
    createFolder,
    refreshImages,
    navigateToFolder,
    navigateUp,
    navigateToBreadcrumb,
    handleFileUpload,
    getImageUrl,
    viewImage
  };

  return (
    <ImageManagerContext.Provider value={value}>
      {children}
    </ImageManagerContext.Provider>
  );
}

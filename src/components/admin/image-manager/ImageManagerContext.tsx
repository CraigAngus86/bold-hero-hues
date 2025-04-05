
import { createContext, useContext, ReactNode } from 'react';
import { useFolders } from './hooks';
import { useImageOperations } from './imageOperations';
import { useFolderOperations } from './folderOperations';
import { useImageDialog } from './ImageDialogState';
import { ImageManagerContextType, ImageFolder } from './types';

export { ImageFolder };

export const ImageManagerContext = createContext<ImageManagerContextType | undefined>(undefined);

export const ImageManagerProvider = ({ children }: { children: ReactNode }) => {
  // Use our custom hooks
  const {
    folders,
    currentFolder,
    subfolders,
    breadcrumbs,
    fetchAllFolders,
    navigateToFolder,
    navigateUp,
    navigateToBreadcrumb
  } = useFolders();

  const {
    images,
    isUploading,
    fetchImagesForFolder,
    handleFileUpload: uploadFiles,
    getImageUrl: getUrl
  } = useImageOperations();

  const {
    newFolderDialogOpen,
    setNewFolderDialogOpen,
    createNewFolder: createFolder
  } = useFolderOperations();

  const {
    imageDialogOpen,
    setImageDialogOpen,
    selectedImage,
    setSelectedImage,
    viewImage
  } = useImageDialog();

  // Effect to fetch images when current folder changes
  if (currentFolder) {
    fetchImagesForFolder(currentFolder.path);
  }

  // Wrapper functions to provide the right context
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    return uploadFiles(event, currentFolder?.path || null);
  };

  const getImageUrl = (fileName: string) => {
    return getUrl(currentFolder?.path || null, fileName);
  };

  const createNewFolder = (folderName: string) => {
    return createFolder(
      folderName, 
      currentFolder, 
      fetchAllFolders
    );
  };

  const value = {
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

export const useImageManager = () => {
  const context = useContext(ImageManagerContext);
  if (context === undefined) {
    throw new Error('useImageManager must be used within an ImageManagerProvider');
  }
  return context;
};

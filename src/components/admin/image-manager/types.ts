
/**
 * Interface for an image folder structure in the image manager
 */
export interface ImageFolder {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
}

/**
 * Interface for ImageManagerContext
 */
export interface ImageManagerContextType {
  folders: ImageFolder[];
  currentFolder: ImageFolder | null;
  subfolders: ImageFolder[];
  images: any[]; // Storage file objects
  breadcrumbs: Array<{ name: string; path: string }>;
  isUploading: boolean;
  selectedImage: string | null;
  newFolderDialogOpen: boolean;
  imageDialogOpen: boolean;
  setNewFolderDialogOpen: (open: boolean) => void;
  setImageDialogOpen: (open: boolean) => void;
  setSelectedImage: (url: string | null) => void;
  navigateToFolder: (folder: ImageFolder) => void;
  navigateUp: () => void;
  navigateToBreadcrumb: (path: string) => void;
  createNewFolder: (folderName: string) => Promise<boolean>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  getImageUrl: (fileName: string) => string;
  viewImage: (url: string) => void;
}


/**
 * Interface for an image folder structure in the image manager
 */
export interface ImageFolder {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  parent_id?: string | null; // For compatibility with API responses
  created_at?: string;
  updated_at?: string;
}

/**
 * Interface for ImageManagerContext
 */
export interface ImageManagerContextType {
  folders: ImageFolder[];
  currentFolder: ImageFolder | null;
  subfolders: ImageFolder[];
  images: any[]; // Storage file objects
  breadcrumbs: Array<{ id: string; name: string; path: string }>;
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

// Helper function to convert API response to ImageFolder
export const mapApiResponseToImageFolder = (item: any): ImageFolder => {
  return {
    id: item.id,
    name: item.name,
    path: item.path,
    parentId: item.parent_id,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
};

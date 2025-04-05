
// Define the folder structure type
export interface ImageFolder {
  id: string;
  name: string;
  path: string;
  parent_id: string | null;
  created_at: string;
}

export interface ImageFile {
  id: string;
  name: string;
  metadata: any;
}

export interface ImageManagerContextType {
  folders: ImageFolder[];
  currentFolder: ImageFolder | null;
  subfolders: ImageFolder[];
  images: any[];
  breadcrumbs: ImageFolder[];
  isUploading: boolean;
  selectedImage: string | null;
  newFolderDialogOpen: boolean;
  imageDialogOpen: boolean;
  setNewFolderDialogOpen: (open: boolean) => void;
  setImageDialogOpen: (open: boolean) => void;
  setSelectedImage: (url: string | null) => void;
  navigateToFolder: (folder: ImageFolder) => void;
  navigateUp: () => void;
  navigateToBreadcrumb: (folder: ImageFolder | null) => void;
  createNewFolder: (folderName: string) => Promise<void>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  getImageUrl: (fileName: string) => string;
  viewImage: (fileName: string) => void;
}

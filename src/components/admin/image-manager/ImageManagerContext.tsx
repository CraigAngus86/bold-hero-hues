
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

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

interface ImageManagerContextType {
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

export const ImageManagerContext = createContext<ImageManagerContextType | undefined>(undefined);

export const ImageManagerProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [folders, setFolders] = useState<ImageFolder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<ImageFolder | null>(null);
  const [subfolders, setSubfolders] = useState<ImageFolder[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<ImageFolder[]>([]);

  // Load all folders on component mount
  useEffect(() => {
    fetchAllFolders();
  }, []);

  // Effect to update subfolders when current folder changes
  useEffect(() => {
    if (folders.length > 0) {
      // If no current folder, show root folders
      if (!currentFolder) {
        const rootFolders = folders.filter(folder => !folder.parent_id);
        setSubfolders(rootFolders);
        setBreadcrumbs([]);
      } else {
        // Show subfolders of current folder
        const children = folders.filter(folder => folder.parent_id === currentFolder.id);
        setSubfolders(children);
        
        // Build breadcrumbs
        buildBreadcrumbs(currentFolder.id);
        
        // Load images for the current folder
        fetchImagesForFolder(currentFolder.path);
      }
    }
  }, [currentFolder, folders]);

  // Fetch all folders from Supabase
  const fetchAllFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('image_folders')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      if (data) {
        setFolders(data);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast({
        title: "Failed to load folders",
        description: "There was a problem loading the folders.",
        variant: "destructive"
      });
    }
  };

  // Build breadcrumb path
  const buildBreadcrumbs = (folderId: string) => {
    const breadcrumbPath = [];
    let currentId = folderId;
    let found = true;
    
    while (found) {
      const folder = folders.find(f => f.id === currentId);
      if (folder) {
        breadcrumbPath.unshift(folder);
        currentId = folder.parent_id as string;
        found = !!folder.parent_id;
      } else {
        found = false;
      }
    }
    
    setBreadcrumbs(breadcrumbPath);
  };

  // Fetch images for the current folder
  const fetchImagesForFolder = async (folderPath: string) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('images')
        .list(folderPath, {
          sortBy: { column: 'name', order: 'asc' }
        });
      
      if (error) throw error;
      
      if (data) {
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Failed to load images",
        description: "There was a problem loading the images.",
        variant: "destructive"
      });
    }
  };

  // Navigate to a folder
  const navigateToFolder = (folder: ImageFolder) => {
    setCurrentFolder(folder);
  };

  // Navigate up to parent folder
  const navigateUp = () => {
    if (!currentFolder) return;
    
    if (currentFolder.parent_id) {
      const parentFolder = folders.find(f => f.id === currentFolder.parent_id);
      if (parentFolder) {
        setCurrentFolder(parentFolder);
      }
    } else {
      setCurrentFolder(null);
    }
  };

  // Navigate using breadcrumb
  const navigateToBreadcrumb = (folder: ImageFolder | null) => {
    setCurrentFolder(folder);
  };

  // Create a new subfolder
  const createNewFolder = async (newFolderName: string) => {
    if (!newFolderName.trim()) {
      toast({
        title: "Folder name required",
        description: "Please enter a name for the new folder.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate a path-friendly name
      const pathName = newFolderName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // Create full path based on current location
      const fullPath = currentFolder 
        ? `${currentFolder.path}/${pathName}` 
        : pathName;
      
      // First create the folder in storage to make sure it works
      console.log("Creating folder in storage:", fullPath);
      const { error: storageError } = await supabase
        .storage
        .from('images')
        .upload(`${fullPath}/.folder`, new Blob([''])); // Empty file to create folder
      
      if (storageError && storageError.message !== 'The resource already exists') {
        throw storageError;
      }
      
      console.log("Storage folder created, now creating database entry");
      // Then insert folder into database
      const { data, error } = await supabase
        .from('image_folders')
        .insert({
          name: newFolderName,
          path: fullPath,
          parent_id: currentFolder ? currentFolder.id : null
        })
        .select();
      
      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      // Refresh folders list
      fetchAllFolders();
      
      toast({
        title: "Folder created",
        description: `The folder "${newFolderName}" has been created.`
      });
      
      // Reset and close dialog
      setNewFolderDialogOpen(false);
    } catch (error: any) {
      console.error('Error creating folder:', error);
      toast({
        title: "Failed to create folder",
        description: error.message || "There was a problem creating the folder.",
        variant: "destructive"
      });
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentFolder) {
      toast({
        title: "No folder selected",
        description: "Please select a folder before uploading images.",
        variant: "destructive"
      });
      return;
    }
    
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    let successCount = 0;
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${currentFolder.path}/${fileName}`;
        
        const { error } = await supabase
          .storage
          .from('images')
          .upload(filePath, file);
        
        if (error) {
          console.error('Error uploading file:', error);
          continue;
        }
        
        successCount++;
      }
      
      // Refresh images list
      fetchImagesForFolder(currentFolder.path);
      
      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${successCount} of ${files.length} images.`
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading one or more images.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  // Get public URL for an image
  const getImageUrl = (fileName: string) => {
    if (!currentFolder) return '';
    const { data } = supabase
      .storage
      .from('images')
      .getPublicUrl(`${currentFolder.path}/${fileName}`);
    
    return data.publicUrl;
  };

  // Open image in dialog
  const viewImage = (fileName: string) => {
    setSelectedImage(getImageUrl(fileName));
    setImageDialogOpen(true);
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

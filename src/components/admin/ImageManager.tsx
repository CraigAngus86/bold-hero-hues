
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FolderPlus, Upload, Folder, ArrowLeft, FileImage, Clipboard, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Define the folder structure type
interface ImageFolder {
  id: string;
  name: string;
  path: string;
  parent_id: string | null;
  created_at: string;
}

const ImageManager = () => {
  const { toast } = useToast();
  const [folders, setFolders] = useState<ImageFolder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<ImageFolder | null>(null);
  const [parentFolders, setParentFolders] = useState<ImageFolder[]>([]);
  const [subfolders, setSubfolders] = useState<ImageFolder[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
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
  const createNewFolder = async () => {
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
      
      // Insert new folder into database
      const { data, error } = await supabase
        .from('image_folders')
        .insert({
          name: newFolderName,
          path: fullPath,
          parent_id: currentFolder ? currentFolder.id : null
        })
        .select();
      
      if (error) throw error;
      
      // Create folder in storage
      const { error: storageError } = await supabase
        .storage
        .from('images')
        .upload(`${fullPath}/.folder`, new Blob([''])); // Empty file to create folder
      
      if (storageError && storageError.message !== 'The resource already exists') throw storageError;
      
      // Refresh folders list
      fetchAllFolders();
      
      toast({
        title: "Folder created",
        description: `The folder "${newFolderName}" has been created.`
      });
      
      // Reset and close dialog
      setNewFolderName('');
      setNewFolderDialogOpen(false);
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Failed to create folder",
        description: "There was a problem creating the folder.",
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

  // Copy image URL to clipboard
  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "URL copied",
        description: "Image URL has been copied to clipboard."
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Image Manager</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setNewFolderDialogOpen(true)}
            className="flex items-center"
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          
          {currentFolder && (
            <div className="relative">
              <Input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                disabled={isUploading}
              />
              <Button 
                variant="default" 
                className="flex items-center relative"
                disabled={isUploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Upload Images'}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-4">
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigateToBreadcrumb(null)}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {breadcrumbs.map((folder, index) => (
          <BreadcrumbItem key={folder.id}>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbLink 
              onClick={() => navigateToBreadcrumb(folder)}
              className={index === breadcrumbs.length - 1 ? "font-semibold" : ""}
            >
              {folder.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
      
      {/* Back button */}
      {currentFolder && (
        <Button 
          variant="ghost" 
          onClick={navigateUp}
          className="mb-4 p-2 h-auto"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Display Folders */}
        {subfolders.map(folder => (
          <Card 
            key={folder.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigateToFolder(folder)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Folder className="h-12 w-12 text-team-blue mb-2" />
              <span className="text-sm font-medium">{folder.name}</span>
            </CardContent>
          </Card>
        ))}
        
        {/* Display Images */}
        {images
          .filter(item => !item.name.endsWith('.folder'))
          .map(image => (
          <Card 
            key={image.id}
            className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
            onClick={() => viewImage(image.name)}
          >
            <CardContent className="p-0 aspect-square relative group">
              <img 
                src={getImageUrl(image.name)} 
                alt={image.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs truncate">
                {image.name.substring(0, 8)}...
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* New Folder Dialog */}
      <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="folderName" className="text-right text-sm">
                Folder Name
              </label>
              <Input
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createNewFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Image Preview Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row justify-between items-center">
            <DialogTitle>Image Preview</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setImageDialogOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          {selectedImage && (
            <div className="flex flex-col items-center">
              <div className="relative max-h-[60vh] overflow-hidden">
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  className="max-w-full h-auto"
                />
              </div>
              <div className="w-full flex items-center mt-4 bg-gray-100 rounded-md p-2">
                <Input 
                  value={selectedImage} 
                  readOnly 
                  className="flex-grow bg-transparent border-none focus-visible:ring-0"
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => copyImageUrl(selectedImage)}
                  className="ml-2"
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageManager;

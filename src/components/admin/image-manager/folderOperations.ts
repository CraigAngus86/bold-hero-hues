
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useFolderOperations() {
  const { toast } = useToast();
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);

  // Create a new subfolder
  const createNewFolder = async (
    newFolderName: string, 
    currentFolder: { id: string, path: string } | null,
    onSuccess: () => void
  ) => {
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
      onSuccess();
      
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

  return {
    newFolderDialogOpen,
    setNewFolderDialogOpen,
    createNewFolder
  };
}

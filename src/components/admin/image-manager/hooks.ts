
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ImageFolder } from './types';

export function useFolders() {
  const { toast } = useToast();
  const [folders, setFolders] = useState<ImageFolder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<ImageFolder | null>(null);
  const [subfolders, setSubfolders] = useState<ImageFolder[]>([]);
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

  return {
    folders,
    currentFolder,
    subfolders,
    breadcrumbs,
    fetchAllFolders,
    navigateToFolder,
    navigateUp,
    navigateToBreadcrumb,
    setCurrentFolder
  };
}


import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ImageFolder, mapApiResponseToImageFolder } from './types';

export const useFolders = (initialPath = '/') => {
  const [folders, setFolders] = useState<ImageFolder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<ImageFolder | null>(null);
  const [subfolders, setSubfolders] = useState<ImageFolder[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{name: string; path: string}>>(
    [{ name: 'Root', path: '/' }]
  );

  // Load all folders on mount
  useEffect(() => {
    const loadFolders = async () => {
      try {
        const { data, error } = await supabase
          .from('image_folders')
          .select('*');
          
        if (error) throw error;
        
        // Map API response to ImageFolder type
        const mappedFolders = data?.map(mapApiResponseToImageFolder) || [];
        setFolders(mappedFolders);
        
        // Set root folder
        const rootFolder = mappedFolders.find(f => f.path === '/') || {
          id: 'root',
          name: 'Root',
          path: '/',
          parentId: null
        };
        
        setCurrentFolder(rootFolder);
        
        // Set subfolders of root
        const rootSubfolders = mappedFolders.filter(f => f.parentId === rootFolder.id);
        setSubfolders(rootSubfolders);
        
      } catch (error) {
        console.error('Error loading folders:', error);
      }
    };
    
    loadFolders();
  }, []);

  // Navigate to a folder
  const navigateToFolder = useCallback((folder: ImageFolder) => {
    setCurrentFolder(folder);
    
    // Update subfolders
    const newSubfolders = folders.filter(f => f.parentId === folder.id);
    setSubfolders(newSubfolders);
    
    // Update breadcrumbs
    const pathParts = folder.path.split('/').filter(Boolean);
    const newBreadcrumbs = [{ name: 'Root', path: '/' }];
    
    let currentPath = '';
    for (const part of pathParts) {
      currentPath += `/${part}`;
      const folderForPath = folders.find(f => f.path === currentPath);
      if (folderForPath) {
        newBreadcrumbs.push({
          name: part,
          path: currentPath
        });
      }
    }
    
    setBreadcrumbs(newBreadcrumbs);
  }, [folders]);

  // Navigate up to parent folder
  const navigateUp = useCallback(() => {
    if (!currentFolder || currentFolder.path === '/') return;
    
    const parentFolder = folders.find(f => f.id === currentFolder.parentId);
    if (parentFolder) {
      navigateToFolder(parentFolder);
    } else {
      // Navigate to root if parent not found
      const rootFolder = folders.find(f => f.path === '/') || {
        id: 'root',
        name: 'Root',
        path: '/',
        parentId: null
      };
      navigateToFolder(rootFolder);
    }
  }, [currentFolder, folders, navigateToFolder]);

  // Navigate using breadcrumb
  const navigateToBreadcrumb = useCallback((path: string) => {
    const folder = folders.find(f => f.path === path);
    if (folder) {
      navigateToFolder(folder);
    } else if (path === '/') {
      // Navigate to root
      const rootFolder = {
        id: 'root',
        name: 'Root',
        path: '/',
        parentId: null
      };
      navigateToFolder(rootFolder);
    }
  }, [folders, navigateToFolder]);

  return {
    folders,
    currentFolder,
    subfolders,
    breadcrumbs,
    navigateToFolder,
    navigateUp,
    navigateToBreadcrumb
  };
};


import React, { useState, useEffect } from 'react';
import { getImageFolders, getImagesByFolder } from '@/services/imageService';
import FolderTree from './FolderTree';
import ImageGrid from './ImageGrid';
import { ImageFolder, ImageMetadata } from '@/types/images';
import { Loader } from 'lucide-react';
import FolderActions from './FolderActions';
import { toast } from 'sonner';

const ImageManager: React.FC = () => {
  const [folders, setFolders] = useState<ImageFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<ImageFolder | null>(null);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingImages, setLoadingImages] = useState<boolean>(false);
  
  // Load folders when component mounts
  useEffect(() => {
    const loadFolders = async () => {
      setLoading(true);
      try {
        const folderData = await getImageFolders();
        setFolders(folderData);
      } catch (error) {
        console.error('Error fetching folders:', error);
        toast.error('Failed to load image folders');
      } finally {
        setLoading(false);
      }
    };

    loadFolders();
  }, []);

  // Load images when the selected folder changes
  useEffect(() => {
    if (currentPath) {
      loadImagesForFolder(currentPath);
    } else {
      setImages([]);
    }
  }, [currentPath]);

  const loadImagesForFolder = async (path: string) => {
    setLoadingImages(true);
    try {
      const imageData = await getImagesByFolder(path);
      setImages(imageData);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
    } finally {
      setLoadingImages(false);
    }
  };

  const handleFolderSelect = (folder: ImageFolder) => {
    setSelectedFolder(folder);
    setCurrentPath(folder.path);
  };

  const handleRefresh = () => {
    if (currentPath) {
      loadImagesForFolder(currentPath);
    }
  };

  return (
    <div className="flex h-full">
      {/* Folder tree sidebar */}
      <div className="w-1/4 p-4 border-r overflow-auto">
        <h2 className="text-xl font-bold mb-4">Folders</h2>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        ) : (
          <FolderTree folders={folders} onFolderSelect={handleFolderSelect} selectedFolder={selectedFolder} />
        )}
      </div>
      
      {/* Main content area */}
      <div className="w-3/4 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {selectedFolder ? `Images in ${selectedFolder.name}` : 'Select a folder'}
          </h2>
          
          {selectedFolder && (
            <FolderActions 
              currentFolder={selectedFolder} 
              onRefresh={handleRefresh} 
            />
          )}
        </div>
        
        {loadingImages ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="animate-spin h-8 w-8 text-gray-500" />
          </div>
        ) : (
          <ImageGrid 
            images={images} 
            currentFolder={selectedFolder} 
            onImageDeleted={handleRefresh} 
          />
        )}
        
        {!selectedFolder && !loading && (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Select a folder to view images
          </div>
        )}
        
        {selectedFolder && images.length === 0 && !loadingImages && (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No images in this folder
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageManager;

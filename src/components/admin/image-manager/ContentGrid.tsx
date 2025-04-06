
import React from 'react';
import { useImageManager } from './ImageManagerContext';
import FolderGrid from './FolderGrid';
import ImagesGrid from './ImagesGrid';
import { ImageFolder, ImageMetadata } from '@/types/images';

const ContentGrid: React.FC = () => {
  const { 
    subfolders, 
    images, 
    navigateToFolder, 
    getImageUrl, 
    viewImage 
  } = useImageManager();

  // Convert ImageFolder type from types/images to match what FolderGrid expects
  const convertedFolders: any[] = subfolders.map(folder => ({
    ...folder,
    parentId: folder.parent_id
  }));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {/* Display Folders */}
      <FolderGrid 
        folders={convertedFolders}
        onFolderClick={navigateToFolder} 
      />
      
      {/* Display Images */}
      <ImagesGrid 
        images={images} 
        getImageUrl={(name) => getImageUrl(name)}
        onImageClick={(name) => viewImage(getImageUrl(name))}
      />
    </div>
  );
};

export default ContentGrid;

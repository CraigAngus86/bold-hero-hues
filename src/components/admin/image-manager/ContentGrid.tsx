
import { useImageManager } from './ImageManagerContext';
import FolderGrid from './FolderGrid';
import ImagesGrid from './ImagesGrid';

const ContentGrid = () => {
  const { 
    subfolders, 
    images, 
    navigateToFolder, 
    getImageUrl, 
    viewImage 
  } = useImageManager();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {/* Display Folders */}
      <FolderGrid 
        folders={subfolders} 
        onFolderClick={navigateToFolder} 
      />
      
      {/* Display Images */}
      <ImagesGrid 
        images={images} 
        getImageUrl={getImageUrl}
        onImageClick={viewImage}
      />
    </div>
  );
};

export default ContentGrid;

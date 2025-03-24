
import { ImageManagerProvider } from './ImageManagerContext';
import ImageManagerHeader from './ImageManagerHeader';
import BreadcrumbNavigation from './BreadcrumbNavigation';
import NavigationControls from './NavigationControls';
import ContentGrid from './ContentGrid';
import NewFolderDialog from './NewFolderDialog';
import ImagePreviewDialog from './ImagePreviewDialog';
import { useImageManager } from './ImageManagerContext';

const ImageManagerContent = () => {
  const { 
    breadcrumbs, 
    navigateToBreadcrumb,
    newFolderDialogOpen,
    setNewFolderDialogOpen,
    createNewFolder,
    imageDialogOpen,
    setImageDialogOpen,
    selectedImage
  } = useImageManager();

  return (
    <div className="space-y-4">
      <ImageManagerHeader />
      
      {/* Breadcrumb Navigation */}
      <BreadcrumbNavigation 
        breadcrumbs={breadcrumbs} 
        onNavigate={navigateToBreadcrumb} 
      />
      
      {/* Back button */}
      <NavigationControls />
      
      {/* Content Grid (Folders and Images) */}
      <ContentGrid />
      
      {/* New Folder Dialog */}
      <NewFolderDialog 
        open={newFolderDialogOpen}
        onOpenChange={setNewFolderDialogOpen}
        onCreateFolder={createNewFolder}
      />
      
      {/* Image Preview Dialog */}
      <ImagePreviewDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        imageUrl={selectedImage}
      />
    </div>
  );
};

const ImageManager = () => {
  return (
    <ImageManagerProvider>
      <ImageManagerContent />
    </ImageManagerProvider>
  );
};

export default ImageManager;

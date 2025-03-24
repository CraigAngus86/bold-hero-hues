
import { Button } from '@/components/ui/button';
import { FolderPlus, Upload } from 'lucide-react';
import { Input } from './Input';
import { useImageManager } from './ImageManagerContext';
import ImageUploadUtility from './ImageUploadUtility';

const ImageManagerHeader = () => {
  const { 
    currentFolder, 
    isUploading, 
    setNewFolderDialogOpen, 
    handleFileUpload 
  } = useImageManager();

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
      
      {/* Site image upload utility */}
      <ImageUploadUtility />
    </div>
  );
};

export default ImageManagerHeader;

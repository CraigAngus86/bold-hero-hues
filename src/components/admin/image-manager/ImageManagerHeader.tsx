
import React from 'react';
import { Button } from '@/components/ui/button';
import { FolderPlus, Upload } from 'lucide-react';
import { useImageManager } from './ImageManagerContext';

const ImageManagerHeader: React.FC = () => {
  const { 
    currentFolder, 
    isUploading, 
    setNewFolderDialogOpen, 
    handleFileUpload 
  } = useImageManager();

  // Create a reference to the file input element
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handle the button click to trigger the file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
            <>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*"
                disabled={isUploading}
              />
              <Button 
                variant="default" 
                className="flex items-center"
                disabled={isUploading}
                onClick={handleUploadClick}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Upload Images'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageManagerHeader;

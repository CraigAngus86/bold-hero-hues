
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FolderPlus, 
  Upload, 
  RefreshCw
} from 'lucide-react';
import { ImageFolder } from '@/types/images';
import NewFolderDialog from './NewFolderDialog';
import { createImageFolder } from '@/services/imageService';
import { toast } from 'sonner';

interface FolderActionsProps {
  currentFolder: ImageFolder;
  onRefresh: () => void;
}

const FolderActions: React.FC<FolderActionsProps> = ({ currentFolder, onRefresh }) => {
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCreateFolder = async (folderName: string) => {
    try {
      if (!folderName.trim()) {
        toast.error('Folder name cannot be empty');
        return;
      }

      // Create path for new folder
      const parentPath = currentFolder.path;
      const folderPath = parentPath === '/' 
        ? `/${folderName}` 
        : `${parentPath}/${folderName}`;

      await createImageFolder(folderName, folderPath, currentFolder.id);
      toast.success(`Folder "${folderName}" created`);
      setNewFolderDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const formData = new FormData();
    
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append('files', e.target.files[i]);
    }
    
    formData.append('folder', currentFolder.path);
    
    try {
      // Upload logic would go here
      // For now we just simulate a successful upload
      setTimeout(() => {
        setUploading(false);
        toast.success(`${e.target.files!.length} files uploaded successfully`);
        onRefresh();
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 1500);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onRefresh}
        className="flex items-center"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setNewFolderDialogOpen(true)}
        className="flex items-center"
      >
        <FolderPlus className="mr-2 h-4 w-4" />
        New Folder
      </Button>

      <div className="relative">
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
        <Button
          variant="default"
          size="sm"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center"
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Images'}
        </Button>
      </div>
      
      <NewFolderDialog
        open={newFolderDialogOpen}
        onOpenChange={setNewFolderDialogOpen}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
};

export default FolderActions;

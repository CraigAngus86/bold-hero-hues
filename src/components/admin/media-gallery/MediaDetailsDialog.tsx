
import React, { useState } from 'react';
import { ImageMetadata } from '@/services/images';
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash, Save, FileImage, FileVideo, File as FileIcon } from 'lucide-react';

// Import the new component files
import MediaDetailsHeader from './dialog/MediaDetailsHeader';
import MediaPreviewPanel from './dialog/MediaPreviewPanel';
import MediaEditForm from './dialog/MediaEditForm';
import MediaInfoPanel from './dialog/MediaInfoPanel';
import DeleteConfirmDialog from './dialog/DeleteConfirmDialog';

interface MediaDetailsDialogProps {
  media: ImageMetadata;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMedia: ImageMetadata) => void;
  onDelete: (mediaId: string) => void;
  categories?: string[];
}

const MediaDetailsDialog: React.FC<MediaDetailsDialogProps> = ({
  media,
  isOpen,
  onClose,
  onSave,
  onDelete,
  categories = [],
}) => {
  const [editedMedia, setEditedMedia] = useState<ImageMetadata>(media);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  
  // Handle input changes
  const handleChange = (field: keyof ImageMetadata, value: any) => {
    setEditedMedia({
      ...editedMedia,
      [field]: value,
    });
  };
  
  // Handle saving changes
  const handleSave = () => {
    onSave(editedMedia);
    onClose();
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Add a new tag
  const addTag = () => {
    if (!newTag.trim()) return;
    
    const tags = [...(editedMedia.tags || [])];
    if (!tags.includes(newTag.trim().toLowerCase())) {
      tags.push(newTag.trim().toLowerCase());
      handleChange('tags', tags);
    }
    setNewTag('');
  };
  
  // Remove a tag
  const removeTag = (tag: string) => {
    const tags = editedMedia.tags?.filter(t => t !== tag) || [];
    handleChange('tags', tags);
  };
  
  // Handle pressing Enter in the tag input
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  // Determine the appropriate icon for the media type
  const getMediaTypeIcon = () => {
    if (editedMedia.type.startsWith('image/')) {
      return <FileImage className="h-5 w-5" />;
    } else if (editedMedia.type.startsWith('video/')) {
      return <FileVideo className="h-5 w-5" />;
    } else {
      return <FileIcon className="h-5 w-5" />;
    }
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl">
          <MediaDetailsHeader />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MediaPreviewPanel media={editedMedia} />
            
            <MediaEditForm 
              media={media}
              editedMedia={editedMedia}
              onFieldChange={handleChange}
              categories={categories}
              newTag={newTag}
              setNewTag={setNewTag}
              addTag={addTag}
              removeTag={removeTag}
              handleTagKeyPress={handleTagKeyPress}
            />
          </div>
          
          <Separator className="my-4" />
          
          <MediaInfoPanel 
            media={editedMedia} 
            mediaTypeIcon={getMediaTypeIcon()} 
            formatDate={formatDate}
          />
          
          <DialogFooter className="gap-2">
            <Button 
              variant="destructive" 
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => {
          onDelete(editedMedia.id);
          setIsDeleteDialogOpen(false);
        }}
        mediaName={editedMedia.name}
      />
    </>
  );
};

export default MediaDetailsDialog;

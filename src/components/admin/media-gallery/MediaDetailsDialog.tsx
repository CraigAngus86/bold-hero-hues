
import React, { useState } from 'react';
import { ImageMetadata } from '@/services/images';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { FileImage, FileVideo, File as FileIcon, Trash, Save, Calendar, Clock, Paintbrush, Tag as TagIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
          <DialogHeader>
            <DialogTitle>Media Details</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-square bg-muted rounded-md overflow-hidden flex items-center justify-center">
              {editedMedia.type.startsWith('image/') ? (
                <img
                  src={editedMedia.url}
                  alt={editedMedia.alt_text || editedMedia.name}
                  className="w-full h-full object-contain"
                />
              ) : editedMedia.type.startsWith('video/') ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <FileVideo className="h-16 w-16 text-gray-400" />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={editedMedia.name || ''} 
                  onChange={(e) => handleChange('name', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Alt Text</label>
                <Input 
                  value={editedMedia.alt_text || ''} 
                  onChange={(e) => handleChange('alt_text', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={editedMedia.description || ''} 
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Badge 
                      key={category}
                      variant={editedMedia.categories?.includes(category) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const current = editedMedia.categories || [];
                        const updated = current.includes(category)
                          ? current.filter(c => c !== category)
                          : [...current, category];
                        handleChange('categories', updated);
                      }}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {editedMedia.tags?.map(tag => (
                    <Badge 
                      key={tag}
                      variant="secondary"
                      className="gap-1"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1">
                        ×
                      </button>
                    </Badge>
                  ))}
                  
                  {(editedMedia.tags?.length || 0) === 0 && (
                    <span className="text-xs text-muted-foreground">No tags</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Input 
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Add a tag"
                  />
                  <Button type="button" onClick={addTag}>Add</Button>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground flex items-center gap-1">
                {getMediaTypeIcon()} Type
              </span>
              <p className="font-medium">{editedMedia.type}</p>
            </div>
            
            <div>
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Created
              </span>
              <p className="font-medium">{formatDate(editedMedia.createdAt)}</p>
            </div>
            
            <div>
              <span className="text-muted-foreground flex items-center gap-1">
                <Paintbrush className="h-4 w-4" /> Dimensions
              </span>
              <p className="font-medium">
                {editedMedia.dimensions 
                  ? `${editedMedia.dimensions.width}×${editedMedia.dimensions.height}` 
                  : editedMedia.width && editedMedia.height 
                    ? `${editedMedia.width}×${editedMedia.height}`
                    : 'Unknown'}
              </p>
            </div>
            
            <div>
              <span className="text-muted-foreground flex items-center gap-1">
                <TagIcon className="h-4 w-4" /> Size
              </span>
              <p className="font-medium">
                {Math.round(editedMedia.size / 1024)} KB
              </p>
            </div>
          </div>
          
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
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{editedMedia.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              onDelete(editedMedia.id);
              setIsDeleteDialogOpen(false);
            }} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MediaDetailsDialog;

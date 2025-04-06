
import React, { useState, useEffect } from 'react';
import { ImageMetadata, updateImageMetadata } from '@/services/images';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { X, FileImage, FileVideo, Info, Trash, Download, PenLine, Tag, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface MediaDetailsDialogProps {
  media: ImageMetadata;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (updatedMedia: ImageMetadata) => void;
}

interface MediaFormData {
  altText: string;
  description: string;
  isFeatured: boolean;
  caption: string;
  tags: string[];
}

const MediaDetailsDialog: React.FC<MediaDetailsDialogProps> = ({
  media,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [tagInput, setTagInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isImage = media.type.startsWith('image/');
  const isVideo = media.type.startsWith('video/');
  
  // Initialize form
  const form = useForm<MediaFormData>({
    defaultValues: {
      altText: media.alt_text || '',
      description: media.description || '',
      isFeatured: false,
      caption: '',
      tags: media.tags || [],
    },
  });

  // Reset form when media changes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        altText: media.alt_text || '',
        description: media.description || '',
        isFeatured: false,
        caption: '',
        tags: media.tags || [],
      });
      setIsEditing(false);
    }
  }, [media, isOpen, form]);

  // Format creation date
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'PPP p');
    } catch (e) {
      return 'Unknown date';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && !form.getValues().tags.includes(tagInput.trim())) {
      const updatedTags = [...form.getValues().tags, tagInput.trim()];
      form.setValue('tags', updatedTags);
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tag: string) => {
    const updatedTags = form.getValues().tags.filter(t => t !== tag);
    form.setValue('tags', updatedTags);
  };

  // Handle form submission
  const onSubmit = async (data: MediaFormData) => {
    setIsSaving(true);
    
    try {
      // Update metadata in Supabase
      const { success, error } = await updateImageMetadata(
        media.bucketType,
        media.url.split('/').pop() || '', // Extract the path from the URL
        {
          alt_text: data.altText,
          description: data.description,
          tags: data.tags,
        }
      );
      
      if (success) {
        toast.success("Media details updated successfully");
        
        // Update local state with new values
        const updatedMedia = {
          ...media,
          alt_text: data.altText,
          description: data.description,
          tags: data.tags
        };
        
        if (onUpdate) {
          onUpdate(updatedMedia);
        }
        
        setIsEditing(false);
      } else {
        toast.error(`Failed to update: ${error}`);
      }
    } catch (err) {
      console.error('Error updating media:', err);
      toast.error("Failed to update media details");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    toast("Delete functionality will be implemented in a future update");
  };

  const handleDownload = () => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = media.url;
    link.download = media.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 max-h-[80vh] overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditing ? 'Edit Media Details' : 'Media Details'}</span>
            <DialogClose className="rounded-full h-6 w-6 flex items-center justify-center">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[calc(80vh-120px)] overflow-auto p-6">
          {/* Media preview */}
          <div className="flex flex-col h-full">
            <div className="bg-muted rounded-md flex items-center justify-center overflow-hidden mb-4" style={{ minHeight: '200px' }}>
              {isImage ? (
                <img
                  src={media.url}
                  alt={media.alt_text || media.name}
                  className="max-w-full max-h-[400px] object-contain"
                />
              ) : isVideo ? (
                <video
                  src={media.url}
                  controls
                  className="max-w-full max-h-[400px]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8">
                  <FileImage className="h-16 w-16 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Preview not available</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">File Information</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Name:</strong> {media.name}</p>
                <p><strong>Type:</strong> {media.type}</p>
                <p><strong>Size:</strong> {formatFileSize(media.size)}</p>
                <p><strong>Uploaded:</strong> {formatDate(media.createdAt)}</p>
                
                {media.dimensions && (
                  <p><strong>Dimensions:</strong> {media.dimensions.width} x {media.dimensions.height}</p>
                )}
              </div>
            </div>
          </div>

          {/* Media details */}
          <div className="space-y-4">
            <Tabs defaultValue="details">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="usage" className="flex-1">Usage</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                {isEditing ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="altText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alt Text</FormLabel>
                            <FormControl>
                              <Input placeholder="Describe this image" {...field} />
                            </FormControl>
                            <FormDescription>
                              Describe the image for accessibility purposes
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter a description" 
                                className="resize-none"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="caption"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Caption</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter caption" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tags"
                        render={() => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {form.getValues().tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="px-2 py-1">
                                  {tag}
                                  <X
                                    className="h-3 w-3 ml-1 cursor-pointer"
                                    onClick={() => removeTag(tag)}
                                  />
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a tag"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                              />
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleAddTag}
                              >
                                <Plus size={16} />
                              </Button>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div>
                              <FormLabel>Featured</FormLabel>
                              <FormDescription>
                                Mark this media as featured
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          disabled={isSaving}
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Alt Text</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8"
                          onClick={() => setIsEditing(true)}
                        >
                          <PenLine size={14} className="mr-1" /> Edit
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {media.alt_text || "No alt text provided"}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Description</h3>
                      <p className="text-sm text-muted-foreground">
                        {media.description || "No description provided"}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Tags</h3>
                      <div className="flex flex-wrap gap-1">
                        {media.tags && media.tags.length > 0 ? (
                          media.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No tags added</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="usage" className="pt-4">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-md flex items-center justify-center">
                    <Info size={16} className="text-muted-foreground mr-2" />
                    <p className="text-sm text-muted-foreground">
                      Usage tracking will be implemented in a future update.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter className="p-4 border-t">
          <div className="flex justify-between w-full">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash size={16} className="mr-2" /> Delete
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download size={16} className="mr-2" /> Download
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaDetailsDialog;

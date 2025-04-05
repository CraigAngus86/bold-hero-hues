
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

export function useImageOperations() {
  const { toast } = useToast();
  const [images, setImages] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch images for the current folder
  const fetchImagesForFolder = async (folderPath: string) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('images')
        .list(folderPath, {
          sortBy: { column: 'name', order: 'asc' }
        });
      
      if (error) throw error;
      
      if (data) {
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Failed to load images",
        description: "There was a problem loading the images.",
        variant: "destructive"
      });
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, currentFolder: string | null) => {
    if (!currentFolder) {
      toast({
        title: "No folder selected",
        description: "Please select a folder before uploading images.",
        variant: "destructive"
      });
      return;
    }
    
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    let successCount = 0;
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${currentFolder}/${fileName}`;
        
        const { error } = await supabase
          .storage
          .from('images')
          .upload(filePath, file);
        
        if (error) {
          console.error('Error uploading file:', error);
          continue;
        }
        
        successCount++;
      }
      
      // Refresh images list
      fetchImagesForFolder(currentFolder);
      
      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${successCount} of ${files.length} images.`
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading one or more images.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  // Get public URL for an image
  const getImageUrl = (currentFolder: string | null, fileName: string) => {
    if (!currentFolder) return '';
    const { data } = supabase
      .storage
      .from('images')
      .getPublicUrl(`${currentFolder}/${fileName}`);
    
    return data.publicUrl;
  };

  return {
    images,
    isUploading,
    selectedImage,
    setSelectedImage,
    fetchImagesForFolder,
    handleFileUpload,
    getImageUrl
  };
}

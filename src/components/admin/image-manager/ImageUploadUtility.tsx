
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const SITE_IMAGES = [
  '/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png',
  '/lovable-uploads/0617ed5b-43b8-449c-870e-5bba374f7cb4.png',
  '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png',
  '/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png',
  '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
  '/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png',
  '/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png',
  '/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png',
  '/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png',
  '/lovable-uploads/8f2cd33f-1e08-494a-9aaa-65792ee9418a.png',
  '/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png',
  '/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png',
  '/lovable-uploads/b937e144-e94f-4e75-881f-1e560c6b520a.png',
  '/lovable-uploads/ba4e2b09-12ed-48ad-a4ba-1162ab87ad70.png',
  '/lovable-uploads/banks-o-dee-dark-logo.png',
  '/lovable-uploads/banks-o-dee-logo.png',
  '/lovable-uploads/c5b46adc-8c4c-4b59-9a27-4ec841222d92.png',
  '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png',
  '/lovable-uploads/e2efc1b0-1c8a-4e98-9826-3030a5f5d247.png'
];

const ImageUploadUtility = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: SITE_IMAGES.length });

  const uploadImagesToMisc = async () => {
    // Check if misc folder exists first
    const { data: folders, error: folderError } = await supabase
      .from('image_folders')
      .select('*')
      .eq('name', 'Misc');
    
    if (folderError) {
      toast({
        title: "Error fetching Misc folder",
        description: folderError.message,
        variant: "destructive"
      });
      return;
    }
    
    if (!folders || folders.length === 0) {
      toast({
        title: "Misc folder not found",
        description: "Please ensure the Misc folder exists before uploading.",
        variant: "destructive"
      });
      return;
    }
    
    const miscFolder = folders[0];
    setIsUploading(true);
    setProgress({ current: 0, total: SITE_IMAGES.length });
    
    let successCount = 0;
    
    try {
      for (let i = 0; i < SITE_IMAGES.length; i++) {
        const imagePath = SITE_IMAGES[i];
        // Extract the file name from the path
        const fileName = imagePath.split('/').pop() || '';
        
        // Fetch the image file
        const response = await fetch(imagePath);
        if (!response.ok) {
          console.error(`Failed to fetch image: ${imagePath}`);
          continue;
        }
        
        const imageBlob = await response.blob();
        const fileExt = fileName.split('.').pop() || 'png';
        const newFileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${miscFolder.path}/${newFileName}`;
        
        // Upload to Supabase storage
        const { error: uploadError } = await supabase
          .storage
          .from('images')
          .upload(filePath, imageBlob);
        
        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          continue;
        }
        
        successCount++;
        setProgress(prev => ({ ...prev, current: i + 1 }));
      }
      
      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${successCount} of ${SITE_IMAGES.length} images to Misc folder.`
      });
    } catch (error: any) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was a problem uploading the images.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="my-4">
      <Button 
        variant="outline" 
        className="flex items-center"
        onClick={uploadImagesToMisc}
        disabled={isUploading}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isUploading 
          ? `Uploading ${progress.current}/${progress.total}...` 
          : 'Upload Site Images to Misc Folder'}
      </Button>
      {isUploading && (
        <div className="mt-2 text-sm text-gray-500">
          Please wait while the images are being uploaded...
        </div>
      )}
    </div>
  );
};

export default ImageUploadUtility;

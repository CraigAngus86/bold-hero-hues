
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploaderProps {
  currentImage: string;
  onImageChange: (imagePath: string) => void;
}

const ImageUploader = ({ currentImage, onImageChange }: ImageUploaderProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  // For demo purposes, we'll simulate image uploads with a delay
  // and use some pre-defined image paths
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image should be less than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // In a real app, we would upload to a server or cloud storage
      // For demo, use a random image from the uploads folder
      const mockImages = [
        "/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png",
        "/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png",
        "/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png",
        "/lovable-uploads/e2efc1b0-1c8a-4e98-9826-3030a5f5d247.png"
      ];
      
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      onImageChange(randomImage);
      
      setIsUploading(false);
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully"
      });
    }, 1500);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {currentImage ? (
            <div className="relative w-24 h-24 border rounded-md overflow-hidden">
              <img 
                src={currentImage} 
                alt="Selected image" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-gray-100 border rounded-md flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <Label htmlFor="image-upload" className="block text-sm font-medium mb-1">
            Upload Image
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="flex-1"
              disabled={isUploading}
            />
            <Button type="button" size="sm" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload'}
              {!isUploading && <Upload className="ml-2 h-4 w-4" />}
            </Button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: JPG, PNG, GIF. Max size: 5MB
          </p>
          {currentImage && (
            <p className="mt-1 text-xs text-gray-700 truncate">
              Current: {currentImage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;

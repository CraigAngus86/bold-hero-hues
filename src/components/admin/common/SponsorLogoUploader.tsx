
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { BucketType } from '@/types/system/images';

export interface SponsorLogoUploaderProps {
  initialImageUrl?: string | null;
  sponsorName?: string;
  onUploadComplete?: (url: string) => void;
}

const SponsorLogoUploader: React.FC<SponsorLogoUploaderProps> = ({
  initialImageUrl = null,
  sponsorName = '',
  onUploadComplete
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // File validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB
      toast.error('Image must be less than 2MB');
      return;
    }
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Simulate upload
    simulateUpload(file);
  };
  
  const simulateUpload = async (file: File) => {
    setIsUploading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a mock URL that would come from the storage service
    const fileName = sponsorName 
      ? `${sponsorName.toLowerCase().replace(/\s+/g, '-')}-logo-${Date.now()}.png`
      : `sponsor-logo-${Date.now()}.png`;
      
    const mockUrl = `https://example.com/storage/sponsors/${fileName}`;
    
    // Call the callback with the URL
    if (onUploadComplete) {
      onUploadComplete(mockUrl);
    }
    
    setIsUploading(false);
    toast.success('Logo uploaded successfully');
  };
  
  const handleRemove = () => {
    setPreviewUrl(null);
    // Notify parent component if needed
    if (onUploadComplete) {
      onUploadComplete('');
    }
  };
  
  return (
    <div className="space-y-4">
      {previewUrl ? (
        <div className="relative border rounded-md overflow-hidden aspect-video flex items-center justify-center bg-gray-100">
          <img 
            src={previewUrl} 
            alt="Sponsor logo" 
            className="max-h-[200px] max-w-full object-contain"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center space-y-2 bg-gray-50 hover:bg-gray-100 transition-colors">
          <ImageIcon className="h-8 w-8 text-gray-400" />
          <div className="text-center">
            <p className="text-sm font-medium">Upload sponsor logo</p>
            <p className="text-xs text-gray-500">PNG, JPG or SVG (max. 2MB)</p>
          </div>
          <Button 
            type="button" 
            variant="secondary" 
            size="sm"
            onClick={() => document.getElementById('sponsor-logo-upload')?.click()}
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
          <input 
            id="sponsor-logo-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
};

export default SponsorLogoUploader;

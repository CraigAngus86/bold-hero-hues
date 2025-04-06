
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useImageUpload } from '@/services/images';
import { BucketType } from '@/services/images/types';

interface SponsorLogoUploaderProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  sponsorName?: string;
  initialImageUrl?: string;
}

const SponsorLogoUploader: React.FC<SponsorLogoUploaderProps> = ({ 
  currentUrl, 
  onUpload, 
  sponsorName = 'Sponsor',
  initialImageUrl
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || initialImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadFile } = useImageUpload({
    bucket: BucketType.SPONSORS,
    folderPath: 'logos'
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.includes('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }
    
    setSelectedFile(file);
    const fileURL = URL.createObjectURL(file);
    setPreviewUrl(fileURL);
  };
  
  const handleUploadClick = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      const result = await uploadFile(selectedFile, {
        alt_text: `${sponsorName || 'Sponsor'} logo`,
        description: `Logo for ${sponsorName || 'sponsor'}`
      });
      
      if (result.success && result.data && result.data.url) {
        toast.success('Logo uploaded successfully');
        onUpload(result.data.url);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      toast.error('Failed to upload logo: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };
  
  const clearSelection = () => {
    if (previewUrl && !(currentUrl && previewUrl === currentUrl)) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(currentUrl || initialImageUrl || null);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl}
              alt={`${sponsorName || 'Sponsor'} logo`}
              className="w-full h-auto object-contain max-h-48 rounded border border-gray-200"
            />
            {selectedFile && (
              <div className="mt-4 flex gap-2">
                <Button 
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? 'Uploading...' : 'Save Logo'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={clearSelection}
                  disabled={isUploading}
                  size="icon"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {!selectedFile && !currentUrl && !initialImageUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-2 right-2 bg-white"
                onClick={clearSelection}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-4">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-center">
              <Label 
                htmlFor="logo-upload" 
                className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
              >
                Click to upload
              </Label>
              <p className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </div>
            <input 
              id="logo-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SponsorLogoUploader;

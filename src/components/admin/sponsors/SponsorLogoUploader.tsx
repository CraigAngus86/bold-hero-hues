
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface SponsorLogoUploaderProps {
  logoUrl: string;
  onUpload: (url: string) => void;
}

const SponsorLogoUploader: React.FC<SponsorLogoUploaderProps> = ({ logoUrl, onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(logoUrl || null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.includes('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Create local preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    
    try {
      setIsUploading(true);
      
      // Simulate upload for now - in a real app, you'd upload to storage
      // const uploadedUrl = await uploadSponsorLogo(file);
      // For demo purposes, we'll just use the local preview URL
      const uploadedUrl = previewUrl;
      
      onUpload(uploadedUrl);
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemove = () => {
    setPreview(null);
    onUpload('');
  };
  
  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative w-40 h-40 mx-auto">
          <img 
            src={preview} 
            alt="Logo Preview" 
            className="w-full h-full object-contain border rounded"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-1 right-1"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-4">Upload sponsor logo</p>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="max-w-xs"
          />
        </div>
      )}
      
      {isUploading && (
        <div className="text-center">
          <p className="text-sm text-gray-500">Uploading...</p>
        </div>
      )}
    </div>
  );
};

export default SponsorLogoUploader;

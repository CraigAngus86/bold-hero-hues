
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';
import { BucketType } from '@/types/system';

interface ImageUploaderProps {
  bucket?: BucketType;
  folderPath?: string;
  onComplete?: (url: string) => void;
  className?: string;
  accept?: string;
  maxSize?: number;
}

export default function ImageUploader({ 
  bucket = BucketType.GENERAL,
  folderPath = '',
  onComplete,
  className = '',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024 // 5MB default
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize) {
      setError(`File is too large. Maximum size is ${maxSize / 1024 / 1024}MB.`);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // This is a mock upload function - in a real app you'd upload to Supabase or similar
      setTimeout(() => {
        // Simulate upload success with a placeholder URL
        const mockImageUrl = 'https://via.placeholder.com/800x600?text=Uploaded+Image';
        if (onComplete) onComplete(mockImageUrl);
        setIsUploading(false);
        // Reset the file input
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 1500);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`${className} space-y-4`}>
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          onClick={triggerFileInput}
          disabled={isUploading}
          variant="outline"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </>
          )}
        </Button>
        <Input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        <Label className="text-xs text-gray-500">
          Max size: {maxSize / 1024 / 1024}MB
        </Label>
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

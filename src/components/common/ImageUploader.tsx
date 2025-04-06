
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImagePlus, X, Upload, Loader2 } from 'lucide-react';
import { uploadImage } from '@/services/images/api';
import { BucketType } from '@/services/images/types';

interface ImageUploaderProps {
  currentImage?: string | null;
  onImageUploaded: (url: string) => void;
  folder: string;
  maxSizeMB?: number;
  accept?: string[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageUploaded,
  folder = 'news',
  maxSizeMB = 5,
  accept = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [image, setImage] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert to bytes
  
  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Validate file size
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds maximum limit of ${maxSizeMB}MB`);
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      // Upload the file
      const result = await uploadImage(file, folder as BucketType, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 85
      });
      
      if (!result.success || !result.url) {
        throw new Error(result.error || 'Failed to upload image');
      }
      
      // Set the image URL
      setImage(result.url);
      onImageUploaded(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
    } finally {
      setUploading(false);
    }
  }, [folder, maxSizeBytes, maxSizeMB, onImageUploaded]);
  
  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((obj, type) => ({ ...obj, [type]: [] }), {}),
    multiple: false,
    disabled: uploading
  });
  
  // Reset image selection
  const handleClearImage = () => {
    setImage(null);
    onImageUploaded('');
  };
  
  // Handle URL input
  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImage(url);
    onImageUploaded(url);
  };

  return (
    <div className="space-y-4">
      {image ? (
        <div className="relative rounded-md overflow-hidden border">
          <img 
            src={image} 
            alt="Uploaded preview" 
            className="w-full h-48 object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
            onClick={handleClearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors hover:border-primary/50
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
            ${uploading ? 'pointer-events-none opacity-70' : ''}
          `}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <ImagePlus className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="font-medium">Drop image here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {accept.join(', ')} • Max size: {maxSizeMB}MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      
      <div className="flex flex-col space-y-2">
        <p className="text-sm font-medium">Or use image URL:</p>
        <div className="flex space-x-2">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={image || ''}
            onChange={handleUrlInput}
            className="flex-1"
          />
          {image && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;


import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { uploadImage } from '@/services/images';

interface ImageUploaderProps {
  onComplete?: (url: string) => void;
  folder?: string;
  className?: string;
  buttonText?: string;
  accept?: string;
  maxSizeMB?: number;
}

export interface UploadResult {
  success: boolean;
  message?: string;
  url?: string;
  error?: string;
}

export function ImageUploader({
  onComplete,
  folder = 'uploads',
  className = '',
  buttonText = 'Upload Image',
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 5
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const result: UploadResult = await uploadImage(file, { folder });
      
      if (result.success && result.url) {
        setPreview(result.url);
        if (onComplete) {
          onComplete(result.url);
        }
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      
      {!preview ? (
        <div className="flex flex-col items-center">
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            disabled={isUploading}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : buttonText}
          </Button>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>
      ) : (
        <div className="relative rounded-md overflow-hidden border">
          <img
            src={preview}
            alt="Preview"
            className="w-full object-contain max-h-64"
          />
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 rounded-full p-1 h-8 w-8"
            onClick={clearPreview}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

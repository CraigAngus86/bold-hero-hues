
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { useImageUpload } from '@/services/images';
import { BucketType } from '@/types/system';

export interface ImageUploaderProps {
  onUploadComplete?: (url: string) => void;
  isUploading?: boolean;
  setIsUploading?: (value: boolean) => void;
  bucketName?: BucketType;
  folderPath?: string;
  className?: string;
  maxSizeMB?: number;
  acceptedTypes?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadComplete,
  isUploading: externalIsUploading,
  setIsUploading: externalSetIsUploading,
  bucketName = BucketType.GENERAL,
  folderPath = '',
  className = '',
  maxSizeMB = 5,
  acceptedTypes = 'image/jpeg,image/png,image/webp'
}) => {
  const [internalIsUploading, setInternalIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Use either external or internal state
  const isUploading = externalIsUploading !== undefined ? externalIsUploading : internalIsUploading;
  const setIsUploading = externalSetIsUploading || setInternalIsUploading;
  
  const { upload } = useImageUpload({
    bucket: bucketName,
    folderPath,
    onSuccess: (url) => {
      if (onUploadComplete) onUploadComplete(url);
      setIsUploading(false);
    },
    onError: () => {
      setIsUploading(false);
    }
  });
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      alert(`File type not accepted. Please upload one of: ${acceptedTypes}`);
      return;
    }
    
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Start upload
    setIsUploading(true);
    try {
      await upload(file);
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
    }
  };
  
  const handleRemovePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  return (
    <div className={`w-full ${className}`}>
      {previewUrl ? (
        <div className="relative border rounded-md overflow-hidden">
          <img 
            src={previewUrl} 
            alt="Upload preview" 
            className="w-full h-auto object-contain max-h-64"
          />
          {!isUploading && (
            <Button 
              variant="destructive" 
              size="sm" 
              className="absolute top-2 right-2"
              onClick={handleRemovePreview}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept={acceptedTypes}
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <label 
            htmlFor="file-upload"
            className="cursor-pointer w-full flex flex-col items-center"
          >
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-blue-600">Click to upload</span>
            <span className="text-xs text-gray-500 mt-1">
              {acceptedTypes.split(',').map(t => t.replace('image/', '')).join(', ')} (max {maxSizeMB}MB)
            </span>
          </label>
        </div>
      )}
    </div>
  );
};


import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useImageUpload, BucketType } from '@/services/imageService';

interface ImageUploaderProps {
  bucketId: BucketType;
  folderPath?: string;
  onUploadComplete?: (imageUrl: string) => void;
  maxSizeMB?: number;
  acceptedTypes?: string;
  className?: string;
}

export function ImageUploader({
  bucketId,
  folderPath,
  onUploadComplete,
  maxSizeMB = 5,
  acceptedTypes = 'image/*',
  className = '',
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { upload, isUploading, progress } = useImageUpload();
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, []);
  
  const handleFileSelection = (file: File) => {
    if (file.size > maxSizeBytes) {
      toast.error(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }
    
    if (!file.type.match(acceptedTypes.replace('*', ''))) {
      toast.error(`Invalid file type. Please upload ${acceptedTypes.replace('*', 'an image')}.`);
      return;
    }
    
    setSelectedFile(file);
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };
  
  const clearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      const result = await upload(selectedFile, bucketId, folderPath);
      if (result.success && result.data) {
        toast.success('Image uploaded successfully');
        clearSelection();
        onUploadComplete?.(result.data.url);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image');
    }
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4">
        {!previewUrl ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragActive
                ? 'border-primary bg-primary/10'
                : 'border-gray-300 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={handleFileInputChange}
              accept={acceptedTypes}
            />
            <div className="flex flex-col items-center">
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm font-medium">
                Drag & drop or click to upload an image
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {acceptedTypes.replace('*', '')} files up to {maxSizeMB}MB
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="aspect-video relative rounded-md overflow-hidden">
              {selectedFile?.type.startsWith('image/') ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                  <p className="ml-2 text-sm text-gray-500">{selectedFile?.name}</p>
                </div>
              )}
            </div>
            <button
              onClick={clearSelection}
              className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
              aria-label="Remove"
            >
              <X className="h-4 w-4 text-white" />
            </button>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={clearSelection} disabled={isUploading}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading {progress}%
                  </>
                ) : (
                  'Upload'
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ImageUploader;

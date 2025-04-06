
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useImageUpload } from '@/services/images';

interface PlayerImageUploaderProps {
  initialImageUrl?: string;
  onUpload: (url: string) => void;
  playerName?: string;
  className?: string;
}

export function PlayerImageUploader({
  initialImageUrl = '',
  onUpload,
  playerName = '',
  className = '',
}: PlayerImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { upload, isUploading, uploadProgress } = useImageUpload();
  
  const maxSizeMB = 5;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const acceptedTypes = 'image/png,image/jpeg';
  
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
    
    if (!file.type.match(acceptedTypes.replace(/,/g, '|'))) {
      toast.error(`Invalid file type. Please upload a PNG or JPEG image.`);
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
    if (previewUrl && !previewUrl.includes('lovable-uploads')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(initialImageUrl || null);
    setSelectedFile(null);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      const result = await upload(selectedFile, {
        // Use metadata compatible options without folder
        altText: `${playerName || 'Player'} profile image`
      });
      
      if (result.success && result.data) {
        toast.success(`${playerName ? playerName + "'s" : 'Player'} image uploaded successfully`);
        // Use url instead of publicUrl
        onUpload(result.data.url);
        clearSelection();
      }
    } catch (error) {
      console.error('Failed to upload player image:', error);
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
            onClick={() => document.getElementById('playerFileInput')?.click()}
          >
            <input
              id="playerFileInput"
              type="file"
              className="hidden"
              onChange={handleFileInputChange}
              accept={acceptedTypes}
            />
            <div className="flex flex-col items-center">
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm font-medium">
                Drag & drop or click to upload player photo
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG or JPEG files up to {maxSizeMB}MB
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="aspect-square relative rounded-md overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
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
                    Uploading {uploadProgress}%
                  </>
                ) : (
                  'Upload Image'
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PlayerImageUploader;

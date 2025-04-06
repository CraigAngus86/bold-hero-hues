
import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export interface ImageUploaderProps {
  folder?: string;
  onImageUploaded: (url: string) => void;
  currentUrl?: string;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  folder = 'general',
  onImageUploaded,
  currentUrl,
  accept = 'image/jpeg, image/png, image/webp',
  maxSizeMB = 5,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      const files = event.target.files;
      if (!files || files.length === 0) {
        return;
      }
      
      const file = files[0];
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      
      // Validate file size
      if (file.size > maxSizeBytes) {
        throw new Error(`File too large. Maximum size is ${maxSizeMB}MB.`);
      }
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
        
      // Set preview and trigger callback
      setPreview(publicUrl);
      onImageUploaded(publicUrl);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
      // Clear input value to allow uploading same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageUploaded('');
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {preview ? (
        <div className="relative w-full aspect-video bg-gray-100 rounded-md overflow-hidden">
          <img 
            src={preview} 
            alt="Selected" 
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 w-6 h-6 rounded-full opacity-80 hover:opacity-100"
            onClick={removeImage}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()} 
          className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-md w-full aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
        >
          {uploading ? (
            <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload image</p>
              <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
              <p className="text-xs text-gray-400 mt-2">
                Max size: {maxSizeMB}MB
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={uploadImage}
            disabled={uploading}
            className="hidden"
          />
        </div>
      )}
      
      <div className="flex gap-2 w-full">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex-1"
        >
          <Upload className="h-3.5 w-3.5 mr-1.5" />
          {preview ? 'Change' : 'Upload'} Image
        </Button>
      </div>
    </div>
  );
};

export default ImageUploader;


import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useImageUploaderContext } from './ImageUploaderContext';

interface DropZoneProps {
  inputId: string;
}

export const DropZone: React.FC<DropZoneProps> = ({ inputId }) => {
  const { setFile, setPreviewUrl } = useImageUploaderContext();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [setFile, setPreviewUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} id={inputId} />
      <div className="flex flex-col items-center justify-center space-y-2">
        <Upload className="h-8 w-8 text-gray-400" />
        <p className="text-sm font-medium">
          {isDragActive
            ? 'Drop the image here'
            : 'Drag and drop an image, or click to select'}
        </p>
        <p className="text-xs text-gray-500">Supports: JPG, PNG, GIF, WebP up to 5MB</p>
      </div>
    </div>
  );
};


import React from 'react';
import { Upload } from 'lucide-react';
import { DropZoneProps } from './types';

export const DropZone: React.FC<DropZoneProps> = ({
  acceptedTypes,
  maxSizeMB,
  onFileSelected,
  dragActive,
  setDragActive,
  inputId,
}) => {
  const handleDrag = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, [setDragActive]);
  
  const handleDrop = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  }, [setDragActive, onFileSelected]);
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
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
      onClick={() => document.getElementById(inputId)?.click()}
    >
      <input
        id={inputId}
        type="file"
        className="hidden"
        onChange={handleFileInputChange}
        accept={acceptedTypes}
      />
      <div className="flex flex-col items-center">
        <Upload className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm font-medium">
          Drag & drop or click to upload image
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {acceptedTypes.split(',').join(', ')} files up to {maxSizeMB}MB
        </p>
      </div>
    </div>
  );
};

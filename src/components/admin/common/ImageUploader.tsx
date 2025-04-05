
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon, Loader2, Tag } from 'lucide-react';
import { useImageUpload, BucketType, imageUploadConfigs, ImageOptimizationOptions } from '@/services/imageService';

interface ImageUploaderProps {
  type?: 'news' | 'player' | 'sponsor' | 'general';
  initialImageUrl?: string | null;
  folderPath?: string;
  onUploadComplete?: (imageUrl: string) => void;
  className?: string;
  title?: string;
  allowMetadata?: boolean;
  alt?: string;
  description?: string;
  tags?: string[];
  aspectRatio?: 'auto' | 'square' | 'video' | '16:9' | '4:3' | '3:2' | '1:1';
  customSize?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  };
}

export function ImageUploader({
  type = 'general',
  initialImageUrl = null,
  folderPath,
  onUploadComplete,
  className = '',
  title,
  allowMetadata = false,
  alt = '',
  description = '',
  tags = [],
  aspectRatio = 'auto',
  customSize,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState(alt);
  const [imageDescription, setImageDescription] = useState(description);
  const [imageTags, setImageTags] = useState<string[]>(tags);
  const [tagInput, setTagInput] = useState('');
  const { upload, isUploading, progress } = useImageUpload();
  
  // Use config based on image type
  const config = imageUploadConfigs[type];
  const maxSizeMB = config.maxSizeMB;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const acceptedTypes = config.acceptedTypes;
  
  // Customize optimization options if provided
  const optimizationOptions: ImageOptimizationOptions = {
    ...config.optimizationOptions,
    ...(customSize || {})
  };

  // Determine aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
      case '1:1':
        return 'aspect-square';
      case 'video':
      case '16:9':
        return 'aspect-video';
      case '4:3':
        return 'aspect-4/3';
      case '3:2':
        return 'aspect-3/2';
      default:
        return 'aspect-auto';
    }
  };
  
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
      toast.error(`Invalid file type. Please upload a supported image format.`);
      return;
    }
    
    setSelectedFile(file);
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    
    // Set default alt text from filename if not provided
    if (!altText) {
      const fileName = file.name.split('.')[0];
      setAltText(fileName.replace(/-|_/g, ' '));
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };
  
  const clearSelection = () => {
    if (previewUrl && previewUrl !== initialImageUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(initialImageUrl);
    setSelectedFile(null);
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !imageTags.includes(tagInput.trim())) {
      setImageTags([...imageTags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setImageTags(imageTags.filter(tag => tag !== tagToRemove));
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      const metadata = {
        alt_text: altText || selectedFile.name.split('.')[0],
        description: imageDescription,
        tags: imageTags
      };
      
      const result = await upload(
        selectedFile, 
        config.bucket, 
        folderPath,
        true, 
        metadata, 
        optimizationOptions
      );
      
      if (result.success && result.data) {
        toast.success('Image uploaded successfully');
        clearSelection();
        if (onUploadComplete) onUploadComplete(result.data.url);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image');
    }
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4">
        {title && <h3 className="font-medium mb-2">{title}</h3>}
        
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
            onClick={() => document.getElementById(`imageInput-${type}`)?.click()}
          >
            <input
              id={`imageInput-${type}`}
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
        ) : (
          <div className="relative">
            <div className={`relative rounded-md overflow-hidden bg-white ${getAspectRatioClass()}`}>
              <img
                src={previewUrl}
                alt={altText || "Preview"}
                className="w-full h-full object-contain"
              />
            </div>
            <button
              onClick={clearSelection}
              className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
              aria-label="Remove"
            >
              <X className="h-4 w-4 text-white" />
            </button>
            
            {allowMetadata && (
              <div className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="alt-text">Alt Text</Label>
                  <Input
                    id="alt-text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Describe the image for accessibility"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)}
                    placeholder="Additional description (optional)"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex items-center">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Add tags and press Enter"
                      className="flex-grow"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="ml-2"
                      onClick={handleAddTag}
                    >
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {imageTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {imageTags.map((tag, index) => (
                        <div key={index} className="bg-muted px-3 py-1 rounded-full text-sm flex items-center">
                          {tag}
                          <button 
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
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

export default ImageUploader;

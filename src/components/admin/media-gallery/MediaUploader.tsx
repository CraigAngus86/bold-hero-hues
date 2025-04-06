
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { 
  Upload, 
  X, 
  FileImage, 
  FileVideo,
  Image,
  Film,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useImageUpload } from '@/services/images/hooks';
import { BucketType, ImageMetadata, ImageOptimizationOptions } from '@/services/images/types';

interface FileUploadItem {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  metadata: {
    altText: string;
    description: string;
    tags: string[];
    optimizationOptions: ImageOptimizationOptions;
  };
}

const MediaUploader: React.FC = () => {
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [folderPath, setFolderPath] = useState('');
  const [optimizationPreset, setOptimizationPreset] = useState('medium');
  const { upload } = useImageUpload();

  // Image optimization presets
  const optimizationPresets = {
    none: {
      maxWidth: undefined,
      maxHeight: undefined,
      quality: 1,
      preserveAspectRatio: true,
    },
    low: {
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.5,
      preserveAspectRatio: true,
    },
    medium: {
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 0.75,
      preserveAspectRatio: true,
    },
    high: {
      maxWidth: 2048,
      maxHeight: 2048,
      quality: 0.9,
      preserveAspectRatio: true,
    },
  };

  // Process and validate dropped files
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      // Create a preview URL
      let preview = URL.createObjectURL(file);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview,
        status: 'pending' as const,
        progress: 0,
        metadata: {
          altText: '',
          description: '',
          tags: [],
          optimizationOptions: optimizationPresets[optimizationPreset as keyof typeof optimizationPresets],
        }
      };
    });

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, [optimizationPreset]);

  // Configure dropzone
  const { 
    getRootProps, 
    getInputProps, 
    isDragActive,
    open
  } = useDropzone({
    onDrop,
    maxSize: 10485760, // 10MB
    noClick: files.length > 0, // Disable click if files are already added
    accept: {
      'image/*': [],
      'video/*': [],
    }
  });

  // Remove file from the list
  const removeFile = (id: string) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file.id !== id);
      
      // Release object URL to avoid memory leaks
      const fileToRemove = prevFiles.find((file) => file.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      
      return updatedFiles;
    });
  };

  // Update file metadata
  const updateFileMetadata = (id: string, field: string, value: any) => {
    setFiles((prevFiles) => 
      prevFiles.map((file) => {
        if (file.id === id) {
          return {
            ...file,
            metadata: {
              ...file.metadata,
              [field]: value
            }
          };
        }
        return file;
      })
    );
  };

  // Get file extension
  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toUpperCase() || '';
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Upload all files
  const uploadAllFiles = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    // Process files sequentially to avoid overwhelming the server
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.status === 'success') continue;
      
      try {
        // Update status to uploading
        setFiles((prevFiles) => 
          prevFiles.map((f) => 
            f.id === file.id ? { ...f, status: 'uploading' as const } : f
          )
        );
        
        // Upload the file
        const result = await upload(
          file.file,
          'images' as BucketType,
          folderPath || undefined,
          true, // optimize
          {
            alt_text: file.metadata.altText,
            description: file.metadata.description,
            tags: file.metadata.tags.length > 0 ? file.metadata.tags : undefined,
          },
          file.metadata.optimizationOptions
        );
        
        // Update file status based on result
        setFiles((prevFiles) => 
          prevFiles.map((f) => {
            if (f.id === file.id) {
              return { 
                ...f, 
                status: result.success ? 'success' as const : 'error' as const,
                progress: 100,
                error: result.success ? undefined : (result.error as any)?.message || 'Upload failed'
              };
            }
            return f;
          })
        );
        
      } catch (error) {
        console.error('Error uploading file:', error);
        
        setFiles((prevFiles) => 
          prevFiles.map((f) => {
            if (f.id === file.id) {
              return { 
                ...f, 
                status: 'error' as const, 
                error: (error as Error).message || 'Unknown error occurred'
              };
            }
            return f;
          })
        );
      }
    }
    
    setIsUploading(false);
    
    // Check if all uploads were successful
    const successCount = files.filter(f => f.status === 'success').length;
    if (successCount === files.length) {
      toast.success(`Successfully uploaded ${successCount} files`);
    } else if (successCount > 0) {
      toast.info(`Uploaded ${successCount} of ${files.length} files`);
    } else {
      toast.error('Failed to upload files');
    }
  };

  // Clear all files
  const clearAllFiles = () => {
    // Clean up previews
    files.forEach(file => {
      URL.revokeObjectURL(file.preview);
    });
    
    setFiles([]);
  };

  // Count files by status
  const countByStatus = (status: 'pending' | 'uploading' | 'success' | 'error') => {
    return files.filter(file => file.status === status).length;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
            } ${files.length > 0 ? 'h-64 overflow-y-auto' : 'h-96 flex items-center justify-center'}`}
          >
            <input {...getInputProps()} />
            
            {files.length === 0 ? (
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Drag & drop files here
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse your device
                </p>
                <Button onClick={open}>
                  Select Files
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Upload Queue ({files.length})</h3>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={open}>
                      Add Files
                    </Button>
                    <Button size="sm" variant="outline" onClick={clearAllFiles}>
                      Clear All
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {files.map((file) => (
                    <Card key={file.id} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-muted rounded flex items-center justify-center overflow-hidden">
                              {file.file.type.startsWith('image/') ? (
                                <img 
                                  src={file.preview} 
                                  alt="Preview" 
                                  className="h-full w-full object-cover"
                                />
                              ) : file.file.type.startsWith('video/') ? (
                                <Film className="h-6 w-6 text-gray-400" />
                              ) : (
                                <FileImage className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="truncate font-medium text-sm">
                                {file.file.name}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {getFileExtension(file.file.name)} • {formatFileSize(file.file.size)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {file.status === 'pending' && (
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => removeFile(file.id)}
                                className="h-8 w-8"
                              >
                                <X size={16} />
                              </Button>
                            )}
                            {file.status === 'uploading' && (
                              <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            )}
                            {file.status === 'success' && (
                              <Check className="h-5 w-5 text-green-500" />
                            )}
                            {file.status === 'error' && (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </div>
                        
                        {file.status === 'uploading' && (
                          <Progress value={file.progress} className="h-1 mt-2" />
                        )}
                        
                        {file.status === 'error' && (
                          <p className="text-xs text-red-500 mt-1">{file.error}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium">Upload Settings</h3>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Target Folder</Label>
                  <Input
                    placeholder="e.g., news/2025 (optional)"
                    value={folderPath}
                    onChange={(e) => setFolderPath(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Optimization Level</Label>
                  <Select 
                    value={optimizationPreset} 
                    onValueChange={setOptimizationPreset}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select optimization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Original Quality)</SelectItem>
                      <SelectItem value="low">Low (Smaller Size)</SelectItem>
                      <SelectItem value="medium">Medium (Recommended)</SelectItem>
                      <SelectItem value="high">High (Best Quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {files.length > 0 && (
                  <>
                    <Separator />
                    
                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Files to upload:</span>
                        <span>{countByStatus('pending')}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Uploaded:</span>
                        <span className="text-green-500">{countByStatus('success')}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-4">
                        <span>Failed:</span>
                        <span className="text-red-500">{countByStatus('error')}</span>
                      </div>
                      
                      <Button
                        className="w-full"
                        onClick={uploadAllFiles}
                        disabled={isUploading || countByStatus('pending') === 0}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>Upload {countByStatus('pending')} Files</>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          {files.length === 1 && (
            <Card className="mt-4">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">File Metadata</h3>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Alt Text</Label>
                    <Input
                      placeholder="Describe this image"
                      value={files[0].metadata.altText}
                      onChange={(e) => updateFileMetadata(files[0].id, 'altText', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Add a description"
                      value={files[0].metadata.description}
                      onChange={(e) => updateFileMetadata(files[0].id, 'description', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tags (comma separated)</Label>
                    <Input
                      placeholder="e.g., match day, team, news"
                      value={files[0].metadata.tags.join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value
                          .split(',')
                          .map(tag => tag.trim())
                          .filter(tag => tag.length > 0);
                        
                        updateFileMetadata(files[0].id, 'tags', tags);
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaUploader;

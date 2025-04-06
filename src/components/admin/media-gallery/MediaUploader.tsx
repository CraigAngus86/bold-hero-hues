
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  UploadCloud, 
  FileType, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Image as ImageIcon, 
  FileVideo
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock categories for the demo
const mockCategories = [
  { id: '1', name: 'Match Day' },
  { id: '2', name: 'Team' },
  { id: '3', name: 'Stadium' },
  { id: '4', name: 'Fans' },
];

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'queued' | 'uploading' | 'success' | 'error';
  error?: string;
  metadata?: {
    title?: string;
    alt_text?: string;
    description?: string;
    categories?: string[];
    tags?: string[];
  };
}

const MediaUploader: React.FC = () => {
  // State for the file uploads
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [allMetadata, setAllMetadata] = useState({
    categories: [] as string[],
    tags: '' as string,
  });
  
  // Configure the dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => {
      // Generate preview URLs for images
      const preview = file.type.startsWith('image/') 
        ? URL.createObjectURL(file) 
        : file.type.startsWith('video/')
          ? '/video-placeholder.jpg' // Use a placeholder for video previews
          : '/file-placeholder.jpg'; // Use a placeholder for other file types
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview,
        progress: 0,
        status: 'queued' as const,
        metadata: {
          title: file.name.split('.')[0], // Default title is filename without extension
          alt_text: '',
          description: '',
          categories: [],
          tags: [],
        }
      };
    });
    
    setUploadFiles([...uploadFiles, ...newFiles]);
    toast.success(`Added ${acceptedFiles.length} files to upload queue`);
  }, [uploadFiles]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': [],
      'application/pdf': [],
    }
  });
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Update metadata for a specific file
  const updateMetadata = (id: string, field: string, value: any) => {
    setUploadFiles(uploadFiles.map(file => {
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
    }));
  };
  
  // Apply metadata to all files
  const applyMetadataToAll = () => {
    setUploadFiles(uploadFiles.map(file => ({
      ...file,
      metadata: {
        ...file.metadata,
        categories: allMetadata.categories,
        tags: allMetadata.tags ? allMetadata.tags.split(',').map(t => t.trim()) : [],
      }
    })));
    
    toast.success('Metadata applied to all files');
  };
  
  // Remove a file from the upload queue
  const removeFile = (id: string) => {
    setUploadFiles(uploadFiles.filter(file => file.id !== id));
    toast.info('File removed from queue');
  };
  
  // Clear all files from the upload queue
  const clearQueue = () => {
    setUploadFiles([]);
    toast.info('Upload queue cleared');
  };
  
  // Simulate file upload
  const startUpload = async () => {
    if (uploadFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Update all files to uploading status
    setUploadFiles(uploadFiles.map(file => ({
      ...file,
      status: 'uploading',
      progress: 0
    })));
    
    // Simulate uploading each file
    let completed = 0;
    const totalFiles = uploadFiles.length;
    
    for (const file of uploadFiles) {
      // Update this file to uploading status
      setUploadFiles(prevFiles => prevFiles.map(f => 
        f.id === file.id ? { ...f, status: 'uploading' } : f
      ));
      
      // Simulate progress updates
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Update file progress
        setUploadFiles(prevFiles => prevFiles.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ));
      }
      
      // Mark as complete
      setUploadFiles(prevFiles => prevFiles.map(f => 
        f.id === file.id ? { ...f, status: 'success', progress: 100 } : f
      ));
      
      // Update overall progress
      completed++;
      setUploadProgress(Math.floor((completed / totalFiles) * 100));
    }
    
    // All done!
    setIsUploading(false);
    toast.success(`Successfully uploaded ${uploadFiles.length} files`);
  };
  
  // Preview component for each file
  const FilePreview = ({ file }: { file: UploadFile }) => {
    return (
      <Card className="overflow-hidden">
        <div className="relative aspect-square bg-muted">
          {file.status === 'uploading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <Progress value={file.progress} className="w-1/2" />
            </div>
          )}
          
          {file.status === 'success' && (
            <div className="absolute top-2 right-2 z-10">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
          )}
          
          {file.status === 'error' && (
            <div className="absolute top-2 right-2 z-10">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
          )}
          
          {file.file.type.startsWith('image/') ? (
            <img 
              src={file.preview} 
              alt={file.metadata?.alt_text || file.file.name}
              className="w-full h-full object-cover" 
            />
          ) : file.file.type.startsWith('video/') ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <FileVideo className="h-12 w-12 text-gray-400" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileType className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          <button 
            onClick={() => removeFile(file.id)}
            className="absolute top-2 left-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg"
          >
            <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        <CardContent className="p-3">
          <div className="truncate text-sm font-medium">{file.file.name}</div>
          <div className="flex items-center justify-between mt-1">
            <Badge variant="outline" className="text-xs">
              {file.file.type.split('/')[0]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatFileSize(file.file.size)}
            </span>
          </div>
          
          <div className="mt-3">
            <Input
              placeholder="Title"
              value={file.metadata?.title || ''}
              onChange={(e) => updateMetadata(file.id, 'title', e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Alt Text"
              value={file.metadata?.alt_text || ''}
              onChange={(e) => updateMetadata(file.id, 'alt_text', e.target.value)}
              className="mb-2"
            />
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
          <CardDescription>
            Drag and drop files or click to browse. Supported formats: images, videos, and PDFs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-10 cursor-pointer flex flex-col items-center justify-center text-center ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-1">
              {isDragActive ? 'Drop files here' : 'Drag and drop files'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse your device
            </p>
            <Button type="button">Select Files</Button>
          </div>
        </CardContent>
      </Card>
      
      {uploadFiles.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upload Queue</CardTitle>
              <CardDescription>
                {uploadFiles.length} file{uploadFiles.length !== 1 ? 's' : ''} ready to upload
              </CardDescription>
            </div>
            {!isUploading && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearQueue}>
                  Clear All
                </Button>
                <Button onClick={startUpload}>
                  Upload All
                </Button>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="files">
              <TabsList className="mb-4">
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="batch-metadata">Batch Metadata</TabsTrigger>
              </TabsList>
              
              <TabsContent value="files">
                {isUploading && (
                  <div className="mb-6">
                    <p className="mb-2 text-center font-medium">Uploading files...</p>
                    <Progress value={uploadProgress} />
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {uploadFiles.map((file) => (
                    <FilePreview key={file.id} file={file} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="batch-metadata">
                <div className="space-y-4 max-w-xl mx-auto">
                  <div className="space-y-2">
                    <label className="font-medium text-sm">Categories (Apply to all files)</label>
                    <Select 
                      value={allMetadata.categories[0] || ''} 
                      onValueChange={(value) => setAllMetadata({...allMetadata, categories: [value]})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCategories.map(cat => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-medium text-sm">Tags (Apply to all files)</label>
                    <Input 
                      placeholder="Enter tags separated by commas"
                      value={allMetadata.tags}
                      onChange={(e) => setAllMetadata({...allMetadata, tags: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">E.g., match, team, celebration</p>
                  </div>
                  
                  <Button onClick={applyMetadataToAll} className="w-full">
                    Apply to All Files
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaUploader;

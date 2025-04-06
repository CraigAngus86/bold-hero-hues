
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  LucideGalleryVertical, 
  Image, 
  FileImage, 
  SlidersHorizontal,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const OptimizationTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('single');
  const [selectedFormat, setSelectedFormat] = useState('jpeg');
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1200);
  const [maxHeight, setMaxHeight] = useState(1200);
  const [preserveAspectRatio, setPreserveAspectRatio] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  // Images for batch processing (mock data)
  const availableImages = [
    { id: '1', name: 'team-photo-1.jpg', url: '/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png' },
    { id: '2', name: 'stadium-view.jpg', url: '/lovable-uploads/8f2cd33f-1e08-494a-9aaa-65792ee9418a.png' },
    { id: '3', name: 'trophy-celebration.jpg', url: '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png' },
  ];
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  
  // Toggle selection of image for batch processing
  const toggleImageSelection = (id: string) => {
    setSelectedImages(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Process a single image
  const processImage = () => {
    if (!selectedFile) {
      toast.error('Please select an image to optimize');
      return;
    }
    
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate processing
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            toast.success('Image optimized successfully');
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  // Process batch of images
  const processBatchImages = () => {
    if (selectedImages.length === 0) {
      toast.error('Please select at least one image to optimize');
      return;
    }
    
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate processing
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            toast.success(`${selectedImages.length} images optimized successfully`);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  // Clear the selected file
  const clearSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };
  
  // Format bytes to KB/MB
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-[400px]">
          <TabsTrigger value="single">
            <Image className="h-4 w-4 mr-2" />
            Single Image
          </TabsTrigger>
          <TabsTrigger value="batch">
            <LucideGalleryVertical className="h-4 w-4 mr-2" />
            Batch Processing
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Selection and Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Image Selection</CardTitle>
                <CardDescription>
                  Select an image to optimize
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedFile ? (
                  <div>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <FileImage className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label htmlFor="file-upload" className="cursor-pointer font-medium text-primary hover:text-primary/80">
                          Upload an image
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-md overflow-hidden relative">
                      {previewUrl && (
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Name:</strong> {selectedFile.name}</p>
                      <p><strong>Type:</strong> {selectedFile.type}</p>
                      <p><strong>Size:</strong> {formatSize(selectedFile.size)}</p>
                    </div>
                    <Button variant="outline" onClick={clearSelectedFile}>
                      Clear Selection
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Optimization Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Optimization Settings</CardTitle>
                <CardDescription>
                  Configure optimization parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="format">Output Format</Label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="webp">WebP (recommended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="quality">Quality: {quality}%</Label>
                  </div>
                  <Slider 
                    id="quality"
                    min={10} 
                    max={100} 
                    step={5}
                    value={[quality]}
                    onValueChange={(value) => setQuality(value[0])}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Resize Options</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-width">Max Width</Label>
                      <Input
                        id="max-width"
                        type="number"
                        min={100}
                        value={maxWidth}
                        onChange={(e) => setMaxWidth(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="max-height">Max Height</Label>
                      <Input
                        id="max-height"
                        type="number"
                        min={100}
                        value={maxHeight}
                        onChange={(e) => setMaxHeight(parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="aspect-ratio"
                      checked={preserveAspectRatio}
                      onCheckedChange={setPreserveAspectRatio}
                    />
                    <Label htmlFor="aspect-ratio">Preserve aspect ratio</Label>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  disabled={!selectedFile || isProcessing}
                  onClick={processImage}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Optimize Image
                    </>
                  )}
                </Button>
                
                {isProcessing && (
                  <Progress value={processingProgress} className="mt-2" />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="batch" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Batch Image Optimization</CardTitle>
              <CardDescription>
                Select multiple images to optimize with the same settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Selection */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Select Images</h3>
                  
                  <div className="border rounded-md">
                    <div className="p-4 border-b bg-muted/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Available Images</span>
                        <span className="text-sm text-muted-foreground">
                          {selectedImages.length} selected
                        </span>
                      </div>
                    </div>
                    <div className="p-2 max-h-[300px] overflow-y-auto">
                      {availableImages.map((image) => (
                        <div 
                          key={image.id}
                          className="flex items-center p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                          onClick={() => toggleImageSelection(image.id)}
                        >
                          <div className="h-12 w-12 bg-muted rounded overflow-hidden mr-3">
                            <img 
                              src={image.url} 
                              alt={image.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="text-sm font-medium">{image.name}</div>
                          </div>
                          <div>
                            <input 
                              type="checkbox"
                              checked={selectedImages.includes(image.id)}
                              onChange={() => {}} // Handled by parent div onClick
                              className="h-4 w-4"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Batch Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Batch Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="batch-format">Output Format</Label>
                      <Select defaultValue="webp">
                        <SelectTrigger id="batch-format">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jpeg">JPEG</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="webp">WebP (recommended)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Quality: 75%</Label>
                      </div>
                      <Slider defaultValue={[75]} max={100} step={5} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Resize to fit within:</Label>
                      <Select defaultValue="1200">
                        <SelectTrigger>
                          <SelectValue placeholder="Select max dimensions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="800">800 x 800 px</SelectItem>
                          <SelectItem value="1200">1200 x 1200 px</SelectItem>
                          <SelectItem value="1600">1600 x 1600 px</SelectItem>
                          <SelectItem value="2000">2000 x 2000 px</SelectItem>
                          <SelectItem value="original">Original size</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      disabled={selectedImages.length === 0 || isProcessing}
                      onClick={processBatchImages}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing {selectedImages.length} images...
                        </>
                      ) : (
                        <>
                          <SlidersHorizontal className="mr-2 h-4 w-4" />
                          Process {selectedImages.length} Images
                        </>
                      )}
                    </Button>
                    
                    {isProcessing && (
                      <>
                        <Progress value={processingProgress} />
                        <p className="text-xs text-center text-muted-foreground">
                          Processing image {Math.ceil((processingProgress / 100) * selectedImages.length)} of {selectedImages.length}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptimizationTools;

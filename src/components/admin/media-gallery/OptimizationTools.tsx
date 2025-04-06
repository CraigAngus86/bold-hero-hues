
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Check, AlertCircle, Image as ImageIcon, MoveHorizontal, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const OptimizationTools: React.FC = () => {
  // State for compression settings
  const [compressQuality, setCompressQuality] = useState(80);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // State for resize settings
  const [resizeWidth, setResizeWidth] = useState(1200);
  const [resizeHeight, setResizeHeight] = useState(800);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  
  // State for format conversion
  const [targetFormat, setTargetFormat] = useState('webp');
  
  // Simulate bulk optimization
  const runBulkOptimization = async () => {
    setIsOptimizing(true);
    setBulkProgress(0);
    
    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setBulkProgress(i);
    }
    
    setIsOptimizing(false);
    toast.success('Bulk optimization completed');
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="compress">
        <TabsList className="mb-4">
          <TabsTrigger value="compress">Compression</TabsTrigger>
          <TabsTrigger value="resize">Resize</TabsTrigger>
          <TabsTrigger value="convert">Format Conversion</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Processing</TabsTrigger>
        </TabsList>
        
        {/* Compression Tab */}
        <TabsContent value="compress">
          <Card>
            <CardHeader>
              <CardTitle>Image Compression</CardTitle>
              <CardDescription>
                Optimize image file sizes without significant quality loss
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between items-center">
                    <label className="text-sm font-medium">Quality: {compressQuality}%</label>
                    <span className="text-xs text-muted-foreground">
                      {compressQuality < 70 ? 'Low' : compressQuality > 85 ? 'High' : 'Balanced'}
                    </span>
                  </div>
                  <Slider
                    value={[compressQuality]}
                    onValueChange={(values) => setCompressQuality(values[0])}
                    min={30}
                    max={100}
                    step={5}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Lower quality = smaller file size, higher quality = better image
                  </p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="font-medium">Preview Compression</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-gray-400" />
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-medium">Original</span>
                        <Badge variant="outline">2.4 MB</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-gray-400" />
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-medium">Compressed ({compressQuality}%)</span>
                        <Badge variant="outline">
                          {Math.round((2.4 * compressQuality) / 100 * 10) / 10} MB
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4 items-stretch sm:flex-row sm:items-center">
              <Button variant="outline" className="sm:flex-1">
                Upload Image to Compress
              </Button>
              <Button className="sm:flex-1">
                Apply Compression
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Resize Tab */}
        <TabsContent value="resize">
          <Card>
            <CardHeader>
              <CardTitle>Resize Images</CardTitle>
              <CardDescription>
                Change image dimensions to fit your needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Width (px)</label>
                  <Input 
                    type="number" 
                    value={resizeWidth}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setResizeWidth(value);
                      if (maintainAspectRatio) {
                        // Calculate new height based on original aspect ratio (1.5 in this example)
                        setResizeHeight(Math.round(value / 1.5));
                      }
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Height (px)</label>
                  <Input 
                    type="number"
                    value={resizeHeight}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setResizeHeight(value);
                      if (maintainAspectRatio) {
                        // Calculate new width based on original aspect ratio (1.5 in this example)
                        setResizeWidth(Math.round(value * 1.5));
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="maintain-aspect"
                  checked={maintainAspectRatio}
                  onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                  className="rounded border-gray-300 text-primary"
                />
                <label htmlFor="maintain-aspect" className="text-sm">Maintain aspect ratio</label>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="font-medium">Preview Resize</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-md relative flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-gray-400" />
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary">1800 × 1200</Badge>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-medium">Original</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-md relative flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-gray-400" />
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary">{resizeWidth} × {resizeHeight}</Badge>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-medium">Resized</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Resize Presets</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {setResizeWidth(1920); setResizeHeight(1080);}}
                  >
                    Full HD (1920×1080)
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {setResizeWidth(1280); setResizeHeight(720);}}
                  >
                    HD (1280×720)
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {setResizeWidth(800); setResizeHeight(600);}}
                  >
                    Web (800×600)
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {setResizeWidth(400); setResizeHeight(300);}}
                  >
                    Thumbnail (400×300)
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4 items-stretch sm:flex-row sm:items-center">
              <Button variant="outline" className="sm:flex-1">
                Upload Image to Resize
              </Button>
              <Button className="sm:flex-1">
                Apply Resize
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Format Conversion Tab */}
        <TabsContent value="convert">
          <Card>
            <CardHeader>
              <CardTitle>Format Conversion</CardTitle>
              <CardDescription>
                Convert images between different formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Format</label>
                <Select value={targetFormat} onValueChange={setTargetFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webp">WebP (best quality/size ratio)</SelectItem>
                    <SelectItem value="jpg">JPEG (widely compatible)</SelectItem>
                    <SelectItem value="png">PNG (lossless with transparency)</SelectItem>
                    <SelectItem value="avif">AVIF (superior compression)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {targetFormat === 'webp' && 'WebP offers excellent compression with good quality and is supported by most modern browsers.'}
                  {targetFormat === 'jpg' && 'JPEG is widely supported across all browsers and devices but does not support transparency.'}
                  {targetFormat === 'png' && 'PNG provides lossless quality with transparency but results in larger file sizes.'}
                  {targetFormat === 'avif' && 'AVIF offers superior compression but has limited browser support.'}
                </p>
              </div>
              
              <div className="space-y-6">
                <Separator />
                
                <div className="flex flex-col md:flex-row gap-4 items-stretch">
                  <Card className="flex-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Format Comparison</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>JPEG</span>
                          <Badge variant="outline">2.4 MB</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>PNG</span>
                          <Badge variant="outline">4.8 MB</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>WebP</span>
                          <Badge variant="outline">1.2 MB</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>AVIF</span>
                          <Badge variant="outline">0.9 MB</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="flex-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Browser Support</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>JPEG/PNG</span>
                          <span className="text-green-500 flex items-center">
                            <Check className="h-4 w-4 mr-1" /> All browsers
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>WebP</span>
                          <span className="text-green-500 flex items-center">
                            <Check className="h-4 w-4 mr-1" /> 95% of browsers
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>AVIF</span>
                          <span className="text-yellow-500 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" /> 70% of browsers
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4 items-stretch sm:flex-row sm:items-center">
              <Button variant="outline" className="sm:flex-1">
                Upload Image to Convert
              </Button>
              <Button className="sm:flex-1">
                Convert Format
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Bulk Processing Tab */}
        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Image Processing</CardTitle>
              <CardDescription>
                Apply optimization to multiple images at once
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Compress</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <label className="text-sm">Quality</label>
                        <Select defaultValue="80">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="60">Low (60%)</SelectItem>
                            <SelectItem value="80">Medium (80%)</SelectItem>
                            <SelectItem value="90">High (90%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Resize</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <label className="text-sm">Max Width</label>
                        <Select defaultValue="1200">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="800">800px</SelectItem>
                            <SelectItem value="1200">1200px</SelectItem>
                            <SelectItem value="1920">1920px</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Format</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <label className="text-sm">Convert To</label>
                        <Select defaultValue="webp">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="original">Keep Original</SelectItem>
                            <SelectItem value="webp">WebP</SelectItem>
                            <SelectItem value="jpg">JPEG</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Selected Media</h3>
                  <p className="text-sm text-muted-foreground">
                    You haven't selected any media. Go to the Media Library tab and select media items for bulk processing.
                  </p>
                  
                  <Button variant="outline" className="w-full">
                    <MoveHorizontal className="h-4 w-4 mr-2" />
                    Select Media to Process
                  </Button>
                </div>
                
                {isOptimizing && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Processing images...</span>
                      <span className="text-sm text-muted-foreground">{bulkProgress}%</span>
                    </div>
                    <Progress value={bulkProgress} />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={isOptimizing} className="w-full" onClick={runBulkOptimization}>
                {isOptimizing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Start Bulk Processing'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptimizationTools;

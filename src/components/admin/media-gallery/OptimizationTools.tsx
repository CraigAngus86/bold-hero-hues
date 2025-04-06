
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  ImageIcon, 
  Crop, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  Wand2, 
  SlidersHorizontal, 
  RotateCw, 
  Shrink
} from "lucide-react";

const OptimizationTools: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Image Optimization Tools</CardTitle>
          <CardDescription>
            Optimize your images to improve page load speed and reduce bandwidth usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="resize" className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="resize" className="flex items-center gap-2">
                <Maximize className="h-4 w-4" />
                Resize
              </TabsTrigger>
              <TabsTrigger value="crop" className="flex items-center gap-2">
                <Crop className="h-4 w-4" />
                Crop
              </TabsTrigger>
              <TabsTrigger value="compress" className="flex items-center gap-2">
                <Shrink className="h-4 w-4" />
                Compress
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="resize" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Resize Options</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input type="number" id="width" placeholder="Width" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input type="number" id="height" placeholder="Height" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="maintain-aspect" />
                      <Label htmlFor="maintain-aspect">Maintain aspect ratio</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Preset sizes</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <Button variant="outline" size="sm">Thumbnail</Button>
                        <Button variant="outline" size="sm">Small</Button>
                        <Button variant="outline" size="sm">Medium</Button>
                        <Button variant="outline" size="sm">Large</Button>
                        <Button variant="outline" size="sm">HD</Button>
                        <Button variant="outline" size="sm">Custom</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center border rounded-lg p-4">
                  <div className="h-48 w-48 bg-gray-100 rounded flex items-center justify-center mb-4">
                    <ImageIcon className="h-24 w-24 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Select an image from your media library to resize
                  </p>
                  <Button className="mt-4">Select Image</Button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>Apply Changes</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="crop">
              <div className="flex items-center justify-center py-12 text-center">
                <div>
                  <Crop className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    Image cropping feature coming soon
                  </p>
                  <Button disabled>Coming Soon</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="compress" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Compression Options</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="quality">Quality</Label>
                        <span className="text-sm text-muted-foreground">80%</span>
                      </div>
                      <Slider
                        defaultValue={[80]}
                        max={100}
                        step={1}
                        className="py-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        Higher quality means larger file sizes
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Format</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <Button variant="outline" size="sm">JPEG</Button>
                        <Button variant="outline" size="sm">PNG</Button>
                        <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">WebP</Button>
                        <Button variant="outline" size="sm">AVIF</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        WebP and AVIF provide better compression than JPEG and PNG
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center border rounded-lg p-4">
                  <div className="h-48 w-48 bg-gray-100 rounded flex items-center justify-center mb-4">
                    <ImageIcon className="h-24 w-24 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Select an image from your media library to compress
                  </p>
                  <Button className="mt-4">Select Image</Button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>Apply Changes</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Default Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Auto-optimize on upload</h4>
                        <p className="text-sm text-muted-foreground">
                          Automatically optimize images when they are uploaded
                        </p>
                      </div>
                      <Switch id="auto-optimize" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Generate thumbnails</h4>
                        <p className="text-sm text-muted-foreground">
                          Automatically create thumbnails for uploaded images
                        </p>
                      </div>
                      <Switch id="generate-thumbnails" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Convert to WebP</h4>
                        <p className="text-sm text-muted-foreground">
                          Convert images to WebP format for better compression
                        </p>
                      </div>
                      <Switch id="convert-webp" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Lazy loading</h4>
                        <p className="text-sm text-muted-foreground">
                          Enable lazy loading for images on the frontend
                        </p>
                      </div>
                      <Switch id="lazy-loading" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Advanced Options</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-width">Maximum width (px)</Label>
                      <Input type="number" id="max-width" placeholder="1920" defaultValue="1920" />
                      <p className="text-xs text-muted-foreground">
                        Images larger than this will be resized on upload
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="quality-setting">Default quality</Label>
                      <Input type="number" id="quality-setting" placeholder="80" defaultValue="80" />
                      <p className="text-xs text-muted-foreground">
                        Default quality setting for image compression (1-100)
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Thumbnail sizes</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input type="number" placeholder="Width" defaultValue="300" />
                        <Input type="number" placeholder="Height" defaultValue="300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>Save Settings</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Bulk Optimization</CardTitle>
          <CardDescription>
            Optimize multiple images at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Wand2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Bulk Optimize Your Media</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              Select multiple images from your media library to optimize them all at once. 
              This can significantly improve your website's performance.
            </p>
            <Button>Start Bulk Optimization</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizationTools;

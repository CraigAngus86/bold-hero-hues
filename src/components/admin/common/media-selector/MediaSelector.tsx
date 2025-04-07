
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Upload, Link2, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { unwrapPromise } from '@/lib/supabaseHelpers';

interface MediaSelectorProps {
  onSelect: (url: string) => void;
  selectedImage?: string | null;
  currentValue?: string;
  allowExternalUrls?: boolean;
}

export const MediaSelector: React.FC<MediaSelectorProps> = ({
  onSelect,
  selectedImage = null,
  currentValue = '',
  allowExternalUrls = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(selectedImage || currentValue || null);
  const [externalUrl, setExternalUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>(selectedUrl ? 'selected' : 'library');

  // Load media items from Supabase
  const loadMediaItems = async () => {
    setIsLoading(true);
    try {
      const response = await unwrapPromise(
        supabase
          .from('image_metadata')
          .select('*')
          .order('created_at', { ascending: false })
      );
      
      if (response.error) throw response.error;
      setMediaItems(response.data || []);
    } catch (error) {
      console.error('Error loading media:', error);
      toast.error('Failed to load media items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMediaItems();
    }
  }, [isOpen]);

  useEffect(() => {
    // Update the selected URL when the selectedImage prop changes
    if (selectedImage !== null) {
      setSelectedUrl(selectedImage);
    }
  }, [selectedImage]);

  // Filter media items based on search term
  const filteredMedia = searchTerm
    ? mediaItems.filter(item => 
        item.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tags && item.tags.some((tag: string) => 
          tag.toLowerCase().includes(searchTerm.toLowerCase()))))
    : mediaItems;

  const handleSelect = (url: string) => {
    setSelectedUrl(url);
    setActiveTab('selected');
  };

  const handleExternalUrlSelect = () => {
    if (!externalUrl) {
      toast.error('Please enter a URL');
      return;
    }
    
    // Basic URL validation
    try {
      new URL(externalUrl);
      setSelectedUrl(externalUrl);
      setActiveTab('selected');
    } catch (e) {
      toast.error('Please enter a valid URL');
    }
  };

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
    }
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex space-x-2 items-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Select Media
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select Media</DialogTitle>
              <DialogDescription>
                Choose an image from your media library or enter an external URL.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="library">Media Library</TabsTrigger>
                {allowExternalUrls && <TabsTrigger value="external">External URL</TabsTrigger>}
                <TabsTrigger value="selected" disabled={!selectedUrl}>Selected</TabsTrigger>
              </TabsList>
              
              <TabsContent value="library" className="space-y-4">
                <div className="flex justify-between items-center">
                  <Input
                    placeholder="Search media..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Button 
                    variant="outline" 
                    onClick={loadMediaItems}
                    disabled={isLoading}
                  >
                    Refresh
                  </Button>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredMedia.map((item) => (
                      <Card 
                        key={item.id} 
                        className={`cursor-pointer overflow-hidden ${selectedUrl === item.storage_path ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => handleSelect(item.storage_path)}
                      >
                        <CardContent className="p-0">
                          <div className="relative aspect-square">
                            <img 
                              src={item.storage_path} 
                              alt={item.alt_text || item.file_name}
                              className="object-cover w-full h-full"
                            />
                            {selectedUrl === item.storage_path && (
                              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div className="p-2 text-xs truncate">
                            {item.file_name}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {filteredMedia.length === 0 && !isLoading && (
                      <div className="col-span-full py-12 text-center">
                        <p className="text-muted-foreground">No media items found</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              {allowExternalUrls && (
                <TabsContent value="external" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">External Image URL</label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={externalUrl}
                        onChange={(e) => setExternalUrl(e.target.value)}
                      />
                      <Button onClick={handleExternalUrlSelect}>
                        <Link2 className="h-4 w-4 mr-2" />
                        Use URL
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              )}
              
              <TabsContent value="selected">
                {selectedUrl ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="border rounded p-2 max-w-xs">
                      <img 
                        src={selectedUrl} 
                        alt="Selected media"
                        className="max-h-[300px] object-contain"
                      />
                    </div>
                    <Input value={selectedUrl} readOnly />
                  </div>
                ) : (
                  <p className="text-center py-12 text-muted-foreground">
                    No media selected
                  </p>
                )}
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={!selectedUrl}>
                Confirm Selection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {currentValue && (
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 overflow-hidden rounded border">
                <img 
                  src={currentValue} 
                  alt="Selected" 
                  className="h-full w-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Error';
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                {currentValue.split('/').pop()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaSelector;


import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Copy, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNewsStore } from '@/services/newsService';

const ImageGallery = () => {
  const { news } = useNewsStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Get unique images from all news items
  const allImages = news.map(item => item.image);
  const uniqueImages = [...new Set(allImages)].filter(Boolean);
  
  const filteredImages = uniqueImages.filter(image => 
    image.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Image URL has been copied to clipboard"
    });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Image Gallery</h3>
        <div className="relative w-64">
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {filteredImages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <p className="text-gray-500">No images found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredImages.map((image, index) => (
            <div key={index} className="group relative">
              <div 
                className="aspect-square rounded-md overflow-hidden border cursor-pointer hover:border-team-blue transition-colors"
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image} 
                  alt={`Gallery image ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white"
                onClick={() => copyToClipboard(image)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          
          {selectedImage && (
            <div className="space-y-4">
              <div className="bg-[#f5f5f5] rounded-md p-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 truncate mr-2">{selectedImage}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(selectedImage)}
                  >
                    <Copy className="h-3 w-3 mr-2" /> Copy Path
                  </Button>
                </div>
              </div>
              
              <div className="max-h-[calc(80vh-200px)] overflow-auto bg-gray-100 rounded-md flex items-center justify-center">
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallery;

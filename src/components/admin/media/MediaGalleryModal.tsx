
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, List, Search, Upload, X, Loader2 } from 'lucide-react';

// Import mock data for now - in a real app this would come from Supabase or another backend
const mockCategories = ["News", "Team", "Events", "Facilities"];

// Mock media items
const mockMedia = Array(20).fill(0).map((_, i) => ({
  id: `img-${i}`,
  url: `https://picsum.photos/seed/${i}/400/300`,
  title: `Image ${i + 1}`,
  description: `Description for image ${i + 1}`,
  type: 'image',
  category: mockCategories[i % mockCategories.length],
  uploadDate: new Date(Date.now() - i * 86400000).toISOString(),
  fileSize: Math.floor(Math.random() * 1000000),
}));

interface MediaGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (mediaUrl: string) => void;
}

export function MediaGalleryModal({ isOpen, onClose, onSelectMedia }: MediaGalleryModalProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  
  // Filter media based on search and category
  const filteredMedia = mockMedia.filter(item => {
    const matchesSearch = searchTerm 
      ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;
      
    return matchesSearch && matchesCategory;
  });
  
  const handleSelect = () => {
    if (selectedMedia) {
      onSelectMedia(selectedMedia);
      onClose();
    }
  };
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedMedia(null);
      setSearchTerm('');
    }
  }, [isOpen]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Gallery</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4 flex-grow overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full sm:w-[260px]"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {mockCategories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={view === 'grid' ? 'secondary' : 'ghost'}
                  size="icon" 
                  onClick={() => setView('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setView('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-grow pb-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-gray-500 mb-4">No media found matching your criteria</p>
                <Button
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className={
                view === 'grid'
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                  : "flex flex-col gap-2"
              }>
                {filteredMedia.map((media) => (
                  <div
                    key={media.id}
                    className={
                      view === 'grid'
                        ? `aspect-square relative rounded overflow-hidden border-2 cursor-pointer ${selectedMedia === media.url ? 'border-primary' : 'border-transparent hover:border-gray-300'}`
                        : `flex items-center p-2 border rounded cursor-pointer ${selectedMedia === media.url ? 'border-primary bg-primary/10' : 'hover:bg-gray-50'}`
                    }
                    onClick={() => setSelectedMedia(media.url)}
                  >
                    {view === 'grid' ? (
                      <>
                        <img
                          src={media.url}
                          alt={media.title}
                          className="object-cover w-full h-full"
                        />
                        {selectedMedia === media.url && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="bg-white rounded-full p-1">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="text-primary"
                              >
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-3 w-full">
                        <div className="h-12 w-12 relative rounded overflow-hidden flex-shrink-0">
                          <img
                            src={media.url}
                            alt={media.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium">{media.title}</p>
                          <p className="text-xs text-gray-500">{media.category} • {new Date(media.uploadDate).toLocaleDateString()}</p>
                        </div>
                        {selectedMedia === media.url && (
                          <div className="w-6 h-6 flex-shrink-0">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="24" 
                              height="24" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              className="text-primary"
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedMedia}>
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MediaGalleryModal;

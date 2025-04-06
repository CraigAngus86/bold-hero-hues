
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Edit,
  Trash,
  MoreVertical,
  Image,
  MoveUp,
  MoveDown,
  Images,
  Search,
  GridIcon,
  ListIcon,
  Star,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Gallery types
interface Gallery {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string | null;
  itemCount: number;
  createdAt: string;
}

interface GalleryItem {
  id: string;
  url: string;
  name: string;
  type: string;
  isFeatured: boolean;
}

// Initial mock data
const initialGalleries: Gallery[] = [
  {
    id: '1',
    name: 'Highland League Cup Final',
    slug: 'highland-league-cup-final',
    description: 'Photos from the Highland League Cup Final 2025',
    coverImage: '/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png',
    itemCount: 12,
    createdAt: '2025-03-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Stadium Renovation',
    slug: 'stadium-renovation',
    description: 'Progress photos of Spain Park renovation',
    coverImage: '/lovable-uploads/8f2cd33f-1e08-494a-9aaa-65792ee9418a.png',
    itemCount: 8,
    createdAt: '2025-02-20T10:00:00Z',
  },
  {
    id: '3',
    name: 'Team Photos 2025',
    slug: 'team-photos-2025',
    description: 'Official team photos for the 2025 season',
    coverImage: '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
    itemCount: 20,
    createdAt: '2025-01-10T10:00:00Z',
  },
];

const galleryItems: GalleryItem[] = [
  {
    id: '1',
    url: '/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png',
    name: 'Team celebration',
    type: 'image/png',
    isFeatured: true,
  },
  {
    id: '2',
    url: '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
    name: 'Trophy presentation',
    type: 'image/png',
    isFeatured: false,
  },
  {
    id: '3',
    url: '/lovable-uploads/8f2cd33f-1e08-494a-9aaa-65792ee9418a.png',
    name: 'Match action',
    type: 'image/png',
    isFeatured: false,
  },
];

const GalleryManager: React.FC = () => {
  // State
  const [galleries, setGalleries] = useState<Gallery[]>(initialGalleries);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [galleryView, setGalleryView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<GalleryItem[]>(galleryItems);
  
  // Form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  
  // Handle creating a new gallery
  const handleCreateGallery = () => {
    if (!formData.name.trim()) {
      toast.error('Gallery name cannot be empty');
      return;
    }
    
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
      
    const newGallery: Gallery = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      slug,
      description: formData.description,
      coverImage: null,
      itemCount: 0,
      createdAt: new Date().toISOString(),
    };
    
    setGalleries([...galleries, newGallery]);
    setFormData({ name: '', description: '' });
    setIsAddDialogOpen(false);
    toast.success('Gallery created successfully');
  };
  
  // Handle editing a gallery
  const handleEditGallery = (gallery: Gallery) => {
    // This would open an edit dialog in a real implementation
    // For now we'll just navigate to the gallery details
    setSelectedGallery(gallery);
    setActiveTab('details');
  };
  
  // Handle deleting a gallery
  const handleDeleteGallery = (gallery: Gallery) => {
    setGalleries(galleries.filter(g => g.id !== gallery.id));
    toast.success(`Gallery "${gallery.name}" deleted successfully`);
  };
  
  // Handle setting a featured image
  const handleSetFeatured = (itemId: string) => {
    setItems(items.map(item => ({
      ...item,
      isFeatured: item.id === itemId
    })));
    
    toast.success('Featured image updated');
  };
  
  // Handle removing an item from gallery
  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
    toast.success('Item removed from gallery');
  };
  
  // Handle reordering items
  const handleMoveItem = (itemId: string, direction: 'up' | 'down') => {
    const index = items.findIndex(item => item.id === itemId);
    if (index < 0) return;
    
    if (direction === 'up' && index > 0) {
      const newItems = [...items];
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
      setItems(newItems);
    } else if (direction === 'down' && index < items.length - 1) {
      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      setItems(newItems);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="list" onClick={() => setSelectedGallery(null)}>Gallery List</TabsTrigger>
            {selectedGallery && (
              <TabsTrigger value="details">
                {selectedGallery.name}
              </TabsTrigger>
            )}
          </TabsList>
          
          {activeTab === 'list' && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Gallery
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Gallery</DialogTitle>
                  <DialogDescription>
                    Create a new gallery to organize your media items.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="gallery-name">Gallery Name</Label>
                    <Input
                      id="gallery-name"
                      placeholder="Enter gallery name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gallery-description">Description</Label>
                    <Textarea
                      id="gallery-description"
                      placeholder="Enter gallery description"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleCreateGallery}>Create Gallery</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <TabsContent value="list" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <Card key={gallery.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  {gallery.coverImage ? (
                    <img 
                      src={gallery.coverImage} 
                      alt={gallery.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Images className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditGallery(gallery)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteGallery(gallery)}>
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-lg">
                    <button 
                      className="hover:underline text-left"
                      onClick={() => {
                        setSelectedGallery(gallery);
                        setActiveTab('details');
                      }}
                    >
                      {gallery.name}
                    </button>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {gallery.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-4 pb-0">
                  <div className="text-sm text-muted-foreground">
                    {gallery.itemCount} items
                  </div>
                </CardContent>
                
                <CardFooter className="p-4">
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => {
                      setSelectedGallery(gallery);
                      setActiveTab('details');
                    }}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    View Gallery
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-6">
          {selectedGallery && (
            <>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedGallery.name}</h2>
                  <p className="text-muted-foreground mt-1">
                    {selectedGallery.description || 'No description provided'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search in gallery..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button variant="outline" size="icon" onClick={() => setGalleryView(galleryView === 'grid' ? 'list' : 'grid')}>
                    {galleryView === 'grid' ? <ListIcon className="h-4 w-4" /> : <GridIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex flex-col items-center">
                <div className={cn(
                  galleryView === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'w-full'
                )}>
                  {items.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-md">
                      <Images className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No items in this gallery</h3>
                      <p className="text-gray-500 text-center max-w-md mb-4">
                        Add media items from the library to populate this gallery.
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Items
                      </Button>
                    </div>
                  ) : (
                    <>
                      {galleryView === 'grid' ? (
                        // Grid view
                        items.map((item) => (
                          <Card key={item.id} className="overflow-hidden">
                            <div className="aspect-square bg-muted relative">
                              <img 
                                src={item.url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              {item.isFeatured && (
                                <div className="absolute top-2 left-2 bg-yellow-500 text-white p-1 rounded-md">
                                  <Star className="h-3 w-3" />
                                </div>
                              )}
                              <div className="absolute top-2 right-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="icon" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {!item.isFeatured && (
                                      <DropdownMenuItem onClick={() => handleSetFeatured(item.id)}>
                                        <Star className="h-4 w-4 mr-2" />
                                        Set as Featured
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => handleMoveItem(item.id, 'up')}>
                                      <MoveUp className="h-4 w-4 mr-2" />
                                      Move Up
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleMoveItem(item.id, 'down')}>
                                      <MoveDown className="h-4 w-4 mr-2" />
                                      Move Down
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRemoveItem(item.id)}>
                                      <X className="h-4 w-4 mr-2" />
                                      Remove from Gallery
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <CardContent className="p-3">
                              <div className="truncate font-medium text-sm">
                                {item.name}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        // List view
                        <div className="space-y-2 w-full">
                          {items.map((item, index) => (
                            <div 
                              key={item.id}
                              className={cn(
                                "flex items-center gap-3 p-2 rounded-md",
                                item.isFeatured ? "bg-yellow-50 border border-yellow-200" : "hover:bg-gray-50"
                              )}
                            >
                              <div className="flex-shrink-0 w-12 h-12 bg-muted rounded overflow-hidden">
                                <img 
                                  src={item.url}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="font-medium text-sm truncate">
                                  {item.name}
                                  {item.isFeatured && (
                                    <span className="ml-2 inline-flex items-center text-yellow-600 text-xs">
                                      <Star className="h-3 w-3 mr-1" /> Featured
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Position: {index + 1}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                {!item.isFeatured && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleSetFeatured(item.id)}
                                    className="h-8 w-8"
                                  >
                                    <Star className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleMoveItem(item.id, 'up')}
                                  disabled={index === 0}
                                  className="h-8 w-8"
                                >
                                  <MoveUp className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleMoveItem(item.id, 'down')}
                                  disabled={index === items.length - 1}
                                  className="h-8 w-8"
                                >
                                  <MoveDown className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="h-8 w-8 text-red-500 hover:text-red-600"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button onClick={() => toast('Add Media functionality will be implemented in a future update')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Media to Gallery
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GalleryManager;

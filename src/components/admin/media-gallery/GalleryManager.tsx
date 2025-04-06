
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Pencil, 
  Trash, 
  Save, 
  X, 
  Image as ImageIcon, 
  MoveHorizontal
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Types for our gallery data
interface Gallery {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageCount: number;
  featuredImage?: string;
  createdAt: string;
}

// Mock data for galleries
const mockGalleries: Gallery[] = [
  {
    id: '1',
    name: 'Match Day Photos',
    description: 'Photos from recent matches at Spain Park',
    slug: 'match-day-photos',
    imageCount: 24,
    featuredImage: '/lovable-uploads/banks-o-dee-logo.png',
    createdAt: '2024-01-20T12:00:00',
  },
  {
    id: '2',
    name: 'Team Training',
    description: 'Photos from team training sessions',
    slug: 'team-training',
    imageCount: 15,
    featuredImage: '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png',
    createdAt: '2024-02-05T15:30:00',
  },
  {
    id: '3',
    name: 'Stadium Renovation',
    description: 'Documentation of stadium improvements',
    slug: 'stadium-renovation',
    imageCount: 8,
    createdAt: '2024-03-12T09:45:00',
  },
];

// Interface for the new or edited gallery form data
interface GalleryFormData {
  id?: string;
  name: string;
  description: string;
  featuredImage?: string;
}

const GalleryManager: React.FC = () => {
  // State
  const [galleries, setGalleries] = useState<Gallery[]>(mockGalleries);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<GalleryFormData>({ name: '', description: '' });
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  
  // Generate a slug from a gallery name
  const generateSlug = (name: string): string => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  };
  
  // Handle form submission for new gallery
  const handleCreateGallery = () => {
    if (!formData.name.trim()) {
      toast.error('Gallery name is required');
      return;
    }
    
    const newGallery: Gallery = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      description: formData.description,
      slug: generateSlug(formData.name),
      imageCount: 0,
      featuredImage: formData.featuredImage,
      createdAt: new Date().toISOString(),
    };
    
    setGalleries([...galleries, newGallery]);
    setIsAddDialogOpen(false);
    setFormData({ name: '', description: '' });
    toast.success('Gallery created successfully');
  };
  
  // Handle updating an existing gallery
  const handleUpdateGallery = () => {
    if (!selectedGallery || !formData.name.trim()) {
      toast.error('Gallery name is required');
      return;
    }
    
    const updatedGalleries = galleries.map(gallery => {
      if (gallery.id === selectedGallery.id) {
        return {
          ...gallery,
          name: formData.name,
          description: formData.description,
          slug: generateSlug(formData.name),
          featuredImage: formData.featuredImage || gallery.featuredImage,
        };
      }
      return gallery;
    });
    
    setGalleries(updatedGalleries);
    setSelectedGallery(null);
    setEditMode(false);
    toast.success('Gallery updated successfully');
  };
  
  // Handle deleting a gallery
  const handleDeleteGallery = () => {
    if (!selectedGallery) return;
    
    setGalleries(galleries.filter(gallery => gallery.id !== selectedGallery.id));
    setIsDeleteDialogOpen(false);
    setSelectedGallery(null);
    toast.success('Gallery deleted successfully');
  };
  
  // Start editing a gallery
  const startEditGallery = (gallery: Gallery) => {
    setSelectedGallery(gallery);
    setFormData({
      id: gallery.id,
      name: gallery.name,
      description: gallery.description,
      featuredImage: gallery.featuredImage,
    });
    setEditMode(true);
  };
  
  // Format the date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Open the add dialog
  const openAddDialog = () => {
    setFormData({ name: '', description: '' });
    setIsAddDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="all">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <TabsList>
            <TabsTrigger value="all">All Galleries</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
          
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" /> Create Gallery
          </Button>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          {galleries.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No galleries yet</h3>
                <p className="text-gray-500 mb-4">Create your first gallery to organize your media.</p>
                <Button onClick={openAddDialog}>Create Gallery</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Galleries</CardTitle>
                <CardDescription>Manage your media galleries</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Slug</TableHead>
                      <TableHead className="text-center">Images</TableHead>
                      <TableHead className="hidden md:table-cell">Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {galleries.map(gallery => (
                      <TableRow key={gallery.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              {gallery.featuredImage ? (
                                <img 
                                  src={gallery.featuredImage} 
                                  alt={gallery.name} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <ImageIcon className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{gallery.name}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {gallery.description || 'No description'}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {gallery.slug}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{gallery.imageCount}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {formatDate(gallery.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                startEditGallery(gallery);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedGallery(gallery);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="published">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">
                Published galleries feature will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="drafts">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">
                Draft galleries feature will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Edit gallery panel */}
      {editMode && selectedGallery && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Edit Gallery</CardTitle>
              <CardDescription>
                Update gallery information and manage images
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setEditMode(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gallery Name</label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL Slug</label>
                  <Input 
                    value={generateSlug(formData.name)}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Automatically generated from the gallery name
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Featured Image</label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-100 border">
                    {formData.featuredImage ? (
                      <img 
                        src={formData.featuredImage} 
                        alt="Featured" 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Choose Image
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select an image to represent this gallery in listings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <Separator />
          <CardHeader>
            <CardTitle>Gallery Content</CardTitle>
            <CardDescription>
              Manage images in this gallery
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedGallery.imageCount === 0 ? (
              <div className="text-center py-8">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">No images in this gallery</h3>
                <p className="text-gray-500 mb-4 max-w-md mx-auto">
                  Add images from your media library or upload new images directly to this gallery.
                </p>
                <Button>Add Images</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedGallery.imageCount} images
                  </p>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add More
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[...Array(Math.min(selectedGallery.imageCount, 6))].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-square relative group">
                        <img 
                          src={i % 2 === 0 ? '/lovable-uploads/banks-o-dee-logo.png' : '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png'} 
                          alt={`Gallery image ${i+1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-1">
                            <Button variant="secondary" size="icon" className="h-8 w-8">
                              <MoveHorizontal className="h-4 w-4" />
                            </Button>
                            <Button variant="secondary" size="icon" className="h-8 w-8">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                {selectedGallery.imageCount > 6 && (
                  <div className="text-center">
                    <Button variant="link">View All {selectedGallery.imageCount} Images</Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
            <Button onClick={handleUpdateGallery}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Add Gallery Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Gallery</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Gallery Name</label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="Enter gallery name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter gallery description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateGallery}>
              Create Gallery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Gallery Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the gallery "{selectedGallery?.name}". 
              {selectedGallery?.imageCount ? ` This gallery contains ${selectedGallery.imageCount} images.` : ''}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteGallery} 
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GalleryManager;

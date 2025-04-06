import React, { useState, useEffect } from 'react';
import { Grid, Search, FilterX, Filter, RefreshCw, SlidersHorizontal, Download } from 'lucide-react';
import useDebounce from '@/hooks/useDebounce';
import { ImageMetadata } from '@/services/images/media-types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import MediaCard from './MediaCard';
import MediaDetailsDialog from './MediaDetailsDialog';

const mockImages: ImageMetadata[] = [
  {
    id: '1',
    name: 'match-photo-1.jpg',
    url: '/lovable-uploads/banks-o-dee-logo.png',
    alt_text: 'Match day photo',
    type: 'image/jpeg',
    size: 250000,
    width: 1200,
    height: 800,
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-15T10:30:00',
    tags: ['match', 'team'],
    categories: ['Match Day'],
    bucket: 'images',
    path: '/media/match-photo-1.jpg',
  },
  {
    id: '2',
    name: 'team-photo-2023.jpg',
    url: '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png',
    alt_text: 'Team photo from 2023 season',
    type: 'image/jpeg',
    size: 500000,
    width: 1600,
    height: 1000,
    createdAt: '2023-09-05T14:20:00',
    updatedAt: '2023-09-05T14:20:00',
    tags: ['team', 'season'],
    categories: ['Team'],
    bucket: 'images',
    path: '/media/team-photo-2023.jpg',
  },
  {
    id: '3',
    name: 'stadium-aerial.jpg',
    url: '/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png',
    alt_text: 'Aerial view of Spain Park',
    type: 'image/jpeg',
    size: 750000,
    width: 2000,
    height: 1500,
    createdAt: '2023-06-12T09:15:00',
    updatedAt: '2023-06-12T09:15:00',
    tags: ['stadium', 'aerial'],
    categories: ['Stadium'],
    bucket: 'images',
    path: '/media/stadium-aerial.jpg',
  },
  {
    id: '4',
    name: 'celebration-video.mp4',
    url: '/video-placeholder.jpg',
    alt_text: 'Team celebration after winning',
    type: 'video/mp4',
    size: 5000000,
    width: 1920,
    height: 1080,
    createdAt: '2024-03-20T17:45:00',
    updatedAt: '2024-03-20T17:45:00',
    tags: ['celebration', 'victory'],
    categories: ['Match Day'],
    bucket: 'videos',
    path: '/media/celebration-video.mp4',
  }
];

const mockCategories = [
  { id: '1', name: 'Match Day' },
  { id: '2', name: 'Team' },
  { id: '3', name: 'Stadium' },
  { id: '4', name: 'Fans' },
];

const MediaLibrary: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState<ImageMetadata[]>(mockImages);
  const [filteredImages, setFilteredImages] = useState<ImageMetadata[]>(mockImages);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedMedia, setSelectedMedia] = useState<ImageMetadata[]>([]);
  const [activeMedia, setActiveMedia] = useState<ImageMetadata | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use debounced search term to prevent excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentImages = filteredImages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  
  // Filter and sort images whenever the filter criteria change
  useEffect(() => {
    let result = [...images];
    
    // Apply search filter
    if (debouncedSearchTerm) {
      result = result.filter(img => 
        img.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        img.tags?.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
        img.alt_text?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(img => 
        img.categories?.includes(selectedCategory)
      );
    }
    
    // Apply sorting
    switch(sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'size':
        result.sort((a, b) => b.size - a.size);
        break;
      default:
        break;
    }
    
    setFilteredImages(result);
    setCurrentPage(1); // Reset to first page after filtering
  }, [debouncedSearchTerm, selectedCategory, sortBy, images]);
  
  // Handle selecting/deselecting media items
  const toggleSelectMedia = (media: ImageMetadata) => {
    if (selectedMedia.some(item => item.id === media.id)) {
      setSelectedMedia(selectedMedia.filter(item => item.id !== media.id));
    } else {
      setSelectedMedia([...selectedMedia, media]);
    }
  };
  
  // Handle opening the details dialog
  const openDetailsDialog = (media: ImageMetadata) => {
    setActiveMedia(media);
    setIsDetailsDialogOpen(true);
  };
  
  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    if (selectedMedia.length === 0) {
      toast.warning('No media selected');
      return;
    }
    
    switch(action) {
      case 'delete':
        // In a real implementation, this would call a service to delete the media
        setImages(images.filter(img => !selectedMedia.some(selected => selected.id === img.id)));
        setSelectedMedia([]);
        toast.success(`Deleted ${selectedMedia.length} items`);
        break;
      case 'download':
        toast.info(`Downloading ${selectedMedia.length} items`);
        // In a real implementation, this would prepare a zip file or trigger multiple downloads
        break;
      default:
        break;
    }
  };
  
  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    
    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={() => setCurrentPage(old => Math.max(1, old - 1))}
          aria-disabled={currentPage === 1} 
          tabIndex={currentPage === 1 ? -1 : undefined}
          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );
    
    // First page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink 
          onClick={() => setCurrentPage(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue;
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          onClick={() => setCurrentPage(old => Math.min(totalPages, old + 1))}
          aria-disabled={currentPage === totalPages}
          tabIndex={currentPage === totalPages ? -1 : undefined}
          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );
    
    return items;
  };
  
  // Handle clearing all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('newest');
    setCurrentPage(1);
  };
  
  // Select all visible items on the current page
  const selectAllVisible = (checked: boolean) => {
    if (checked) {
      // Add all current page items that aren't already selected
      const newSelectedIds = new Set([...selectedMedia.map(item => item.id)]);
      const newSelectedMedia = [...selectedMedia];
      
      currentImages.forEach(image => {
        if (!newSelectedIds.has(image.id)) {
          newSelectedIds.add(image.id);
          newSelectedMedia.push(image);
        }
      });
      
      setSelectedMedia(newSelectedMedia);
    } else {
      // Remove current page items from selection
      const currentIds = new Set(currentImages.map(item => item.id));
      setSelectedMedia(selectedMedia.filter(item => !currentIds.has(item.id)));
    }
  };
  
  // Check if all visible items on current page are selected
  const areAllVisibleSelected = () => {
    if (currentImages.length === 0) return false;
    const selectedIds = new Set(selectedMedia.map(item => item.id));
    return currentImages.every(image => selectedIds.has(image.id));
  };
  
  // Handle refreshing the media library
  const refreshMediaLibrary = () => {
    setIsLoading(true);
    // Simulate an API call delay
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Media library refreshed');
    }, 1000);
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-team-blue"></div>
        <p className="mt-4 text-gray-500">Loading media...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={refreshMediaLibrary}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          {selectedMedia.length > 0 && (
            <>
              <Badge variant="outline" className="mr-2">
                {selectedMedia.length} selected
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleBulkAction('download')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction('delete')}
                    className="text-red-600"
                  >
                    <FilterX className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="size">Size (largest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Filters panel */}
      {isFilterOpen && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2 min-w-[200px]">
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {mockCategories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 min-w-[200px]">
                <label className="text-sm font-medium">File Type</label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" onClick={clearFilters}>
                <FilterX className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Selection controls */}
      {filteredImages.length > 0 && (
        <div className="flex items-center gap-2">
          <Checkbox 
            id="select-all"
            checked={areAllVisibleSelected()}
            onCheckedChange={selectAllVisible}
          />
          <label htmlFor="select-all" className="text-sm text-muted-foreground">
            Select all on this page
          </label>
        </div>
      )}
      
      {/* Media grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {currentImages.map((image) => (
            <MediaCard
              key={image.id}
              media={image}
              isSelected={selectedMedia.some(item => item.id === image.id)}
              onSelect={() => toggleSelectMedia(image)}
              onClick={() => openDetailsDialog(image)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Grid className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No media found</h3>
          <p className="text-gray-500 max-w-md mt-2">
            No media matches your current filters. Try adjusting your search or clear all filters to see all media.
          </p>
        </div>
      )}
      
      {/* Pagination */}
      {filteredImages.length > 0 && (
        <Pagination>
          <PaginationContent>
            {renderPaginationItems()}
          </PaginationContent>
        </Pagination>
      )}
      
      {/* Media details dialog */}
      {activeMedia && (
        <MediaDetailsDialog
          media={activeMedia}
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          onSave={(updatedMedia) => {
            // Update the media item in the array
            setImages(images.map(img => 
              img.id === updatedMedia.id ? updatedMedia : img
            ));
            
            // Also update in selectedMedia if it exists there
            setSelectedMedia(selectedMedia.map(img => 
              img.id === updatedMedia.id ? updatedMedia : img
            ));
            
            setActiveMedia(updatedMedia);
            toast.success('Media details updated');
          }}
          onDelete={(mediaId) => {
            // Remove the media item from arrays
            setImages(images.filter(img => img.id !== mediaId));
            setSelectedMedia(selectedMedia.filter(img => img.id !== mediaId));
            setIsDetailsDialogOpen(false);
            toast.success('Media deleted');
          }}
          categories={mockCategories.map(c => c.name)}
        />
      )}
    </div>
  );
};

export default MediaLibrary;

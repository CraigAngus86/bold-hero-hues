
import React, { useState, useEffect, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  Search, 
  Filter, 
  SortDesc, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Info,
  Loader
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  getImages,
  BucketType,
  ImageMetadata
} from '@/services/images';
import MediaCard from './MediaCard';
import MediaDetailsDialog from './MediaDetailsDialog';
import { format } from 'date-fns';

// Define available media buckets
const MEDIA_BUCKETS: BucketType[] = ['images'];

const MediaLibrary = () => {
  // State management
  const [mediaItems, setMediaItems] = useState<ImageMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<ImageMetadata | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    mediaType: 'all', // all, image, video
    dateRange: 'all',  // all, today, week, month, year
    category: 'all'
  });
  const [sortOrder, setSortOrder] = useState({
    field: 'createdAt', // name, createdAt, size
    direction: 'desc' // asc, desc
  });

  // Pagination settings
  const itemsPerPage = 12;

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch media items from Supabase storage
  useEffect(() => {
    const fetchMediaItems = async () => {
      setIsLoading(true);
      try {
        let allMedia: ImageMetadata[] = [];
        
        // Fetch from each bucket
        for (const bucket of MEDIA_BUCKETS) {
          const { success, data, error } = await getImages(bucket);
          
          if (success && data) {
            allMedia = [...allMedia, ...data];
          } else if (error) {
            console.error(`Error fetching from ${bucket}:`, error);
            setError(error as Error);
          }
        }
        
        setMediaItems(allMedia);
      } catch (err) {
        console.error('Error fetching media:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMediaItems();
  }, []);

  // Apply filters and sorting
  const filteredMedia = useMemo(() => {
    // Start with all media items
    let result = [...mediaItems];
    
    // Apply search filter
    if (debouncedSearchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filter.mediaType !== 'all') {
      result = result.filter(item => {
        if (filter.mediaType === 'image') {
          return item.type.startsWith('image/');
        } else if (filter.mediaType === 'video') {
          return item.type.startsWith('video/');
        }
        return true;
      });
    }
    
    // Apply date filter
    if (filter.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (filter.dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }
      
      result = result.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= cutoffDate;
      });
    }
    
    // Sort the results
    result.sort((a, b) => {
      if (sortOrder.field === 'name') {
        return sortOrder.direction === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortOrder.field === 'size') {
        return sortOrder.direction === 'asc' 
          ? a.size - b.size 
          : b.size - a.size;
      } else {
        // Default: sort by date
        return sortOrder.direction === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() 
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    return result;
  }, [mediaItems, debouncedSearchTerm, filter, sortOrder]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);
  const paginatedMedia = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMedia.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMedia, currentPage, itemsPerPage]);

  // Handle media selection
  const toggleMediaSelection = (id: string) => {
    setSelectedItems(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(item => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Select/deselect all media
  const toggleSelectAll = () => {
    if (selectedItems.length === paginatedMedia.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedMedia.map(item => item.id));
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    if (selectedItems.length === 0) {
      toast.error("No items selected");
      return;
    }

    switch (action) {
      case "delete":
        toast("Delete functionality will be implemented in a future update");
        break;
      case "tag":
        toast("Bulk tagging functionality will be implemented in a future update");
        break;
      case "gallery":
        toast("Gallery assignment functionality will be implemented in a future update");
        break;
      default:
        break;
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilter({
      mediaType: 'all',
      dateRange: 'all',
      category: 'all'
    });
    setSortOrder({
      field: 'createdAt',
      direction: 'desc'
    });
  };

  // Handle media item click to view details
  const handleMediaClick = (item: ImageMetadata) => {
    setSelectedMedia(item);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar with search, filters, and actions */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex-1 flex flex-wrap gap-2 md:gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                <span>Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-4">
                <h3 className="font-medium">Filter Media</h3>
                
                <div className="space-y-2">
                  <Label>Media Type</Label>
                  <Select 
                    value={filter.mediaType} 
                    onValueChange={(value) => setFilter({...filter, mediaType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Media</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select 
                    value={filter.dateRange}
                    onValueChange={(value) => setFilter({...filter, dateRange: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={filter.category}
                    onValueChange={(value) => setFilter({...filter, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="match">Match Day</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="stadium">Stadium</SelectItem>
                      <SelectItem value="fans">Fans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={resetFilters}
                >
                  <RotateCcw size={14} className="mr-2" />
                  Reset Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Select
            value={`${sortOrder.field}-${sortOrder.direction}`}
            onValueChange={(value) => {
              const [field, direction] = value.split('-');
              setSortOrder({ field, direction });
            }}
          >
            <SelectTrigger className="w-auto min-w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="size-desc">Size (Largest)</SelectItem>
              <SelectItem value="size-asc">Size (Smallest)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          {selectedItems.length > 0 && (
            <Select
              onValueChange={(value) => handleBulkAction(value)}
              value=""
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Bulk Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delete">Delete Selected</SelectItem>
                <SelectItem value="tag">Add Tags</SelectItem>
                <SelectItem value="gallery">Add to Gallery</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="flex items-center justify-between bg-muted p-2 rounded-md">
          <div className="flex items-center">
            <Checkbox 
              checked={selectedItems.length === paginatedMedia.length}
              onCheckedChange={toggleSelectAll}
              id="select-all"
            />
            <Label htmlFor="select-all" className="ml-2">
              {selectedItems.length} items selected
            </Label>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedItems([])}
          >
            Clear Selection
          </Button>
        </div>
      )}

      {/* Media Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader className="h-8 w-8 animate-spin text-gray-500 mb-4" />
          <p className="text-gray-500">Loading media library...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-500 mb-2">
            <Info size={40} />
          </div>
          <h3 className="text-lg font-medium text-red-500 mb-2">
            Error loading media
          </h3>
          <p className="text-gray-500 mb-4">
            {error.message || "There was an error loading the media library."}
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry Loading
          </Button>
        </div>
      ) : paginatedMedia.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-lg">
          <div className="text-gray-400 mb-2">
            <Image size={40} />
          </div>
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            No media found
          </h3>
          <p className="text-gray-500 mb-4 text-center max-w-md">
            {debouncedSearchTerm ? 
              "No media matches your search. Try different keywords or filters." : 
              "Your media library is empty. Upload some media to get started."
            }
          </p>
          {debouncedSearchTerm && (
            <Button onClick={resetFilters} variant="outline">
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {paginatedMedia.map((item) => (
              <MediaCard
                key={item.id}
                media={item}
                isSelected={selectedItems.includes(item.id)}
                onSelect={() => toggleMediaSelection(item.id)}
                onClick={() => handleMediaClick(item)}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Media Details Dialog */}
      {selectedMedia && (
        <MediaDetailsDialog
          media={selectedMedia}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </div>
  );
};

export default MediaLibrary;

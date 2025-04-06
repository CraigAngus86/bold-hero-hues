
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Youtube, 
  Plus, 
  Search, 
  CalendarIcon, 
  Clock, 
  LinkIcon, 
  Image as ImageIcon, 
  Trash2, 
  Edit, 
  RefreshCw, 
  ThumbsUp, 
  Share2, 
  BarChart4,
  CirclePlus,
  FileImage,
  Send,
  Eye
} from 'lucide-react';
import DataTable from '@/components/admin/common/DataTable';
import { SocialPost } from '@/types/fans';

// Mock data for social media posts
const mockPosts = [
  {
    id: '1',
    platform: 'twitter',
    content: 'Full time: Banks o\' Dee 3-1 Huntly FC. Great performance from the team today! #BanksDee #HFL',
    author: 'Social Media Team',
    date: '2023-05-15T16:45:00Z',
    likes: 28,
    shares: 12,
    featured: true,
    scheduledFor: null,
    imageUrl: '/placeholder.svg'
  },
  {
    id: '2',
    platform: 'facebook',
    content: 'Match day! We take on Huntly FC today at Spain Park. Kick-off at 3PM. Come down and support the team! #BanksDee',
    author: 'Admin',
    date: '2023-05-15T10:00:00Z',
    likes: 34,
    shares: 8,
    featured: false,
    scheduledFor: null,
    imageUrl: '/placeholder.svg'
  },
  {
    id: '3',
    platform: 'instagram',
    content: 'New home kit for the 2023/24 season! Available for pre-order now in the club shop. #NewKit #BanksDee',
    author: 'Social Media Team',
    date: '2023-05-12T15:30:00Z',
    likes: 76,
    shares: 0,
    featured: true,
    scheduledFor: null,
    imageUrl: '/placeholder.svg'
  },
  {
    id: '4',
    platform: 'twitter',
    content: 'Tickets for our Scottish Cup match against @ForrestFC are now available online! Click the link in bio to purchase. #ScottishCup',
    author: 'Admin',
    date: null,
    likes: 0,
    shares: 0,
    featured: false,
    scheduledFor: '2023-06-01T09:00:00Z',
    imageUrl: null
  }
];

// Platform icons and colors
const platformIcons = {
  twitter: { Icon: Twitter, color: 'text-blue-400' },
  facebook: { Icon: Facebook, color: 'text-blue-600' },
  instagram: { Icon: Instagram, color: 'text-pink-600' },
  youtube: { Icon: Youtube, color: 'text-red-600' }
};

// Account status cards component
const AccountStatusCards = () => {
  const accounts = [
    { platform: 'twitter', name: '@BanksDeeFC', connected: true, followers: 2450, lastSync: '2023-05-15T16:45:00Z' },
    { platform: 'facebook', name: 'Banks o\' Dee FC', connected: true, followers: 3800, lastSync: '2023-05-15T16:45:00Z' },
    { platform: 'instagram', name: '@banksodeefc', connected: true, followers: 1920, lastSync: '2023-05-15T16:45:00Z' },
    { platform: 'youtube', name: 'Banks o\' Dee FC', connected: false, followers: 0, lastSync: null }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {accounts.map((account) => {
        const { Icon, color } = platformIcons[account.platform];
        
        return (
          <Card key={account.platform}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Icon className={`h-5 w-5 ${color} mr-2`} />
                  <span className="font-medium capitalize">{account.platform}</span>
                </div>
                <Badge variant={account.connected ? 'default' : 'outline'}>
                  {account.connected ? 'Connected' : 'Not Connected'}
                </Badge>
              </div>
              
              {account.connected ? (
                <>
                  <p className="text-sm text-gray-600 mb-2">{account.name}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{account.followers.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Followers</p>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <RefreshCw size={14} />
                      <span>Sync</span>
                    </Button>
                  </div>
                </>
              ) : (
                <Button className="w-full mt-2">Connect Account</Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

const SocialMediaIntegration = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<SocialPost[]>(mockPosts);
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<SocialPost | null>(null);
  
  // New post form state
  const [newPost, setNewPost] = useState({
    content: '',
    platform: 'twitter',
    imageUrl: '',
    isScheduled: false,
    scheduledDate: null as Date | null,
    scheduledTime: '09:00',
    crossPost: false
  });
  
  // Handle view post
  const handleViewPost = (post: SocialPost) => {
    setCurrentPost(post);
    setIsPreviewDialogOpen(true);
  };
  
  // Handle create post
  const handleCreatePost = () => {
    if (!validateForm()) return;
    
    // Determine scheduled status
    const scheduledFor = (!newPost.isScheduled || !newPost.scheduledDate) 
      ? null 
      : new Date(
          new Date(newPost.scheduledDate).setHours(
            parseInt(newPost.scheduledTime.split(':')[0], 10),
            parseInt(newPost.scheduledTime.split(':')[1], 10)
          )
        ).toISOString();
    
    // In a real implementation, we would save to the database
    const newPostItem = {
      id: Date.now().toString(),
      platform: newPost.platform,
      content: newPost.content,
      author: 'Social Media Team',
      date: scheduledFor ? null : new Date().toISOString(),
      likes: 0,
      shares: 0,
      featured: false,
      scheduledFor,
      imageUrl: newPost.imageUrl || null
    };
    
    // If cross-posting is enabled, create posts for other platforms
    if (newPost.crossPost) {
      const platforms = ['twitter', 'facebook', 'instagram'];
      platforms.forEach(platform => {
        if (platform !== newPost.platform) {
          const crossPostedItem = {
            ...newPostItem,
            id: `${newPostItem.id}-${platform}`,
            platform
          };
          setPosts(prev => [crossPostedItem, ...prev]);
        }
      });
    }
    
    setPosts(prev => [newPostItem, ...prev]);
    toast.success(`Post ${scheduledFor ? 'scheduled' : 'created'} successfully`);
    setIsComposeDialogOpen(false);
    resetForm();
  };
  
  // Handle post now
  const handlePostNow = () => {
    if (!validateForm()) return;
    
    // In a real implementation, we would save to the database and post immediately
    const newPostItem = {
      id: Date.now().toString(),
      platform: newPost.platform,
      content: newPost.content,
      author: 'Social Media Team',
      date: new Date().toISOString(),
      likes: 0,
      shares: 0,
      featured: false,
      scheduledFor: null,
      imageUrl: newPost.imageUrl || null
    };
    
    // If cross-posting is enabled, create posts for other platforms
    if (newPost.crossPost) {
      const platforms = ['twitter', 'facebook', 'instagram'];
      platforms.forEach(platform => {
        if (platform !== newPost.platform) {
          const crossPostedItem = {
            ...newPostItem,
            id: `${newPostItem.id}-${platform}`,
            platform
          };
          setPosts(prev => [crossPostedItem, ...prev]);
        }
      });
    }
    
    setPosts(prev => [newPostItem, ...prev]);
    toast.success('Post published successfully');
    setIsComposeDialogOpen(false);
    resetForm();
  };
  
  // Validate the form
  const validateForm = () => {
    if (!newPost.content.trim()) {
      toast.error('Content is required');
      return false;
    }
    
    if (newPost.isScheduled && !newPost.scheduledDate) {
      toast.error('Scheduled date is required');
      return false;
    }
    
    // Add platform-specific validation
    if (newPost.platform === 'twitter' && newPost.content.length > 280) {
      toast.error('Twitter posts cannot exceed 280 characters');
      return false;
    }
    
    return true;
  };
  
  // Reset the form
  const resetForm = () => {
    setNewPost({
      content: '',
      platform: 'twitter',
      imageUrl: '',
      isScheduled: false,
      scheduledDate: null,
      scheduledTime: '09:00',
      crossPost: false
    });
  };
  
  // Get character count and limit based on platform
  const getCharacterInfo = () => {
    const count = newPost.content.length;
    let limit = 0;
    
    switch (newPost.platform) {
      case 'twitter':
        limit = 280;
        break;
      case 'facebook':
      case 'instagram':
        limit = 2200;
        break;
      default:
        limit = 5000;
    }
    
    return { count, limit };
  };
  
  // Filter posts based on activeTab and searchQuery
  const filteredPosts = posts.filter(post => {
    // Filter by tab
    if (activeTab === 'all') {
      // No filter
    } else if (activeTab === 'scheduled' && !post.scheduledFor) {
      return false;
    } else if (activeTab === 'published' && post.scheduledFor) {
      return false;
    } else if (activeTab === 'twitter' && post.platform !== 'twitter') {
      return false;
    } else if (activeTab === 'facebook' && post.platform !== 'facebook') {
      return false;
    } else if (activeTab === 'instagram' && post.platform !== 'instagram') {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !post.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Column definitions for the data table
  const columns = [
    {
      key: 'platform',
      header: 'Platform',
      cell: (post: SocialPost) => {
        const { Icon, color } = platformIcons[post.platform as keyof typeof platformIcons];
        return (
          <div className="flex items-center">
            <Icon className={`h-5 w-5 ${color}`} />
            <span className="ml-2 capitalize">{post.platform}</span>
          </div>
        );
      }
    },
    {
      key: 'content',
      header: 'Content',
      cell: (post: SocialPost) => (
        <div>
          <div className="text-sm line-clamp-2">{post.content}</div>
          <div className="flex items-center mt-1">
            {post.imageUrl && (
              <div className="flex items-center text-xs text-blue-600 mr-2">
                <FileImage size={12} className="mr-1" />
                <span>Image</span>
              </div>
            )}
            {post.scheduledFor ? (
              <Badge variant="outline" className="text-xs">
                Scheduled: {new Date(post.scheduledFor).toLocaleString()}
              </Badge>
            ) : (
              <Badge variant="default" className="text-xs">
                Published
              </Badge>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'metrics',
      header: 'Performance',
      cell: (post: SocialPost) => (
        <>
          {post.date ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center text-gray-600">
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center text-gray-600 mt-1">
                <Share2 className="h-4 w-4 mr-1" />
                <span>{post.shares}</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Badge variant="outline" className="text-xs">
                Pending
              </Badge>
            </div>
          )}
        </>
      )
    },
    {
      key: 'date',
      header: 'Date',
      cell: (post: SocialPost) => (
        <div className="text-sm text-gray-600">
          {post.date ? (
            <div className="flex items-center">
              <Send className="h-4 w-4 mr-1.5" />
              {new Date(post.date).toLocaleDateString()}
            </div>
          ) : (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1.5" />
              {new Date(post.scheduledFor as string).toLocaleDateString()}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (post: SocialPost) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewPost(post)}
          >
            <Eye size={16} />
          </Button>
          {!post.date && (
            <>
              <Button variant="ghost" size="sm">
                <Edit size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600">
                <Trash2 size={16} />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Social Media Integration</h2>
          <p className="text-gray-600">Manage and schedule posts across multiple social media platforms</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search posts..."
              className="pl-9 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Create Post</span>
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Social Media Post</DialogTitle>
              </DialogHeader>
              
              <div className="py-4 space-y-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={newPost.platform}
                    onValueChange={(value) => setNewPost({...newPost, platform: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(platformIcons).map(([platform, { Icon, color }]) => (
                        <SelectItem key={platform} value={platform}>
                          <div className="flex items-center">
                            <Icon className={`h-4 w-4 ${color} mr-2`} />
                            <span className="capitalize">{platform}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="content">Content</Label>
                    <div className="text-xs text-gray-500">
                      {getCharacterInfo().count} / {getCharacterInfo().limit} characters
                    </div>
                  </div>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder={`Write your ${newPost.platform} post here...`}
                    className="min-h-[120px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="imageUrl"
                      value={newPost.imageUrl}
                      onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})}
                      placeholder="Enter image URL"
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <ImageIcon size={18} />
                    </Button>
                  </div>
                  
                  {newPost.imageUrl && (
                    <div className="mt-2 border rounded-md p-2 relative">
                      <img 
                        src={newPost.imageUrl} 
                        alt="Preview" 
                        className="h-40 w-full object-cover rounded" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/eeeeee/cccccc?text=Invalid+Image+URL';
                        }}
                      />
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-4 right-4 h-8 w-8 rounded-full"
                        onClick={() => setNewPost({...newPost, imageUrl: ''})}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="schedule"
                    checked={newPost.isScheduled}
                    onCheckedChange={(checked) => setNewPost({...newPost, isScheduled: checked})}
                  />
                  <Label htmlFor="schedule">Schedule for later</Label>
                </div>
                
                {newPost.isScheduled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <div className="mt-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !newPost.scheduledDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newPost.scheduledDate ? format(newPost.scheduledDate, "PPP") : <span>Select date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newPost.scheduledDate}
                              onSelect={(date) => setNewPost({...newPost, scheduledDate: date})}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newPost.scheduledTime}
                        onChange={(e) => setNewPost({...newPost, scheduledTime: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="crosspost"
                    checked={newPost.crossPost}
                    onCheckedChange={(checked) => setNewPost({...newPost, crossPost: checked})}
                  />
                  <Label htmlFor="crosspost">Cross-post to other platforms</Label>
                </div>
                
                {newPost.crossPost && (
                  <div className="pl-6 flex flex-wrap gap-2">
                    {Object.entries(platformIcons).map(([platform, { Icon, color }]) => {
                      if (platform === newPost.platform) return null;
                      return (
                        <Badge key={platform} variant="outline" className="py-1">
                          <Icon className={`h-4 w-4 ${color} mr-1`} />
                          <span className="capitalize">{platform}</span>
                        </Badge>
                      );
                    })}
                    <div className="w-full mt-1 text-xs text-gray-500">
                      Note: Content may need to be adjusted to fit platform-specific requirements
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsComposeDialogOpen(false)}>
                  Cancel
                </Button>
                {newPost.isScheduled ? (
                  <Button onClick={handleCreatePost}>
                    Schedule Post
                  </Button>
                ) : (
                  <Button onClick={handlePostNow}>
                    Post Now
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <AccountStatusCards />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="twitter">Twitter</TabsTrigger>
          <TabsTrigger value="facebook">Facebook</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="pt-2">
          <Card>
            <CardContent className="p-0">
              <DataTable
                columns={columns}
                data={filteredPosts}
                noDataMessage="No posts found"
              />
            </CardContent>
          </Card>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart4 size={16} />
              <span>Social Media Analytics Dashboard</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* View Post Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        {currentPost && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="flex items-center">
                  {(() => {
                    const { Icon, color } = platformIcons[currentPost.platform as keyof typeof platformIcons];
                    return <Icon className={`h-5 w-5 ${color}`} />;
                  })()}
                  <span className="ml-2 capitalize">{currentPost.platform} Post</span>
                </div>
                {currentPost.date ? (
                  <Badge variant="default" className="ml-2">
                    Published
                  </Badge>
                ) : (
                  <Badge variant="outline" className="ml-2">
                    Scheduled
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-2">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-3">
                  {(() => {
                    const { Icon, color } = platformIcons[currentPost.platform as keyof typeof platformIcons];
                    return (
                      <>
                        <div className={`p-2 rounded-full bg-white mr-2`}>
                          <Icon className={`h-5 w-5 ${color}`} />
                        </div>
                        <div>
                          <p className="font-semibold">Banks o' Dee FC</p>
                          <p className="text-xs text-gray-500">
                            {currentPost.date 
                              ? `Posted ${new Date(currentPost.date).toLocaleDateString()}` 
                              : `Scheduled for ${new Date(currentPost.scheduledFor as string).toLocaleString()}`
                            }
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
                
                <p className="text-sm mb-3 whitespace-pre-line">{currentPost.content}</p>
                
                {currentPost.imageUrl && (
                  <img 
                    src={currentPost.imageUrl} 
                    alt="Post" 
                    className="w-full rounded-md mb-3" 
                  />
                )}
                
                {currentPost.date && (
                  <div className="flex justify-between text-sm text-gray-500 mt-4 pt-3 border-t">
                    <div className="flex items-center">
                      <ThumbsUp size={14} className="mr-1" />
                      <span>{currentPost.likes} likes</span>
                    </div>
                    <div className="flex items-center">
                      <Share2 size={14} className="mr-1" />
                      <span>{currentPost.shares} shares</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-500">
                <p className="mb-2">
                  <strong className="font-semibold text-gray-700">Author:</strong> {currentPost.author}
                </p>
                {currentPost.date ? (
                  <p>
                    <strong className="font-semibold text-gray-700">Published:</strong> {new Date(currentPost.date).toLocaleString()}
                  </p>
                ) : (
                  <p>
                    <strong className="font-semibold text-gray-700">Scheduled for:</strong> {new Date(currentPost.scheduledFor as string).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
                Close
              </Button>
              {!currentPost.date && (
                <Button variant="default">
                  Edit
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default SocialMediaIntegration;

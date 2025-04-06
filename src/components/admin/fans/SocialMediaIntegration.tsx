
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SocialPost } from '@/types/fans';
import { Calendar, Clock, Image as ImageIcon, Twitter, Facebook, Instagram, Youtube, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const SocialMediaIntegration: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: '1',
      platform: 'twitter',
      content: 'Exciting match coming up this weekend! #BanksODee',
      author: 'Admin',
      date: new Date().toISOString(),
      likes: 24,
      shares: 8,
      featured: true,
      scheduledFor: null,
      imageUrl: null,
    },
    {
      id: '2',
      platform: 'facebook',
      content: 'Check out our new youth team kits for the upcoming season!',
      author: 'Admin',
      date: new Date(Date.now() - 86400000).toISOString(), // yesterday
      likes: 56,
      shares: 12,
      featured: false,
      scheduledFor: null,
      imageUrl: 'https://placehold.co/600x400/png',
    },
    {
      id: '3',
      platform: 'instagram',
      content: 'Match day vibes! #GameDay #BanksODee',
      author: 'Admin',
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      likes: 89,
      shares: 5,
      featured: true,
      scheduledFor: null,
      imageUrl: 'https://placehold.co/600x400/png',
    },
    {
      id: '4',
      platform: 'twitter',
      content: 'Upcoming community event next week. Save the date!',
      author: 'Admin',
      date: null,
      likes: 0,
      shares: 0,
      featured: false,
      scheduledFor: new Date(Date.now() + 604800000).toISOString(), // 1 week from now
      imageUrl: null,
    },
  ]);
  
  const [activeTab, setActiveTab] = useState('all');
  const [newPostDialogOpen, setNewPostDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    platform: 'twitter',
    content: '',
    scheduledFor: '',
    imageUrl: '',
    featured: false,
    postNow: true,
  });
  
  const platformIcons = {
    twitter: <Twitter className="h-4 w-4 text-blue-400" />,
    facebook: <Facebook className="h-4 w-4 text-blue-600" />,
    instagram: <Instagram className="h-4 w-4 text-pink-500" />,
    youtube: <Youtube className="h-4 w-4 text-red-600" />,
  };
  
  const handleCreatePost = () => {
    const newId = Date.now().toString();
    const newSocialPost: SocialPost = {
      id: newId,
      platform: newPost.platform as 'twitter' | 'facebook' | 'instagram' | 'youtube',
      content: newPost.content,
      author: 'Admin',
      date: newPost.postNow ? new Date().toISOString() : null,
      likes: 0,
      shares: 0,
      featured: newPost.featured,
      scheduledFor: newPost.postNow ? null : newPost.scheduledFor,
      imageUrl: newPost.imageUrl || null,
    };
    
    setPosts(prev => [newSocialPost, ...prev]);
    
    setNewPost({
      platform: 'twitter',
      content: '',
      scheduledFor: '',
      imageUrl: '',
      featured: false,
      postNow: true,
    });
    
    setNewPostDialogOpen(false);
    toast.success(newPost.postNow ? 'Post created successfully!' : 'Post scheduled successfully!');
  };
  
  const handleToggleFeatured = (id: string) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, featured: !post.featured } : post
    ));
    toast.success('Post feature status updated');
  };
  
  const handleDeletePost = (id: string) => {
    setPosts(prev => prev.filter(post => post.id !== id));
    toast.success('Post deleted successfully');
  };
  
  // Filter posts based on active tab
  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    if (activeTab === 'published') return post.date !== null && !post.scheduledFor;
    if (activeTab === 'scheduled') return post.scheduledFor !== null;
    if (activeTab === 'featured') return post.featured;
    if (activeTab === post.platform) return true;
    return false;
  });
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Social Media Integration</h2>
          <p className="text-gray-600">Manage and schedule posts across social platforms</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button onClick={() => setNewPostDialogOpen(true)}>Create Post</Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex overflow-x-auto">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="twitter" className="flex items-center gap-1">
            <Twitter size={16} /> Twitter
          </TabsTrigger>
          <TabsTrigger value="facebook" className="flex items-center gap-1">
            <Facebook size={16} /> Facebook
          </TabsTrigger>
          <TabsTrigger value="instagram" className="flex items-center gap-1">
            <Instagram size={16} /> Instagram
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center gap-1">
            <Youtube size={16} /> YouTube
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  {post.imageUrl && (
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt="Post" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {platformIcons[post.platform]}
                        <CardTitle className="text-sm font-medium">{post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}</CardTitle>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        {post.scheduledFor ? (
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            <span>Scheduled: {new Date(post.scheduledFor).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            <span>{post.date ? new Date(post.date).toLocaleDateString() : 'Draft'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="py-2">
                    <p className="text-sm mb-4">{post.content}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex gap-3">
                        <span>{post.likes} Likes</span>
                        <span>{post.shares} Shares</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant={post.featured ? "default" : "outline"}
                          className="h-8"
                          onClick={() => handleToggleFeatured(post.id)}
                        >
                          {post.featured ? "Featured" : "Feature"}
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="h-8"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No posts found for this filter.
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Create New Post Dialog */}
      <Dialog open={newPostDialogOpen} onOpenChange={setNewPostDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Social Media Post</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select 
                value={newPost.platform}
                onValueChange={(value) => setNewPost(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitter">
                    <div className="flex items-center gap-2">
                      <Twitter size={16} />
                      <span>Twitter</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="facebook">
                    <div className="flex items-center gap-2">
                      <Facebook size={16} />
                      <span>Facebook</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="instagram">
                    <div className="flex items-center gap-2">
                      <Instagram size={16} />
                      <span>Instagram</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="youtube">
                    <div className="flex items-center gap-2">
                      <Youtube size={16} />
                      <span>YouTube</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your post content here..."
                rows={4}
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image URL (optional)</Label>
              <div className="flex gap-2">
                <Input 
                  id="image"
                  placeholder="https://example.com/image.jpg"
                  value={newPost.imageUrl}
                  onChange={(e) => setNewPost(prev => ({ ...prev, imageUrl: e.target.value }))}
                />
                <Button variant="outline" size="icon" title="Upload image">
                  <Upload size={16} />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="post-now"
                  checked={newPost.postNow}
                  onCheckedChange={(checked) => setNewPost(prev => ({ ...prev, postNow: checked }))}
                />
                <Label htmlFor="post-now">Post now</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="featured"
                  checked={newPost.featured}
                  onCheckedChange={(checked) => setNewPost(prev => ({ ...prev, featured: checked }))}
                />
                <Label htmlFor="featured">Featured post</Label>
              </div>
            </div>
            
            {!newPost.postNow && (
              <div className="space-y-2">
                <Label htmlFor="scheduled-date">Schedule for</Label>
                <Input 
                  id="scheduled-date" 
                  type="datetime-local"
                  value={newPost.scheduledFor}
                  onChange={(e) => setNewPost(prev => ({ ...prev, scheduledFor: e.target.value }))}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPostDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePost} disabled={!newPost.content}>
              {newPost.postNow ? 'Post Now' : 'Schedule Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
        <p>Connected social media accounts are managed through the integrations settings</p>
      </div>
    </div>
  );
};

export default SocialMediaIntegration;

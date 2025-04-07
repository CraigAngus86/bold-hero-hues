
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SocialPost } from '@/types/fans';
import { Facebook, Twitter, Instagram, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const SocialMediaIntegration: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: '1',
      platform: 'twitter',
      content: 'Excited for the upcoming match this weekend! #MatchDay #Football',
      image_url: 'https://placehold.co/600x400/png',
      post_url: 'https://twitter.com/example/status/123456789',
      posted_at: '2023-05-12T10:30:00',
      engagement: {
        likes: 42,
        shares: 12,
        comments: 5,
      },
      status: 'published',
      created_at: '2023-05-12T10:20:00',
    },
    {
      id: '2',
      platform: 'facebook',
      content: 'Check out the highlights from our latest victory! What was your favorite moment?',
      image_url: 'https://placehold.co/600x400/png',
      post_url: 'https://facebook.com/post/123456789',
      status: 'published',
      posted_at: '2023-05-10T14:15:00',
      engagement: {
        likes: 67,
        shares: 8,
        comments: 15,
      },
      created_at: '2023-05-10T14:00:00',
    },
    {
      id: '3',
      platform: 'instagram',
      content: 'Training session at the new facility ⚽️ #Training #TeamSpirit',
      image_url: 'https://placehold.co/600x400/png',
      post_url: 'https://instagram.com/p/123456789',
      status: 'scheduled',
      scheduled_for: '2023-05-20T15:00:00',
      engagement: {
        likes: 0,
        shares: 0,
        comments: 0,
      },
      created_at: '2023-05-08T09:45:00',
    },
    {
      id: '4',
      platform: 'twitter',
      content: 'Season tickets now available for the upcoming season!',
      status: 'draft',
      engagement: {
        likes: 0,
        shares: 0,
        comments: 0,
      },
      created_at: '2023-05-07T16:20:00',
    },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter posts based on search query and active tab
  const filteredPosts = posts.filter(item => {
    // Filter by search query
    const matchesSearch = 
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'published') return matchesSearch && item.status === 'published';
    if (activeTab === 'scheduled') return matchesSearch && item.status === 'scheduled';
    if (activeTab === 'draft') return matchesSearch && item.status === 'draft';
    if (activeTab === 'twitter') return matchesSearch && item.platform === 'twitter';
    if (activeTab === 'facebook') return matchesSearch && item.platform === 'facebook';
    if (activeTab === 'instagram') return matchesSearch && item.platform === 'instagram';
    
    return matchesSearch;
  });
  
  const handleDelete = (id: string) => {
    setPosts(prev => prev.filter(post => post.id !== id));
    toast.success('Post deleted');
  };
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter size={16} className="text-blue-400" />;
      case 'facebook': return <Facebook size={16} className="text-blue-600" />;
      case 'instagram': return <Instagram size={16} className="text-pink-600" />;
      default: return <Share2 size={16} />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'scheduled': return 'default';
      case 'draft': return 'outline';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const displayDate = (post: SocialPost): string => {
    if (post.status === 'published' && post.posted_at) {
      return new Date(post.posted_at).toLocaleDateString();
    } else if (post.status === 'scheduled' && post.scheduled_for) {
      return `Scheduled: ${new Date(post.scheduled_for).toLocaleDateString()}`;
    } else {
      return new Date(post.created_at || '').toLocaleDateString();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Social Media</h2>
          <p className="text-gray-600">Manage your social media posts</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Input
              placeholder="Search posts..."
              className="w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>New Post</Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="twitter">Twitter</TabsTrigger>
          <TabsTrigger value="facebook">Facebook</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-medium text-gray-500">Content</th>
                      <th className="text-left py-3 font-medium text-gray-500">Platform</th>
                      <th className="text-left py-3 font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 font-medium text-gray-500">Engagement</th>
                      <th className="text-right py-3 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.length > 0 ? (
                      filteredPosts.map((post) => (
                        <tr key={post.id} className="border-b hover:bg-gray-50">
                          <td className="py-3">
                            <div className="flex items-start gap-3">
                              {post.image_url && (
                                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                                  <img src={post.image_url} alt="" className="h-full w-full object-cover" />
                                </div>
                              )}
                              <div className="line-clamp-2 text-sm">
                                {post.content}
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-1">
                              {getPlatformIcon(post.platform)}
                              <span className="capitalize">{post.platform}</span>
                            </div>
                          </td>
                          <td className="py-3 text-sm text-gray-600">
                            {displayDate(post)}
                          </td>
                          <td className="py-3">
                            <Badge variant={getStatusBadgeVariant(post.status)}>
                              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <div className="text-sm">
                              <span className="mr-2">👍 {post.engagement.likes}</span>
                              <span className="mr-2">🔄 {post.engagement.shares}</span>
                              <span>💬 {post.engagement.comments}</span>
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end space-x-2">
                              <Button size="sm" variant="outline">Edit</Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="text-red-600"
                                onClick={() => handleDelete(post.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          No posts found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
        <p>Connect your social media accounts in the settings to enable automatic posting</p>
      </div>
    </div>
  );
};

export default SocialMediaIntegration;

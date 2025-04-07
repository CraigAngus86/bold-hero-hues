
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Twitter, Instagram, Facebook } from 'lucide-react';
import { SocialPost } from '@/types/fans';

const SocialMediaIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('published');
  
  // Mock data with the correct type implementation
  const socialPosts: SocialPost[] = [
    {
      id: '1',
      platform: 'instagram',
      content: 'Check out our match highlights from the weekend victory! #BanksoDeeFc',
      image_url: '/images/match-celebration.jpg',
      post_url: 'https://instagram.com/post/123',
      posted_at: '2025-04-05T14:30:00Z', // Added required posted_at field
      status: 'published',
      created_at: '2025-04-05T14:30:00Z',
      engagement: {
        likes: 124,
        shares: 18,
        comments: 22
      }
    },
    {
      id: '2',
      platform: 'twitter',
      content: 'Banks o\' Dee are proud to announce our new team captain for the upcoming season! Stay tuned for the announcement this Friday.',
      posted_at: '2025-04-02T09:15:00Z', // Added required posted_at field
      status: 'published',
      created_at: '2025-04-02T09:15:00Z',
      engagement: {
        likes: 87,
        shares: 45,
        comments: 13
      }
    },
    {
      id: '3',
      platform: 'facebook',
      content: 'Tickets for our upcoming match against Formartine United are now available online. Book early to avoid disappointment!',
      post_url: 'https://facebook.com/post/456',
      posted_at: '2025-04-01T10:00:00Z', // Added required posted_at field
      created_at: '2025-04-01T10:00:00Z',
      engagement: {
        likes: 56,
        shares: 32,
        comments: 8
      }
    }
  ];
  
  const scheduledPosts: SocialPost[] = [
    {
      id: '4',
      platform: 'instagram',
      content: 'Match day tomorrow! Come support the team as we face Buckie Thistle at Spain Park.',
      image_url: 'https://example.com/matchday-promo.jpg',
      post_url: 'https://instagram.com/scheduled/789',
      status: 'scheduled',
      scheduled_for: '2025-04-08T10:00:00Z',
      created_at: '2025-04-06T14:30:00Z',
      posted_at: '2025-04-08T10:00:00Z', // Added to satisfy the type
      engagement: {
        likes: 0,
        shares: 0,
        comments: 0
      }
    }
  ];
  
  const draftPosts: SocialPost[] = [
    {
      id: '5',
      platform: 'twitter',
      content: 'Draft post about our community initiative with local schools',
      status: 'draft',
      created_at: '2025-04-03T16:45:00Z',
      posted_at: '2025-04-03T16:45:00Z', // Added to satisfy the type
      engagement: {
        likes: 0,
        shares: 0,
        comments: 0
      }
    }
  ];
  
  const platformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-4 h-4 text-blue-400" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Social Media Management</CardTitle>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1" /> New Post
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="published" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="published">
            <div className="space-y-4">
              {socialPosts.map(post => (
                <div key={post.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {platformIcon(post.platform)}
                      <span className="ml-2 text-sm font-medium">{post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(post.posted_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="my-2">{post.content}</p>
                  {post.image_url && (
                    <div className="mt-2 w-full h-40 bg-gray-100 rounded-md"></div>
                  )}
                  <div className="flex mt-3 text-sm">
                    <span className="mr-3">{post.engagement.likes} likes</span>
                    <span className="mr-3">{post.engagement.shares} shares</span>
                    <span>{post.engagement.comments} comments</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="scheduled">
            <div className="space-y-4">
              {scheduledPosts.map(post => (
                <div key={post.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {platformIcon(post.platform)}
                      <span className="ml-2 text-sm font-medium">{post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Scheduled: {new Date(post.scheduled_for || '').toLocaleDateString()}
                    </div>
                  </div>
                  <p className="my-2">{post.content}</p>
                  <div className="flex mt-2">
                    <Button size="sm" variant="outline" className="mr-2">Edit</Button>
                    <Button size="sm" variant="outline">Cancel</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="drafts">
            <div className="space-y-4">
              {draftPosts.map(post => (
                <div key={post.id} className="p-4 border rounded-md">
                  <div className="flex items-center">
                    {platformIcon(post.platform)}
                    <span className="ml-2 text-sm font-medium">{post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}</span>
                  </div>
                  <p className="my-2">{post.content}</p>
                  <div className="flex mt-2">
                    <Button size="sm" variant="outline" className="mr-2">Edit</Button>
                    <Button size="sm" variant="outline" className="mr-2">Schedule</Button>
                    <Button size="sm" variant="outline">Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="p-8 text-center border rounded-md">
              <p className="text-muted-foreground">Social media analytics will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SocialMediaIntegration;

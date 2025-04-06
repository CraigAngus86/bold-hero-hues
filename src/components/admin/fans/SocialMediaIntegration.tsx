
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Search,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Calendar,
  Star,
  Clock,
  Trash,
  Edit,
  Eye,
  Plus
} from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for social media posts
const mockSocialPosts = [
  {
    id: '1',
    platform: 'twitter',
    content: 'Great win for the team today! Thanks to all the fans who came out to support us. #BanksDee #Victory',
    author: '@BanksDeeFC',
    date: '2023-05-14T15:30:00',
    likes: 45,
    shares: 12,
    featured: true,
    scheduledFor: '2023-05-15T09:00:00',
  },
  {
    id: '2',
    platform: 'instagram',
    content: 'Match day atmosphere at Spain Park! Swipe to see more photos from today's game.',
    author: '@banksdeefootballclub',
    date: '2023-05-14T17:45:00',
    likes: 87,
    shares: 5,
    featured: false,
    scheduledFor: null,
  },
  {
    id: '3',
    platform: 'facebook',
    content: 'Season tickets for the 2023/24 season are now on sale! Early bird offers available until June 30th.',
    author: 'Banks o\' Dee FC Official',
    date: '2023-05-13T10:00:00',
    likes: 63,
    shares: 28,
    featured: true,
    scheduledFor: '2023-05-16T12:00:00',
  },
  {
    id: '4',
    platform: 'youtube',
    content: 'Match Highlights: Banks o\' Dee vs Fraserburgh | Highland League Cup Semi-Final',
    author: 'Banks o\' Dee FC TV',
    date: '2023-05-12T14:20:00',
    likes: 112,
    shares: 34,
    featured: false,
    scheduledFor: null,
  },
];

// Platform icons and colors
const platformConfig = {
  twitter: {
    icon: Twitter,
    color: 'bg-sky-100 text-sky-800',
  },
  facebook: {
    icon: Facebook,
    color: 'bg-blue-100 text-blue-800',
  },
  instagram: {
    icon: Instagram,
    color: 'bg-purple-100 text-purple-800',
  },
  youtube: {
    icon: Youtube,
    color: 'bg-red-100 text-red-800',
  },
};

const SocialMediaIntegration: React.FC = () => {
  const [posts, setPosts] = useState(mockSocialPosts);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter posts based on search query and active tab
  const filteredPosts = posts.filter(post => {
    // Filter by search query
    const matchesSearch = 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'featured') return matchesSearch && post.featured;
    if (activeTab === 'scheduled') return matchesSearch && post.scheduledFor;
    if (activeTab === post.platform) return matchesSearch;
    
    return matchesSearch;
  });
  
  // Feature or unfeature a post
  const toggleFeature = (id: string) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, featured: !post.featured } : post
    ));
  };
  
  // Schedule a post
  const schedulePost = (id: string, date: string | null) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, scheduledFor: date } : post
    ));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Social Media Curation</h2>
          <p className="text-gray-600">Manage and curate social media content</p>
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
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar size={16} />
            <span className="hidden md:inline">Date Range</span>
          </Button>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            <span className="hidden md:inline">Connect Account</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All Platforms</TabsTrigger>
          <TabsTrigger value="twitter" className="flex items-center gap-2">
            <Twitter size={14} />
            <span className="hidden md:inline">Twitter</span>
          </TabsTrigger>
          <TabsTrigger value="facebook" className="flex items-center gap-2">
            <Facebook size={14} />
            <span className="hidden md:inline">Facebook</span>
          </TabsTrigger>
          <TabsTrigger value="instagram" className="flex items-center gap-2">
            <Instagram size={14} />
            <span className="hidden md:inline">Instagram</span>
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center gap-2">
            <Youtube size={14} />
            <span className="hidden md:inline">YouTube</span>
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Star size={14} />
            <span className="hidden md:inline">Featured</span>
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Clock size={14} />
            <span className="hidden md:inline">Scheduled</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map(post => {
              const PlatformIcon = platformConfig[post.platform as keyof typeof platformConfig].icon;
              const platformColor = platformConfig[post.platform as keyof typeof platformConfig].color;
              
              return (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className={`p-1.5 rounded-full ${platformColor} mr-2`}>
                          <PlatformIcon size={14} />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-medium">{post.author}</CardTitle>
                          <p className="text-xs text-gray-500">
                            {new Date(post.date).toLocaleDateString()} at {new Date(post.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      {post.featured && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <Star size={12} className="mr-1" /> Featured
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{post.content}</p>
                    <div className="flex items-center text-xs text-gray-500 space-x-4 mt-3">
                      <span>{post.likes} likes</span>
                      <span>{post.shares} shares</span>
                    </div>
                    {post.scheduledFor && (
                      <div className="mt-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center">
                          <Clock size={12} className="mr-1" /> 
                          Scheduled for {new Date(post.scheduledFor).toLocaleDateString()} at {new Date(post.scheduledFor).toLocaleTimeString()}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Feature</span>
                      <Switch 
                        checked={post.featured}
                        onCheckedChange={() => toggleFeature(post.id)}
                      />
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye size={16} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Calendar size={16} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600">
                        <Trash size={16} />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Search size={48} className="mx-auto mb-4 opacity-40" />
              <p>No social media posts found for your search criteria.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Preview Featured Content</h3>
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <div className="mb-4 text-gray-500">
            <p>This area will show a preview of how the featured social media content will appear on the website.</p>
          </div>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto">
            {posts.filter(post => post.featured).slice(0, 3).map(post => {
              const PlatformIcon = platformConfig[post.platform as keyof typeof platformConfig].icon;
              
              return (
                <div key={post.id} className="bg-white rounded shadow p-4 text-left">
                  <div className="flex items-center mb-2">
                    <PlatformIcon size={16} className="mr-2" />
                    <span className="text-sm font-medium">{post.author}</span>
                  </div>
                  <p className="text-sm">{post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}</p>
                </div>
              );
            })}
            
            {posts.filter(post => post.featured).length === 0 && (
              <div className="col-span-3 text-gray-500">
                <p>No featured posts to preview.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
        <p>This is a demonstration with sample content. In a future update, these will be stored in and retrieved from Supabase.</p>
      </div>
    </div>
  );
};

export default SocialMediaIntegration;

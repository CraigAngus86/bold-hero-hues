
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Calendar, Twitter, Facebook, Instagram, Youtube, Check, X, Star, Clock, ExternalLink } from 'lucide-react';
import { mockSocialPosts } from '@/services/fansService';

// Platform icons
const platforms = {
  twitter: <Twitter className="h-4 w-4 text-blue-400" />,
  facebook: <Facebook className="h-4 w-4 text-blue-600" />,
  instagram: <Instagram className="h-4 w-4 text-pink-500" />,
  youtube: <Youtube className="h-4 w-4 text-red-500" />
};

const SocialMediaIntegration: React.FC = () => {
  const [posts, setPosts] = useState(mockSocialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [platform, setPlatform] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  
  const filteredPosts = posts.filter(post => {
    // Filter by search query
    const matchesSearch = 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by platform
    const matchesPlatform = platform === 'all' || post.platform === platform;
    
    // Filter by date range (simplified for mock data)
    let matchesDate = true;
    if (dateRange === 'today') {
      matchesDate = new Date(post.date).toDateString() === new Date().toDateString();
    } else if (dateRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(post.date) >= weekAgo;
    } else if (dateRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = new Date(post.date) >= monthAgo;
    }
    
    return matchesSearch && matchesPlatform && matchesDate;
  });
  
  const toggleFeatured = (id: string) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, featured: !post.featured } : post
    ));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Social Media Integration</h2>
          <p className="text-gray-600">Curate and feature social media content on the website</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search content..."
              className="pl-9 w-full md:w-auto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <Card key={post.id} className={`overflow-hidden ${post.featured ? 'border-blue-500' : ''}`}>
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={`/avatars/${post.platform}-avatar.png`} alt={post.author} />
                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{post.author}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      {platforms[post.platform as keyof typeof platforms]}
                      <span className="ml-1">{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {post.featured && (
                    <Badge variant="secondary" className="mr-2 bg-blue-50 text-blue-600">
                      Featured
                    </Badge>
                  )}
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ExternalLink size={14} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-2">
                <p className="text-sm mb-3 line-clamp-3">{post.content}</p>
                
                {post.imageUrl && (
                  <div className="mb-3 rounded-md overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt="Social media content"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center">
                      <Star className="h-3 w-3 mr-1" /> {post.likes}
                    </span>
                    <span>|</span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> 
                      {post.scheduledFor ? `Scheduled: ${new Date(post.scheduledFor).toLocaleDateString()}` : 'Not scheduled'}
                    </span>
                  </div>
                  <div>
                    <Switch
                      checked={post.featured}
                      onCheckedChange={() => toggleFeatured(post.id)}
                      aria-label="Toggle featured"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <Search size={48} className="mb-4 opacity-20" />
            <p>No social media posts found matching your filters.</p>
          </div>
        )}
      </div>
      
      <div className="border-t mt-6 pt-4">
        <h3 className="text-lg font-medium mb-3">Website Social Media Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Connected Accounts</CardTitle>
              <CardDescription>Social media accounts connected to the website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(platforms).map(([key, icon]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {icon}
                      <span className="ml-2 capitalize">{key}</span>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      <Check size={12} className="mr-1" /> Connected
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Manage Connections
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Social Feed Settings</CardTitle>
              <CardDescription>Configure how social media appears on the website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="auto-approve" className="text-sm">Auto-approve posts</label>
                <Switch id="auto-approve" />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="show-replies" className="text-sm">Show replies</label>
                <Switch id="show-replies" />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="hide-retweets" className="text-sm">Hide retweets</label>
                <Switch id="hide-retweets" />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="featured-only" className="text-sm">Show only featured posts</label>
                <Switch id="featured-only" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaIntegration;

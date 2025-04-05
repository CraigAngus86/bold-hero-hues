
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Twitter, Facebook, Instagram, ThumbsUp, Share2, MessageCircle, Users, RefreshCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Define interface for social media posts
interface SocialPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram';
  username: string;
  profileImage?: string;
  content: string;
  mediaUrl?: string;
  date: string;
  likes: number;
  comments: number;
  shares?: number;
  url?: string;
}

// Helper function to format relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const secondsDiff = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (secondsDiff < 60) return `${secondsDiff}s ago`;
  if (secondsDiff < 3600) return `${Math.floor(secondsDiff / 60)}m ago`;
  if (secondsDiff < 86400) return `${Math.floor(secondsDiff / 3600)}h ago`;
  if (secondsDiff < 604800) return `${Math.floor(secondsDiff / 86400)}d ago`;
  
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

// Mock function to fetch social media posts - to be replaced with actual API integration
const fetchSocialPosts = async (): Promise<SocialPost[]> => {
  // In a real implementation, this would make API calls to social media platforms
  // For now, we'll return mock data that simulates what would come from the APIs
  
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const posts: SocialPost[] = [
    {
      id: "tweet1",
      platform: "twitter",
      username: "banksodee_fc",
      profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
      content: "𝗙𝗧 | Banks o' Dee 1-0 Turriff United. Craig Duguid's free-kick is enough to secure all three points at Spain Park. #BODHIGHL",
      date: "2025-04-03T14:30:00Z",
      likes: 28,
      comments: 5,
      shares: 8,
      url: "https://x.com/banksodee_fc/status/1234567890"
    },
    {
      id: "insta1",
      platform: "instagram",
      username: "banksodeefc",
      profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
      content: "Full Time | Banks o' Dee 1-0 Turriff United. Craig Duguid's stunning free-kick is enough to secure all three points at Spain Park! ⚽️",
      mediaUrl: "/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png",
      date: "2025-04-03T15:45:00Z",
      likes: 82,
      comments: 7,
      url: "https://www.instagram.com/p/abcdef/"
    },
    {
      id: "fb1",
      platform: "facebook",
      username: "BanksODeeFCOfficial",
      profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
      content: "🎟️ TICKETS | Tickets for our upcoming Highland League match against Brechin City are now available online. Get yours early to avoid queues on matchday!",
      date: "2025-04-02T10:15:00Z",
      likes: 38,
      comments: 5,
      shares: 12,
      url: "https://www.facebook.com/BanksODeeFCOfficial/posts/123456789"
    },
    {
      id: "tweet2",
      platform: "twitter",
      username: "banksodee_fc",
      profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
      content: "📣 NEW SIGNING | We're delighted to announce the signing of midfielder Jack Henderson from Cove Rangers on a two-year deal. Welcome to Spain Park, Jack! #BODTransfer",
      mediaUrl: "/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png",
      date: "2025-04-01T09:30:00Z",
      likes: 92,
      comments: 13,
      shares: 21,
      url: "https://x.com/banksodee_fc/status/0987654321"
    },
    {
      id: "insta2",
      platform: "instagram",
      username: "banksodeefc",
      profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
      content: "💙 Supporting our local community! Players from Banks o' Dee visited Aberdeen Children's Hospital yesterday to donate signed merchandise and spend time with the young patients. #CommunitySpirit",
      mediaUrl: "/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png",
      date: "2025-03-31T16:20:00Z",
      likes: 145,
      comments: 12,
      url: "https://www.instagram.com/p/ghijkl/"
    }
  ];
  
  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const SocialHubModern: React.FC = () => {
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['socialPosts'],
    queryFn: fetchSocialPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000 // Auto-refresh every 10 minutes
  });
  
  // Function to handle manual refresh
  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing social media content...");
  };
  
  // Platform filter state
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Filter posts based on active tab
  const filteredPosts = posts?.filter(post => {
    if (activeTab === 'all') return true;
    return post.platform === activeTab;
  });
  
  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4 text-[#1DA1F2]" />;
      case 'facebook':
        return <Facebook className="h-4 w-4 text-[#1877F2]" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-[#C13584]" />;
      default:
        return null;
    }
  };
  
  // Get platform color
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'bg-[#1DA1F2]/10 text-[#1DA1F2]';
      case 'facebook':
        return 'bg-[#1877F2]/10 text-[#1877F2]';
      case 'instagram': 
        return 'bg-gradient-to-br from-[#FFDC80]/10 via-[#C13584]/10 to-[#5851DB]/10 text-[#C13584]';
      default:
        return '';
    }
  };
  
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-team-blue">Social Hub</h2>
          
          <div className="flex items-center mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 mr-4" 
              onClick={handleRefresh}
            >
              <RefreshCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-[300px]"
            >
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="twitter" className="flex items-center gap-1">
                  <Twitter className="h-3 w-3" />
                  <span className="hidden sm:inline">Twitter</span>
                </TabsTrigger>
                <TabsTrigger value="facebook" className="flex items-center gap-1">
                  <Facebook className="h-3 w-3" />
                  <span className="hidden sm:inline">Facebook</span>
                </TabsTrigger>
                <TabsTrigger value="instagram" className="flex items-center gap-1">
                  <Instagram className="h-3 w-3" />
                  <span className="hidden sm:inline">Instagram</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="animate-pulse">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                          <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="h-40 bg-gray-200 w-full"></div>
                    <div className="p-4 border-t border-gray-100">
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <p>Unable to load social media content. Please try again later.</p>
            <Button variant="outline" className="mt-2" onClick={handleRefresh}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts?.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow flex flex-col">
                  <CardContent className="p-0 flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3 bg-gray-100">
                            {post.profileImage ? (
                              <img 
                                src={post.profileImage} 
                                alt={post.username} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getPlatformIcon(post.platform)
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{post.username}</p>
                            <p className="text-xs text-gray-500">{formatRelativeTime(post.date)}</p>
                          </div>
                        </div>
                        
                        <Badge className={cn("flex items-center gap-1", getPlatformColor(post.platform))}>
                          {getPlatformIcon(post.platform)}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 flex-grow">
                      <p className="text-gray-800 text-sm mb-4">{post.content}</p>
                      
                      {post.mediaUrl && (
                        <div className="mt-3 rounded-md overflow-hidden">
                          <img 
                            src={post.mediaUrl} 
                            alt="Social media content" 
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100 mt-auto">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-gray-500">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            <span className="text-xs">{post.likes}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            <span className="text-xs">{post.comments}</span>
                          </div>
                          {post.shares !== undefined && (
                            <div className="flex items-center text-gray-500">
                              <Share2 className="h-3 w-3 mr-1" />
                              <span className="text-xs">{post.shares}</span>
                            </div>
                          )}
                        </div>
                        
                        <a 
                          href={post.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-team-blue hover:underline flex items-center"
                        >
                          View on {post.platform === 'twitter' ? 'Twitter' : 
                                   post.platform === 'facebook' ? 'Facebook' : 'Instagram'}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Social Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-team-blue">
            <Users className="inline mr-2 h-5 w-5 text-team-blue" />
            Join Our Community
          </h3>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <a 
              href="https://x.com/banksodee_fc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Twitter className="h-6 w-6 text-[#1DA1F2] mb-2" />
              <span className="font-bold">2,480+</span>
              <span className="text-xs text-gray-500">Followers</span>
            </a>
            
            <a 
              href="https://www.facebook.com/BanksODeeFCOfficial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Facebook className="h-6 w-6 text-[#1877F2] mb-2" />
              <span className="font-bold">4,350+</span>
              <span className="text-xs text-gray-500">Likes</span>
            </a>
            
            <a 
              href="https://www.instagram.com/banksodeefc/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Instagram className="h-6 w-6 text-[#C13584] mb-2" />
              <span className="font-bold">3,120+</span>
              <span className="text-xs text-gray-500">Followers</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialHubModern;

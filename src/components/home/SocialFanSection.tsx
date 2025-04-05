
import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Instagram, Facebook, Award, Users, Calendar, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Social media feed data interface
interface SocialPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'facebook';
  username: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  shares?: number;
  mediaUrl?: string;
  profileImage?: string;
  url?: string;
}

// Poll option interface
interface PollOption {
  id: string;
  text: string;
  votes: number;
}

// Mock function to fetch social media posts - this would be replaced with actual API calls
const fetchSocialPosts = async (): Promise<SocialPost[]> => {
  console.log('Fetching social media posts...');
  // This simulates an API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In production, replace this with calls to your Supabase Edge Function
  const posts: SocialPost[] = [
    {
      id: "1",
      platform: "twitter",
      username: "banksodee_fc",
      content: "𝗙𝗧 | Banks o' Dee 1-0 Turriff United. Craig Duguid's free-kick is enough to secure all three points at Spain Park. #BODHIGHL",
      date: "April 5, 2025",
      likes: 28,
      comments: 5,
      shares: 8,
      profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
      url: "https://x.com/banksodee_fc/status/1234567890"
    },
    {
      id: "2",
      platform: "instagram",
      username: "banksodeefc",
      content: "Full Time | Banks o' Dee 1-0 Turriff United. Craig Duguid's stunning free-kick is enough to secure all three points at Spain Park! ⚽️",
      date: "April 4, 2025",
      likes: 82,
      comments: 7,
      mediaUrl: "/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png",
      profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
      url: "https://www.instagram.com/p/abcdef/"
    },
    {
      id: "3",
      platform: "facebook",
      username: "banksodeejfc",
      content: "🎟️ TICKETS | Tickets for our upcoming Highland League match against Brechin City are now available online. Get yours early to avoid queues on matchday!",
      date: "April 1, 2025",
      likes: 38,
      comments: 5,
      shares: 12,
      profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
      url: "https://www.facebook.com/banksodeejfc/posts/123456789"
    },
  ];
  
  // Sort by date (newest first)
  return posts;
};

const SocialFanSection: React.FC = () => {
  // Social media state
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['socialPosts'],
    queryFn: fetchSocialPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000 // Auto-refresh every 10 minutes
  });
  
  const [activeFilter, setActiveFilter] = React.useState<string>('all');
  
  // Filter posts based on active tab
  const filteredPosts = posts?.filter(post => {
    if (activeFilter === 'all') return true;
    return post.platform === activeFilter;
  }) || [];
  
  // Fan poll state
  const [pollOptions, setPollOptions] = React.useState<PollOption[]>([
    { id: '1', text: 'Jamie Buglass', votes: 45 },
    { id: '2', text: 'Michael Philipson', votes: 32 },
    { id: '3', text: 'Lachie MacLeod', votes: 28 }
  ]);
  const [userVoted, setUserVoted] = React.useState<boolean>(false);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  
  // Calculate total votes
  const totalVotes = pollOptions.reduce((sum, option) => sum + option.votes, 0);
  
  // Handle vote submission
  const handleVote = () => {
    if (!selectedOption || userVoted) return;
    
    setPollOptions(prevOptions => 
      prevOptions.map(option => 
        option.id === selectedOption 
          ? { ...option, votes: option.votes + 1 } 
          : option
      )
    );
    
    setUserVoted(true);
    toast.success("Thanks for voting!");
  };
  
  // Get platform icon and styling
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-3.5 h-3.5" />;
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5" />;
      case 'facebook':
        return <Facebook className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };
  
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'bg-[#1DA1F2]/10 text-[#1DA1F2]';
      case 'instagram':
        return 'bg-[#C13584]/10 text-[#C13584]';
      case 'facebook': 
        return 'bg-[#1877F2]/10 text-[#1877F2]';
      default:
        return '';
    }
  };

  const getPlatformUrl = (platform: string, username: string) => {
    switch (platform) {
      case 'twitter':
        return `https://x.com/${username}`;
      case 'instagram':
        return `https://www.instagram.com/${username}/`;
      case 'facebook':
        return `https://www.facebook.com/${username}/`;
      default:
        return '#';
    }
  };
  
  // Refresh posts manually
  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing social media feed...");
  };

  // Fan of the month data
  const fanOfMonth = {
    id: '1',
    name: 'Tommy Wilson',
    quote: 'Been supporting Banks o\' Dee for over 30 years. Through thick and thin, always the blue and white!',
    imageUrl: '/lovable-uploads/ba4e2b09-12ed-48ad-a4ba-1162ab87ad70.png',
    title: 'April 2025 Fan of the Month'
  };
  
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-team-blue mb-6">Community Hub</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Social Media Column */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Social Media</h3>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveFilter('all')}
                  className={`text-xs px-3 py-1 rounded-full ${
                    activeFilter === 'all' 
                      ? 'bg-team-blue text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  All
                </button>
                <button 
                  onClick={() => setActiveFilter('twitter')}
                  className={`text-xs px-3 py-1 rounded-full flex items-center ${
                    activeFilter === 'twitter' 
                      ? 'bg-[#1DA1F2] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  <Twitter className="w-3 h-3 mr-1" /> X
                </button>
                <button 
                  onClick={() => setActiveFilter('instagram')}
                  className={`text-xs px-3 py-1 rounded-full flex items-center ${
                    activeFilter === 'instagram' 
                      ? 'bg-[#C13584] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  <Instagram className="w-3 h-3 mr-1" /> Insta
                </button>
                <button 
                  onClick={() => setActiveFilter('facebook')}
                  className={`text-xs px-3 py-1 rounded-full flex items-center ${
                    activeFilter === 'facebook' 
                      ? 'bg-[#1877F2] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  <Facebook className="w-3 h-3 mr-1" /> FB
                </button>
              </div>
            </div>
            
            {/* Social Media Feed */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse h-40">
                    <div className="p-3 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                        <div>
                          <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                          <div className="h-2 bg-gray-200 rounded w-12"></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="h-12 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-800 text-center">
                <p>Unable to load social media posts. Please try again later.</p>
                <button 
                  onClick={handleRefresh} 
                  className="mt-2 px-4 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredPosts.slice(0, 3).map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-center p-3 border-b border-gray-100">
                      <div className={`p-1.5 rounded-full mr-1.5 ${getPlatformColor(post.platform)}`}>
                        {getPlatformIcon(post.platform)}
                      </div>
                      <div>
                        <p className="font-semibold text-xs">@{post.username}</p>
                        <p className="text-[10px] text-gray-500">{post.date}</p>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-3 flex-1 flex flex-col">
                      <p className="text-xs text-gray-700 mb-2 line-clamp-4 flex-1">{post.content}</p>
                      
                      {post.mediaUrl && (
                        <div className="mb-2 rounded overflow-hidden">
                          <img 
                            src={post.mediaUrl} 
                            alt="Post media" 
                            className="w-full h-auto object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      
                      {/* Stats */}
                      <div className="flex justify-between text-[10px] text-gray-500 mt-auto">
                        <span>{post.likes} Likes</span>
                        <span>{post.comments} Comments</span>
                        {post.shares && <span>{post.shares} Shares</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <a 
                href="https://x.com/banksodee_fc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-team-blue text-white p-2.5 rounded-full hover:bg-team-lightBlue transition-colors"
                aria-label="Twitter/X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/banksodeefc/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-team-blue text-white p-2.5 rounded-full hover:bg-team-lightBlue transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/banksodeejfc/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-team-blue text-white p-2.5 rounded-full hover:bg-team-lightBlue transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Fan Zone Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Fan Zone</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Fan of the Month */}
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-team-blue text-white p-4 flex flex-row items-center gap-4">
                  <Award className="h-5 w-5" />
                  <h3 className="text-md font-semibold">Fan of the Month</h3>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Avatar className="h-16 w-16 rounded-full border-2 border-team-blue">
                      <AvatarImage src={fanOfMonth.imageUrl} alt={fanOfMonth.name} className="object-cover" />
                      <AvatarFallback>TW</AvatarFallback>
                    </Avatar>
                    
                    <div className="text-center sm:text-left">
                      <h4 className="text-md font-bold">{fanOfMonth.name}</h4>
                      <p className="text-xs text-blue-600 mb-1">{fanOfMonth.title}</p>
                      <p className="text-xs text-gray-600 italic">"{fanOfMonth.quote}"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Fan Poll */}
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-team-blue text-white p-4 flex flex-row items-center gap-4">
                  <Users className="h-5 w-5" />
                  <h3 className="text-md font-semibold">Player of the Month</h3>
                </CardHeader>
                
                <CardContent className="p-4">
                  <RadioGroup 
                    disabled={userVoted} 
                    value={selectedOption || undefined} 
                    onValueChange={setSelectedOption}
                  >
                    <div className="space-y-3">
                      {pollOptions.map(option => (
                        <motion.div 
                          key={option.id}
                          whileHover={!userVoted ? { scale: 1.01 } : {}}
                          className={`relative overflow-hidden rounded-md border ${
                            selectedOption === option.id ? 'border-team-blue' : 'border-gray-200'
                          }`}
                        >
                          {userVoted && (
                            <div 
                              className="absolute top-0 left-0 bottom-0 bg-team-lightBlue/20"
                              style={{ width: `${Math.round((option.votes / totalVotes) * 100)}%` }}
                            />
                          )}
                          
                          <div className="relative z-10 p-2 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={option.id} id={option.id} disabled={userVoted} />
                              <Label 
                                htmlFor={option.id}
                                className="cursor-pointer font-medium text-sm"
                              >
                                {option.text}
                              </Label>
                            </div>
                            
                            {userVoted && (
                              <div className="text-xs font-medium">
                                {Math.round((option.votes / totalVotes) * 100)}%
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </RadioGroup>
                  
                  <div className="mt-4 text-xs text-gray-500 flex justify-between">
                    <span>Total votes: {totalVotes}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs py-1"
                      disabled={!selectedOption || userVoted}
                      onClick={handleVote}
                    >
                      {userVoted ? 'Voted' : 'Submit Vote'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Match Countdown */}
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-team-blue text-white p-4 flex flex-row items-center gap-4">
                  <Calendar className="h-5 w-5" />
                  <h3 className="text-md font-semibold">Next Match</h3>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="text-center">
                    <h4 className="text-sm font-semibold mb-1">Banks o' Dee vs Fraserburgh</h4>
                    <p className="text-xs text-gray-500 mb-3">Saturday, April 12th • 15:00 • Spain Park</p>
                    
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-gray-50 p-2 rounded-md">
                        <span className="block text-lg font-bold">4</span>
                        <span className="text-xs text-gray-500">Days</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-md">
                        <span className="block text-lg font-bold">18</span>
                        <span className="text-xs text-gray-500">Hours</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-md">
                        <span className="block text-lg font-bold">45</span>
                        <span className="text-xs text-gray-500">Mins</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-md">
                        <span className="block text-lg font-bold">12</span>
                        <span className="text-xs text-gray-500">Secs</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialFanSection;

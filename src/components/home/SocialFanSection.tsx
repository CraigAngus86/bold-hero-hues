
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Twitter, Instagram, Facebook, ThumbsUp, MessageCircle, Share2, RefreshCcw, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useSocialMedia, formatRelativeTime, SocialPost } from '@/hooks/useSocialMedia';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface FanComment {
  id: string;
  name: string;
  message: string;
  avatar?: string;
  timestamp: string;
  likes: number;
}

// Fan poll interface
interface PollOption {
  id: string;
  text: string;
  votes: number;
}

const SocialFanSection = () => {
  // Social media state
  const { data: posts, isLoading, error, refetch } = useSocialMedia();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Filter posts based on active tab
  const filteredPosts = posts?.filter(post => {
    if (activeFilter === 'all') return true;
    return post.platform === activeFilter;
  }) || [];

  // Fan comment state
  const [fanName, setFanName] = useState('');
  const [fanMessage, setFanMessage] = useState('');
  const [fanComments, setFanComments] = useState<FanComment[]>([
    {
      id: '1',
      name: 'Jamie MacDonald',
      message: 'Great win on Saturday lads! That free-kick from Duguid was absolute class 🔥',
      avatar: '',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 7
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      message: 'Will tickets for the Fraserburgh match be available online soon?',
      avatar: '',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      likes: 2
    },
    {
      id: '3',
      name: 'Alan Robertson',
      message: 'Been supporting Banks o\' Dee for 20+ years now. This season is looking promising! #COYD',
      avatar: '',
      timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      likes: 15
    }
  ]);

  // Poll state
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: '1', text: 'Jamie Buglass', votes: 45 },
    { id: '2', text: 'Michael Philipson', votes: 32 },
    { id: '3', text: 'Lachie MacLeod', votes: 28 }
  ]);
  const [userVoted, setUserVoted] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Calculate total votes
  const totalVotes = pollOptions.reduce((sum, option) => sum + option.votes, 0);

  // Handle submitting a fan comment
  const handleSubmitComment = () => {
    if (!fanName.trim() || !fanMessage.trim()) {
      toast.error('Please enter your name and message');
      return;
    }
    
    const newComment: FanComment = {
      id: Date.now().toString(),
      name: fanName.trim(),
      message: fanMessage.trim(),
      timestamp: new Date().toISOString(),
      likes: 0
    };
    
    setFanComments(prev => [newComment, ...prev]);
    setFanName('');
    setFanMessage('');
    toast.success('Comment posted successfully!');
  };

  // Handle liking a comment
  const handleLikeComment = (id: string) => {
    setFanComments(prev =>
      prev.map(comment =>
        comment.id === id
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };
  
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

  // Refresh posts manually
  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing social media feed...");
  };

  // Platform styling helpers
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

  return (
    <section className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-team-blue">
            <span className="bg-gradient-to-r from-team-blue to-team-lightBlue bg-clip-text text-transparent">
              Connect With Us
            </span>
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Join thousands of fans following Banks o' Dee across social media and be part of our community
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SOCIAL MEDIA COLUMN */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="mr-2">Latest Updates</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </h3>
              
              <div className="flex space-x-1">
                <Button 
                  onClick={() => setActiveFilter('all')}
                  className={`text-xs h-7 px-2 rounded-full ${
                    activeFilter === 'all' 
                      ? 'bg-team-blue text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  variant={activeFilter === 'all' ? 'default' : 'ghost'}
                  size="sm"
                >
                  All
                </Button>
                <Button 
                  onClick={() => setActiveFilter('twitter')}
                  className={`text-xs h-7 px-2 flex items-center rounded-full ${
                    activeFilter === 'twitter' 
                      ? 'bg-[#1DA1F2] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  variant="ghost"
                  size="sm"
                >
                  <Twitter className="w-3 h-3 mr-1" /> X
                </Button>
                <Button 
                  onClick={() => setActiveFilter('instagram')}
                  className={`text-xs h-7 px-2 flex items-center rounded-full ${
                    activeFilter === 'instagram' 
                      ? 'bg-[#C13584] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  variant="ghost"
                  size="sm"
                >
                  <Instagram className="w-3 h-3 mr-1" /> IG
                </Button>
                <Button 
                  onClick={() => setActiveFilter('facebook')}
                  className={`text-xs h-7 px-2 flex items-center rounded-full ${
                    activeFilter === 'facebook' 
                      ? 'bg-[#1877F2] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  variant="ghost"
                  size="sm"
                >
                  <Facebook className="w-3 h-3 mr-1" /> FB
                </Button>
              </div>
            </div>
            
            {/* Compact Social Media Feed with 3 columns */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 h-[600px] overflow-y-auto pb-4">
                {Array(9).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse h-32">
                    <div className="h-8 bg-gray-100 flex items-center px-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full mr-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="p-2">
                      <div className="h-12 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-800 text-center">
                <p>Unable to load social media posts. Please try again later.</p>
                <Button 
                  onClick={handleRefresh} 
                  className="mt-2"
                  variant="outline"
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 h-[600px] overflow-y-auto pb-4">
                {filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-center p-2 border-b border-gray-100">
                      <div className={`p-1 rounded-full mr-1.5 ${getPlatformColor(post.platform)}`}>
                        {getPlatformIcon(post.platform)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium text-xs truncate">@{post.username}</p>
                        <p className="text-[10px] text-gray-500">{formatRelativeTime(post.date)}</p>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-2 flex-1 flex flex-col">
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
                      
                      <p className="text-xs text-gray-700 line-clamp-3 flex-1">{post.content}</p>
                      
                      {/* Stats */}
                      <div className="flex justify-between text-[10px] text-gray-500 mt-2">
                        <span className="flex items-center"><ThumbsUp className="h-2.5 w-2.5 mr-1" />{post.likes}</span>
                        <span className="flex items-center"><MessageCircle className="h-2.5 w-2.5 mr-1" />{post.comments}</span>
                        {post.shares !== undefined && <span className="flex items-center"><Share2 className="h-2.5 w-2.5 mr-1" />{post.shares}</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            <div className="flex justify-center space-x-4 mt-4">
              <a 
                href="https://x.com/banksodee_fc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-team-blue text-white p-2 rounded-full hover:bg-team-lightBlue transition-colors"
                aria-label="Twitter/X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/banksodeefc/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-team-blue text-white p-2 rounded-full hover:bg-team-lightBlue transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/banksodeejfc/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-team-blue text-white p-2 rounded-full hover:bg-team-lightBlue transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* FAN ZONE COLUMN */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Fan Zone</h3>
            
            <div className="space-y-4">
              {/* Fan Wall */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-team-blue text-white p-3 flex justify-between items-center">
                    <h4 className="font-medium text-sm">Fan Wall</h4>
                    <Badge variant="outline" className="text-xs text-white border-white">
                      {fanComments.length} comments
                    </Badge>
                  </div>
                  
                  {/* Comment submission form */}
                  <div className="p-3 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-1 gap-3">
                      <Input
                        placeholder="Your Name"
                        className="text-sm"
                        value={fanName}
                        onChange={(e) => setFanName(e.target.value)}
                      />
                      <Textarea
                        placeholder="Share your thoughts..."
                        className="text-sm resize-none"
                        rows={2}
                        value={fanMessage}
                        onChange={(e) => setFanMessage(e.target.value)}
                      />
                      <Button
                        className="w-full"
                        size="sm"
                        onClick={handleSubmitComment}
                      >
                        <Send className="h-3.5 w-3.5 mr-2" /> Post Comment
                      </Button>
                    </div>
                  </div>
                  
                  {/* Comments list */}
                  <div className="max-h-[200px] overflow-y-auto">
                    {fanComments.map((comment) => (
                      <div 
                        key={comment.id} 
                        className="p-3 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback className="text-[10px]">
                                {comment.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-xs">{comment.name}</span>
                          </div>
                          <span className="text-[10px] text-gray-500">
                            {formatRelativeTime(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs mt-1 text-gray-700">{comment.message}</p>
                        <div className="flex justify-end mt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleLikeComment(comment.id)}
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" /> {comment.likes}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Fan Poll */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-team-blue text-white p-3">
                    <h4 className="font-medium text-sm">Player of the Month</h4>
                  </div>
                  
                  <div className="p-3">
                    <RadioGroup 
                      disabled={userVoted} 
                      value={selectedOption || undefined} 
                      onValueChange={setSelectedOption}
                    >
                      <div className="space-y-2">
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
                    
                    <div className="mt-3 text-xs text-gray-500 flex justify-between">
                      <span>Total votes: {totalVotes}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs py-1 h-7"
                        disabled={!selectedOption || userVoted}
                        onClick={handleVote}
                      >
                        {userVoted ? 'Voted' : 'Submit Vote'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Next Match Countdown */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-team-blue text-white p-3">
                    <h4 className="font-medium text-sm">Next Match Countdown</h4>
                  </div>
                  
                  <div className="p-3 text-center">
                    <h5 className="text-sm font-semibold mb-1">Banks o' Dee vs Fraserburgh</h5>
                    <p className="text-xs text-gray-500 mb-3">Saturday, April 12th • 15:00 • Spain Park</p>
                    
                    <div className="grid grid-cols-4 gap-1.5">
                      <div className="bg-gray-50 p-1.5 rounded-md">
                        <span className="block text-lg font-bold">4</span>
                        <span className="text-xs text-gray-500">Days</span>
                      </div>
                      <div className="bg-gray-50 p-1.5 rounded-md">
                        <span className="block text-lg font-bold">18</span>
                        <span className="text-xs text-gray-500">Hours</span>
                      </div>
                      <div className="bg-gray-50 p-1.5 rounded-md">
                        <span className="block text-lg font-bold">45</span>
                        <span className="text-xs text-gray-500">Mins</span>
                      </div>
                      <div className="bg-gray-50 p-1.5 rounded-md">
                        <span className="block text-lg font-bold">12</span>
                        <span className="text-xs text-gray-500">Secs</span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-3" size="sm">
                      Buy Tickets
                    </Button>
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

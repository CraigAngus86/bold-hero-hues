
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, Instagram, Facebook, ThumbsUp, MessageCircle, Share2, RefreshCcw, Send, Clock, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useSocialMedia, formatRelativeTime, SocialPost } from '@/hooks/useSocialMedia';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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

  // Countdown timer for next match
  const [countdown, setCountdown] = useState({
    days: 4,
    hours: 18,
    minutes: 45,
    seconds: 12
  });

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        // Simple countdown logic - for a real application, this would be calculated based on a match date
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

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

  // Define card variants for staggered animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    })
  };

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-team-blue via-team-navy to-team-lightBlue bg-clip-text text-transparent">
              Connect With The Team
            </span>
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg"
          >
            Join thousands of fans following Banks o' Dee across social media and be part of our growing community
          </motion.p>
          <div className="flex justify-center mt-6">
            <motion.div 
              className="h-1 w-24 bg-gradient-to-r from-team-blue to-team-lightBlue rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
            />
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SOCIAL MEDIA COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-team-blue flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                <span>Latest Updates</span>
              </h3>
              
              <div className="flex space-x-1">
                <Button 
                  onClick={() => setActiveFilter('all')}
                  className={`text-xs h-7 px-2 rounded-full ${
                    activeFilter === 'all' 
                      ? 'bg-team-blue text-white shadow-lg shadow-blue-500/30' 
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
                      ? 'bg-[#1DA1F2] text-white shadow-lg shadow-blue-500/30' 
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
                      ? 'bg-[#C13584] text-white shadow-lg shadow-pink-500/30' 
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
                      ? 'bg-[#1877F2] text-white shadow-lg shadow-blue-500/30' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  variant="ghost"
                  size="sm"
                >
                  <Facebook className="w-3 h-3 mr-1" /> FB
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-full border-gray-200"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCcw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-team-blue' : 'text-gray-500'}`} />
              </Button>
            </div>
            
            {/* Compact Social Media Feed with 3 columns */}
            <div className="relative p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Fancy gradient border */}
              <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 border border-gradient-to-r from-team-blue via-team-lightBlue to-team-blue rounded-xl opacity-30"></div>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 h-[600px] overflow-y-auto pb-4">
                  {Array(9).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse h-32 border border-gray-100">
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
                <div className="bg-red-50 p-6 rounded-lg text-red-800 text-center">
                  <p className="font-medium">Unable to load social media posts.</p>
                  <p className="text-sm mt-1 mb-3">Please check your connection and try again later.</p>
                  <Button 
                    onClick={handleRefresh} 
                    className="mt-2 bg-white text-red-600 hover:bg-red-50"
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCcw className="w-3.5 h-3.5 mr-1.5" />
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 h-[600px] overflow-y-auto scrollbar-hide pb-4 pr-1">
                  <AnimatePresence>
                    {filteredPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        custom={index}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        className="bg-white rounded-md overflow-hidden shadow hover:shadow-md transition-all duration-300 flex flex-col border border-gray-100"
                      >
                        {/* Header */}
                        <div className="flex items-center p-2 border-b border-gray-50 bg-gray-50/50">
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
                  </AnimatePresence>
                </div>
              )}
            </div>
            
            <div className="flex justify-center space-x-6 mt-6">
              <motion.a 
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
                href="https://x.com/banksodee_fc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-team-blue to-team-navy text-white p-2.5 rounded-full shadow-lg hover:shadow-xl"
                aria-label="Twitter/X"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ duration: 0.2 }}
                href="https://www.instagram.com/banksodeefc/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-team-blue to-team-navy text-white p-2.5 rounded-full shadow-lg hover:shadow-xl"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
                href="https://www.facebook.com/banksodeejfc/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-team-blue to-team-navy text-white p-2.5 rounded-full shadow-lg hover:shadow-xl"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
          
          {/* FAN ZONE COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-team-blue mb-6 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              <span>Fan Zone</span>
            </h3>
            
            <div className="space-y-6">
              {/* Fan Wall */}
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-0">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-team-blue to-team-navy text-white p-4 flex justify-between items-center">
                    <h4 className="font-semibold">Fan Wall</h4>
                    <Badge variant="outline" className="text-xs text-white border-white">
                      {fanComments.length} comments
                    </Badge>
                  </div>
                  
                  {/* Comment submission form */}
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-1 gap-3">
                      <Input
                        placeholder="Your Name"
                        className="text-sm border-gray-200 focus-visible:ring-team-blue"
                        value={fanName}
                        onChange={(e) => setFanName(e.target.value)}
                      />
                      <Textarea
                        placeholder="Share your thoughts with fellow fans..."
                        className="text-sm resize-none border-gray-200 focus-visible:ring-team-blue"
                        rows={2}
                        value={fanMessage}
                        onChange={(e) => setFanMessage(e.target.value)}
                      />
                      <Button
                        className="w-full bg-gradient-to-r from-team-blue to-team-navy hover:from-team-navy hover:to-team-blue transition-all duration-500"
                        size="sm"
                        onClick={handleSubmitComment}
                      >
                        <Send className="h-3.5 w-3.5 mr-2" /> Post Comment
                      </Button>
                    </div>
                  </div>
                  
                  {/* Comments list */}
                  <div className="max-h-[200px] overflow-y-auto scrollbar-hide">
                    <AnimatePresence>
                      {fanComments.map((comment, index) => (
                        <motion.div 
                          key={comment.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="p-3 border-b border-gray-100 hover:bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2 border border-team-blue/20">
                                <AvatarFallback className="text-[10px] bg-gradient-to-br from-team-blue/10 to-team-lightBlue/10 text-team-blue">
                                  {comment.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-xs">{comment.name}</span>
                            </div>
                            <span className="text-[10px] text-gray-500">
                              {formatRelativeTime(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs mt-1.5 text-gray-700">{comment.message}</p>
                          <div className="flex justify-end mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-gray-500 hover:text-team-blue"
                              onClick={() => handleLikeComment(comment.id)}
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" /> {comment.likes}
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
              
              {/* Fan Poll */}
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-0">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-team-blue to-team-navy text-white p-4">
                    <h4 className="font-semibold">Player of the Month</h4>
                  </div>
                  
                  <div className="p-4">
                    <RadioGroup 
                      disabled={userVoted} 
                      value={selectedOption || undefined} 
                      onValueChange={setSelectedOption}
                    >
                      <div className="space-y-3">
                        {pollOptions.map((option, index) => (
                          <motion.div 
                            key={option.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ 
                              opacity: 1, 
                              y: 0,
                              transition: {
                                delay: index * 0.1,
                                duration: 0.3
                              }
                            }}
                            whileHover={!userVoted ? { scale: 1.01 } : {}}
                            className={`relative overflow-hidden rounded-md border ${
                              selectedOption === option.id ? 'border-team-blue' : 'border-gray-200'
                            }`}
                          >
                            {userVoted && (
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ 
                                  width: `${Math.round((option.votes / totalVotes) * 100)}%`,
                                  transition: { duration: 1, delay: 0.3, ease: "easeOut" }
                                }}
                                className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-team-lightBlue/10 to-team-blue/20"
                              />
                            )}
                            
                            <div className="relative z-10 p-2.5 flex items-center justify-between">
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
                                <div className="text-sm font-medium text-team-blue">
                                  {Math.round((option.votes / totalVotes) * 100)}%
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </RadioGroup>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-gray-500">Total votes: {totalVotes}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={`text-xs py-1.5 h-8 ${!selectedOption || userVoted ? '' : 'border-team-blue text-team-blue hover:bg-team-blue/5'}`}
                        disabled={!selectedOption || userVoted}
                        onClick={handleVote}
                      >
                        {userVoted ? 'Thanks for voting!' : 'Submit Vote'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Next Match Countdown */}
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-0">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-team-blue to-team-navy text-white p-4">
                    <h4 className="font-semibold">Next Match</h4>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-team-blue" />
                        <span className="text-sm">Saturday, April 12th</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-team-blue" />
                        <span className="text-sm">15:00</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4 mb-3">
                      <div className="text-center">
                        <img 
                          src="/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png" 
                          alt="Banks o' Dee FC" 
                          className="h-12 w-auto mx-auto"
                        />
                        <p className="font-semibold text-sm mt-1">Banks o' Dee</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-400">vs</div>
                      </div>
                      <div className="text-center">
                        <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                          <span className="text-xs font-semibold">FRA</span>
                        </div>
                        <p className="font-semibold text-sm mt-1">Fraserburgh</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center mb-3">
                      <MapPin className="h-4 w-4 mr-1.5 text-team-blue" />
                      <span className="text-sm">Spain Park Stadium</span>
                    </div>
                    
                    <p className="text-center text-xs text-gray-500 mb-3">Countdown to Kickoff</p>
                    
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <motion.div 
                        className="bg-gradient-to-br from-gray-50 to-gray-100 p-2 rounded-md text-center border border-gray-200"
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="block text-xl font-bold text-team-blue">{countdown.days}</span>
                        <span className="text-xs text-gray-500">Days</span>
                      </motion.div>
                      <motion.div 
                        className="bg-gradient-to-br from-gray-50 to-gray-100 p-2 rounded-md text-center border border-gray-200"
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="block text-xl font-bold text-team-blue">{countdown.hours}</span>
                        <span className="text-xs text-gray-500">Hours</span>
                      </motion.div>
                      <motion.div 
                        className="bg-gradient-to-br from-gray-50 to-gray-100 p-2 rounded-md text-center border border-gray-200"
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="block text-xl font-bold text-team-blue">{countdown.minutes}</span>
                        <span className="text-xs text-gray-500">Mins</span>
                      </motion.div>
                      <motion.div 
                        className="bg-gradient-to-br from-gray-50 to-gray-100 p-2 rounded-md text-center border border-gray-200"
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="block text-xl font-bold text-team-blue">{countdown.seconds}</span>
                        <span className="text-xs text-gray-500">Secs</span>
                      </motion.div>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-team-blue to-team-navy hover:from-team-navy hover:to-team-blue transition-all duration-500">
                      Buy Tickets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SocialFanSection;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Twitter, 
  Instagram, 
  Facebook, 
  Send, 
  ThumbsUp, 
  MessageCircle, 
  BarChart2,
  Calendar,
  RefreshCw,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSocialMedia, formatRelativeTime, type SocialPost } from '@/hooks/useSocialMedia';

const SocialFanSection = () => {
  const [activeTab, setActiveTab] = useState('social');
  const [postContent, setPostContent] = useState('');
  const [votingOption, setVotingOption] = useState<number | null>(null);
  
  const dummySocialMedia = [
    {
      id: "1",
      platform: "twitter",
      username: "banksodee_fc",
      content: "𝗙𝗧 | Banks o' Dee 1-0 Turriff United. Craig Duguid's free-kick is enough to secure all three points at Spain Park. #BODHIGHL",
      date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
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
      date: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
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
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      likes: 38,
      comments: 5,
      shares: 12,
      profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
      url: "https://www.facebook.com/banksodeejfc/posts/123456789"
    },
    {
      id: "4",
      platform: "twitter",
      username: "banksodee_fc", 
      content: "📣 NEW SIGNING | We're delighted to announce the signing of midfielder Jack Henderson from Cove Rangers on a two-year deal. Welcome to Spain Park, Jack! #BODTransfer",
      date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      likes: 92,
      comments: 13,
      shares: 21,
      mediaUrl: "/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png",
      profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
      url: "https://x.com/banksodee_fc/status/0987654321"
    },
    {
      id: "5",
      platform: "instagram",
      username: "banksodeefc",
      content: "💙 Supporting our local community! Players from Banks o' Dee visited Aberdeen Children's Hospital yesterday to donate signed merchandise and spend time with the young patients. #CommunitySpirit",
      date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      likes: 145,
      comments: 12,
      mediaUrl: "/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png",
      profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
      url: "https://www.instagram.com/p/ghijkl/"
    },
    {
      id: "6",
      platform: "facebook",
      username: "banksodeejfc",
      content: "🏆 THROWBACK | On this day in 2022, Banks o' Dee lifted the Evening Express Aberdeenshire Cup after a thrilling 3-2 victory against Buckie Thistle at Harlaw Park. What a day for the club!",
      date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      likes: 123,
      comments: 18,
      shares: 15,
      profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
      url: "https://www.facebook.com/banksodeejfc/posts/123456789"
    }
  ];

  const dummyFanPosts = [
    {
      id: "fan1",
      name: "Jamie K.",
      profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
      content: "Great win yesterday lads! That free kick was world class!",
      date: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      likes: 12,
      comments: 2
    },
    {
      id: "fan2",
      name: "Sarah M.",
      profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
      content: "Anyone got a spare ticket for the Brechin game? My son's desperate to go!",
      date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      likes: 8,
      comments: 7
    },
    {
      id: "fan3",
      name: "David T.",
      profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
      content: "The new away kit looks amazing. Just ordered mine, can't wait for it to arrive!",
      date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      likes: 24,
      comments: 9
    },
    {
      id: "fan4",
      name: "Moira A.",
      profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
      content: "Photos from Saturday's match are up on the website now. Some great shots of Duguid's free kick!",
      date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      likes: 31,
      comments: 5
    }
  ];

  const pollQuestion = "Who will win the Highland League this season?";
  const pollOptions = [
    { id: 1, text: "Banks o' Dee", votes: 127 },
    { id: 2, text: "Buckie Thistle", votes: 85 },
    { id: 3, text: "Brechin City", votes: 94 },
    { id: 4, text: "Someone else", votes: 56 }
  ];

  const totalVotes = pollOptions.reduce((sum, option) => sum + option.votes, 0);

  const nextHomeGameDate = new Date("2025-04-12T15:00:00");
  const timeUntilGame = nextHomeGameDate.getTime() - Date.now();
  const daysUntilGame = Math.floor(timeUntilGame / (1000 * 60 * 60 * 24));
  const hoursUntilGame = Math.floor((timeUntilGame % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-4 h-4 text-[#1DA1F2]" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-[#C13584]" />;
      case 'facebook':
        return <Facebook className="w-4 h-4 text-[#1877F2]" />;
      default:
        return null;
    }
  };

  const handleSubmitPost = () => {
    if (postContent.trim()) {
      alert("Your post has been submitted for moderation!");
      setPostContent('');
    }
  };

  const handleVote = (optionId: number) => {
    setVotingOption(optionId);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold text-team-blue"
          >
            Fan Zone & Social Media
          </motion.h2>
          
          <div className="flex space-x-3">
            <a 
              href="https://x.com/banksodee_fc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-team-blue text-white p-2 rounded-full hover:bg-team-lightBlue hover:text-team-blue transition-colors shadow-md"
              aria-label="Twitter/X"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://www.instagram.com/banksodeefc/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-team-blue text-white p-2 rounded-full hover:bg-team-lightBlue hover:text-team-blue transition-colors shadow-md"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://www.facebook.com/banksodeejfc/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-team-blue text-white p-2 rounded-full hover:bg-team-lightBlue hover:text-team-blue transition-colors shadow-md"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <Tabs defaultValue="social" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6 bg-gray-100">
            <TabsTrigger 
              value="social" 
              className="text-base data-[state=active]:bg-team-blue data-[state=active]:text-white"
            >
              Official Social
            </TabsTrigger>
            <TabsTrigger 
              value="fans" 
              className="text-base data-[state=active]:bg-team-blue data-[state=active]:text-white"
            >
              Fan Wall
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="social" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 h-[500px] overflow-y-auto p-1">
                  {dummySocialMedia.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all h-fit"
                    >
                      <div className="p-3 border-b border-gray-100">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-2">
                            <Avatar className="h-8 w-8 border border-gray-200">
                              <AvatarImage src={post.profileImage} alt={post.username} />
                              <AvatarFallback>{post.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate flex items-center">
                              @{post.username}
                              <span className="ml-1">
                                <PlatformIcon platform={post.platform} />
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">{formatRelativeTime(post.date)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3">
                        <p className="text-sm text-gray-800 mb-3 line-clamp-4">{post.content}</p>
                        
                        {post.mediaUrl && (
                          <div className="mb-3 rounded-md overflow-hidden">
                            <img 
                              src={post.mediaUrl} 
                              alt="Media content" 
                              className="w-full h-32 object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                          <span className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" /> {post.likes}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="w-3 h-3 mr-1" /> {post.comments}
                          </span>
                          {post.shares && (
                            <span className="flex items-center">
                              <RefreshCw className="w-3 h-3 mr-1" /> {post.shares}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-1 space-y-4">
                <Card className="overflow-hidden border-none shadow-lg">
                  <CardContent className="p-5">
                    <div className="flex items-center mb-4">
                      <BarChart2 className="w-5 h-5 text-team-blue mr-2" />
                      <h3 className="font-bold text-lg text-team-blue">Fan Poll</h3>
                    </div>
                    
                    <p className="font-medium text-base mb-4">{pollQuestion}</p>
                    
                    <div className="space-y-3">
                      {pollOptions.map((option) => {
                        const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                        return (
                          <div key={option.id} className="relative">
                            <button
                              onClick={() => handleVote(option.id)}
                              className={`w-full text-left px-4 py-2 rounded-md text-sm ${
                                votingOption === option.id
                                  ? 'bg-team-blue text-white font-medium'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                              }`}
                            >
                              {option.text}
                            </button>
                            
                            <div className="mt-1 flex items-center">
                              <div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2">
                                <div 
                                  className="bg-team-blue h-1.5 rounded-full" 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600 font-medium">{percentage}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-4 text-center">
                      {totalVotes} votes • Poll ends in 3 days
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden border-none shadow-lg bg-team-blue text-white">
                  <CardContent className="p-5">
                    <div className="flex items-center mb-4">
                      <Calendar className="w-5 h-5 mr-2" />
                      <h3 className="font-bold text-lg">Next Home Game</h3>
                    </div>
                    
                    <div className="text-center">
                      <p className="font-medium mb-2">Banks o' Dee vs Brechin City</p>
                      <p className="text-sm text-team-lightBlue mb-4">Highland League • Spain Park</p>
                      
                      <div className="bg-team-navy/30 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <p className="text-3xl font-bold">{daysUntilGame}</p>
                            <p className="text-xs text-team-lightBlue uppercase">Days</p>
                          </div>
                          <div className="text-center">
                            <p className="text-3xl font-bold">{hoursUntilGame}</p>
                            <p className="text-xs text-team-lightBlue uppercase">Hours</p>
                          </div>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-team-lightBlue text-team-blue hover:bg-white">
                        Get Tickets
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="fans" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3 h-[500px] overflow-y-auto px-1 space-y-4">
                {dummyFanPosts.map(post => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
                  >
                    <div className="flex items-center mb-3">
                      <Avatar className="h-10 w-10 border border-gray-200">
                        <AvatarImage src={post.profileImage} alt={post.name} />
                        <AvatarFallback>{post.name.substring(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{post.name}</p>
                        <p className="text-xs text-gray-500">{formatRelativeTime(post.date)}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-800 mb-3">{post.content}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                      <span className="flex items-center">
                        <ThumbsUp className="w-4 h-4 mr-1" /> {post.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" /> {post.comments}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-team-blue hover:text-team-navy hover:bg-team-lightBlue/30"
                      >
                        Reply
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="md:col-span-1 relative">
                <div className="sticky top-4">
                  <Card>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg text-team-blue mb-4 flex items-center">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Join the Conversation
                      </h3>
                      
                      <div className="space-y-4">
                        <Textarea 
                          placeholder="Share your thoughts about Banks o' Dee FC..." 
                          className="min-h-[120px] border-team-blue/20"
                          value={postContent}
                          onChange={(e) => setPostContent(e.target.value)}
                        />
                        
                        <Button 
                          onClick={handleSubmitPost} 
                          className="w-full bg-team-blue hover:bg-team-navy flex items-center justify-center"
                          disabled={!postContent.trim()}
                        >
                          <Send className="w-4 h-4 mr-2" /> Post to Fan Wall
                        </Button>
                        
                        <p className="text-xs text-gray-500 text-center">
                          All posts are moderated before appearing on the fan wall. 
                          Please follow our <a href="#" className="text-team-blue hover:underline">community guidelines</a>.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default SocialFanSection;

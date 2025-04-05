
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Twitter, Facebook, Instagram, ThumbsUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram';
  content: string;
  author: string;
  date: string;
  likes: number;
  imageUrl?: string;
}

interface FanOfMonth {
  id: string;
  name: string;
  quote: string;
  imageUrl: string;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface SocialStats {
  twitter: number;
  facebook: number;
  instagram: number;
}

const SocialHub = () => {
  // Mock data - in a real implementation this would come from an API or database
  const socialPosts: SocialPost[] = [
    {
      id: '1',
      platform: 'twitter',
      content: 'Fantastic win today! The team showed great character coming back from behind. #BanksDee #HighlandLeague',
      author: '@BanksODeeFC',
      date: '2h ago',
      likes: 45,
      imageUrl: '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png'
    },
    {
      id: '2',
      platform: 'facebook',
      content: 'Congratulations to our Man of the Match, Jamie Buglass, after yesterday\'s impressive performance against Formartine United!',
      author: 'Banks O\' Dee FC',
      date: '1d ago',
      likes: 67,
      imageUrl: '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png'
    },
    {
      id: '3',
      platform: 'instagram',
      content: 'Training session ahead of Saturday\'s big match. The lads are looking focused! #SpainPark',
      author: '@banksofinsta',
      date: '3d ago',
      likes: 89,
      imageUrl: '/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png'
    }
  ];

  const fanOfMonth: FanOfMonth = {
    id: '1',
    name: 'Tommy Wilson',
    quote: 'Been supporting Banks o\' Dee for over 30 years. Through thick and thin, always the blue and white!',
    imageUrl: '/lovable-uploads/ba4e2b09-12ed-48ad-a4ba-1162ab87ad70.png'
  };

  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: '1', text: 'Jamie Buglass', votes: 45 },
    { id: '2', text: 'Michael Philipson', votes: 32 },
    { id: '3', text: 'Lachie MacLeod', votes: 28 }
  ]);

  const [userVoted, setUserVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const socialStats: SocialStats = {
    twitter: 2480,
    facebook: 4350,
    instagram: 3120
  };

  // Vote on poll
  const handleVote = (optionId: string) => {
    if (userVoted) return;
    
    setSelectedOption(optionId);
    setPollOptions(options => options.map(option => 
      option.id === optionId 
        ? { ...option, votes: option.votes + 1 } 
        : option
    ));
    setUserVoted(true);
  };

  // Calculate total votes for poll percentage
  const totalVotes = pollOptions.reduce((sum, option) => sum + option.votes, 0);

  // Helper function to render the appropriate social media icon
  const renderSocialIcon = (platform: SocialPost['platform']) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="text-[#1DA1F2] w-5 h-5" />;
      case 'facebook':
        return <Facebook className="text-[#4267B2] w-5 h-5" />;
      case 'instagram':
        return <Instagram className="text-[#C13584] w-5 h-5" />;
    }
  };

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-team-blue mb-8">
          Fan Zone & Social Hub
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Social Media Feed (Left Side on Desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-team-blue border-b border-gray-200 pb-2">
              Latest Social Updates
            </h3>
            
            <div className="space-y-4">
              {socialPosts.map(post => (
                <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {post.imageUrl && (
                        <div className="sm:w-1/3">
                          <img 
                            src={post.imageUrl} 
                            alt="Post image" 
                            className="h-full w-full object-cover aspect-video sm:aspect-square" 
                          />
                        </div>
                      )}
                      
                      <div className={cn(
                        "p-4 flex-1",
                        post.imageUrl ? "sm:w-2/3" : "w-full"
                      )}>
                        <div className="flex items-center mb-2">
                          {renderSocialIcon(post.platform)}
                          <span className="ml-2 font-medium text-gray-700">{post.author}</span>
                          <span className="ml-auto text-xs text-gray-500">{post.date}</span>
                        </div>
                        
                        <p className="text-gray-800 mb-3">{post.content}</p>
                        
                        <div className="flex items-center text-xs text-gray-500">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          <span>{post.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-4">
              <a 
                href="https://twitter.com/BanksODeeFC" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-team-blue hover:text-team-navy text-sm font-medium flex items-center"
              >
                Follow us for more updates
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Fan Zone (Right Side on Desktop) */}
          <div className="space-y-6">
            {/* Fan of the Month */}
            <div>
              <h3 className="text-lg font-semibold text-team-blue border-b border-gray-200 pb-2 mb-4">
                Fan of the Month
              </h3>
              
              <Card className="overflow-hidden bg-gradient-to-br from-team-blue to-team-navy text-white">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={fanOfMonth.imageUrl} 
                        alt={fanOfMonth.name} 
                        className="w-20 h-20 rounded-full border-2 border-white object-cover" 
                      />
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-lg">{fanOfMonth.name}</h4>
                      <p className="text-sm italic opacity-90">"{fanOfMonth.quote}"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Poll */}
            <div>
              <h3 className="text-lg font-semibold text-team-blue border-b border-gray-200 pb-2 mb-4">
                Fan Poll: Player of the Month
              </h3>
              
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {pollOptions.map(option => (
                      <div key={option.id} className="relative">
                        <div 
                          className={cn(
                            "w-full p-3 border rounded-md relative overflow-hidden transition-all cursor-pointer",
                            selectedOption === option.id ? "border-team-blue" : "border-gray-200 hover:border-gray-300",
                            userVoted ? "cursor-default" : "hover:bg-gray-50"
                          )}
                          onClick={() => handleVote(option.id)}
                        >
                          {/* Progress bar (only shown after voting) */}
                          {userVoted && (
                            <div 
                              className="absolute top-0 left-0 bottom-0 bg-team-lightBlue/30 z-0"
                              style={{ width: `${Math.round((option.votes / totalVotes) * 100)}%` }}
                            />
                          )}
                          
                          <div className="flex items-center justify-between relative z-10">
                            <span className="font-medium">{option.text}</span>
                            {userVoted && (
                              <span className="text-sm">{Math.round((option.votes / totalVotes) * 100)}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500 flex justify-between">
                    <span>Total votes: {totalVotes}</span>
                    {userVoted ? (
                      <span>Thanks for voting!</span>
                    ) : (
                      <span>Click to vote</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Social Stats */}
            <div>
              <h3 className="text-lg font-semibold text-team-blue border-b border-gray-200 pb-2 mb-4">
                Our Community
              </h3>
              
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                      <Twitter className="text-[#1DA1F2] w-6 h-6 mb-1" />
                      <div className="text-lg font-bold">{socialStats.twitter.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                    
                    <div className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                      <Facebook className="text-[#4267B2] w-6 h-6 mb-1" />
                      <div className="text-lg font-bold">{socialStats.facebook.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Likes</div>
                    </div>
                    
                    <div className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                      <Instagram className="text-[#C13584] w-6 h-6 mb-1" />
                      <div className="text-lg font-bold">{socialStats.instagram.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-center">
                    <Users className="w-4 h-4 text-team-blue mr-2" />
                    <span className="text-sm">Join our growing fanbase!</span>
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

export default SocialHub;

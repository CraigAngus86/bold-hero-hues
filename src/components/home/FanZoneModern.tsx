
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Calendar, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useRef } from 'react';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface FanComment {
  id: string;
  name: string;
  avatar?: string;
  comment: string;
  date: string;
  likes: number;
}

const FanZoneModern = () => {
  // Fan of the month data
  const fanOfMonth = {
    id: '1',
    name: 'Tommy Wilson',
    quote: 'Been supporting Banks o\' Dee for over 30 years. Through thick and thin, always the blue and white!',
    imageUrl: '/lovable-uploads/ba4e2b09-12ed-48ad-a4ba-1162ab87ad70.png',
    title: 'April 2025 Fan of the Month'
  };
  
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
  
  // Handle vote submission
  const handleVote = () => {
    if (!selectedOption || userVoted) return;
    
    // Update poll results
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
  
  // Fan wall comments
  const [comments] = useState<FanComment[]>([
    {
      id: '1',
      name: 'Alan McGregor',
      avatar: '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png', 
      comment: 'Great performance on Saturday lads! That free kick was absolute quality.',
      date: '2 days ago',
      likes: 12
    },
    {
      id: '2',
      name: 'Sarah Johnston',
      comment: 'Looking forward to the cup game next weekend. Come on the Dee!',
      date: '3 days ago',
      likes: 8
    },
    {
      id: '3',
      name: 'Dave Thompson',
      avatar: '/lovable-uploads/ba4e2b09-12ed-48ad-a4ba-1162ab87ad70.png',
      comment: 'That was a tough loss against Formartine, but the boys showed real character. We go again!',
      date: '5 days ago',
      likes: 5
    }
  ]);
  
  // Carousel controls for fan wall
  const commentsRef = useRef<HTMLDivElement>(null);
  
  const scrollComments = (direction: 'left' | 'right') => {
    if (!commentsRef.current) return;
    
    const scrollAmount = commentsRef.current.offsetWidth / 2;
    const currentScroll = commentsRef.current.scrollLeft;
    
    commentsRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };
  
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-team-blue mb-8">Fan Zone</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Fan of the Month */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-team-blue text-white p-4 flex flex-row items-center gap-4">
                <Award className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Fan of the Month</h3>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Avatar className="h-32 w-32 rounded-full border-4 border-team-blue">
                    <AvatarImage src={fanOfMonth.imageUrl} alt={fanOfMonth.name} className="object-cover" />
                    <AvatarFallback>TW</AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center sm:text-left">
                    <h4 className="text-xl font-bold">{fanOfMonth.name}</h4>
                    <p className="text-sm text-blue-600 mb-2">{fanOfMonth.title}</p>
                    <p className="text-gray-600 italic">"{fanOfMonth.quote}"</p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="bg-gray-50 p-4">
                <Button variant="outline" className="w-full" onClick={() => toast.info("Fan of the Month nominations will be available soon!")}>
                  Nominate a Fan
                </Button>
              </CardFooter>
            </Card>
            
            {/* Fan Poll */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-team-blue text-white p-4 flex flex-row items-center gap-4">
                <Users className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Fan Poll</h3>
              </CardHeader>
              
              <CardContent className="p-6">
                <h4 className="font-medium mb-4">Player of the Month</h4>
                
                <RadioGroup 
                  disabled={userVoted} 
                  value={selectedOption || undefined} 
                  onValueChange={setSelectedOption}
                >
                  <div className="space-y-4">
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
                        
                        <div className="relative z-10 p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={option.id} id={option.id} disabled={userVoted} />
                            <Label 
                              htmlFor={option.id}
                              className="cursor-pointer font-medium"
                            >
                              {option.text}
                            </Label>
                          </div>
                          
                          {userVoted && (
                            <div className="text-sm font-medium">
                              {Math.round((option.votes / totalVotes) * 100)}%
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </RadioGroup>
                
                <div className="mt-6 text-sm text-gray-500 flex justify-between">
                  <span>Total votes: {totalVotes}</span>
                  {userVoted ? (
                    <span className="text-green-600 font-medium">Thanks for voting!</span>
                  ) : (
                    <span>Select your choice</span>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="bg-gray-50 p-4 flex justify-between">
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={!selectedOption || userVoted}
                  onClick={handleVote}
                >
                  {userVoted ? 'Voted' : 'Submit Vote'}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {/* Match Countdown */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-team-blue text-white p-4 flex flex-row items-center gap-4">
                <Calendar className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Next Match Countdown</h3>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold mb-2">Banks o' Dee vs Fraserburgh</h4>
                  <p className="text-gray-500">Saturday, April 12th • 15:00 • Spain Park</p>
                  
                  <div className="grid grid-cols-4 gap-3 mt-6 mb-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <span className="block text-2xl font-bold">4</span>
                      <span className="text-xs text-gray-500">Days</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <span className="block text-2xl font-bold">18</span>
                      <span className="text-xs text-gray-500">Hours</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <span className="block text-2xl font-bold">45</span>
                      <span className="text-xs text-gray-500">Mins</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <span className="block text-2xl font-bold">12</span>
                      <span className="text-xs text-gray-500">Secs</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <Button className="bg-team-blue hover:bg-team-navy">
                      Get Tickets
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Fan Wall */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-team-blue text-white p-4 flex flex-row items-center gap-4">
                <MessageSquare className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Fan Wall</h3>
              </CardHeader>
              
              <div className="relative">
                <button 
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-md ml-2"
                  onClick={() => scrollComments('left')}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <button 
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-md mr-2"
                  onClick={() => scrollComments('right')}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                
                <div 
                  ref={commentsRef}
                  className="flex space-x-4 overflow-x-auto scrollbar-hide p-6 snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {comments.map(comment => (
                    <Card 
                      key={comment.id} 
                      className="flex-none w-[280px] snap-start hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center mb-3">
                          <Avatar className="h-10 w-10 mr-3">
                            {comment.avatar ? (
                              <AvatarImage src={comment.avatar} alt={comment.name} />
                            ) : (
                              <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium">{comment.name}</p>
                            <p className="text-xs text-gray-500">{comment.date}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{comment.comment}</p>
                        
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="flex items-center">
                            <ThumbsUp className="w-3 h-3 mr-1" /> {comment.likes} likes
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => toast.success(`Liked ${comment.name}'s comment!`)}
                          >
                            Like
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <CardFooter className="bg-gray-50 p-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast.info("Fan comments feature coming soon!")}
                >
                  Add Your Comment
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FanZoneModern;

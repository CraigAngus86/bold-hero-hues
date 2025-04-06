
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ThumbsUp, MessageSquare, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const FanEngagement: React.FC = () => {
  // Mock social media posts
  const socialPosts = [
    {
      id: 1,
      platform: 'twitter',
      author: '@BanksODeeFC',
      content: 'Exciting news! Our youth academy has been granted elite status. Congratulations to everyone involved in this fantastic achievement! #BanksODee #YouthDevelopment',
      date: '2h ago',
      likes: 42,
      comments: 7,
      image: '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png'
    },
    {
      id: 2,
      platform: 'facebook',
      author: 'Banks O\' Dee FC',
      content: 'Match day! We take on Huntly FC at Spain Park. Kick-off at 3pm. Come down and support the team! #COYD',
      date: '5h ago',
      likes: 67,
      comments: 12,
      image: '/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png'
    },
    {
      id: 3,
      platform: 'instagram',
      author: 'banksofdeefc',
      content: 'Perfect weather for training today at Spain Park! Getting ready for Saturday\'s big match.',
      date: '1d ago',
      likes: 89,
      comments: 4,
      image: '/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png'
    }
  ];
  
  // Mock fans of the week
  const fansOfWeek = [
    {
      name: 'The Davidson Family',
      description: 'Season ticket holders for 15 years',
      image: '/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png'
    },
    {
      name: 'Aberdeen Supporters Club',
      description: 'Traveling to every away game this season',
      image: '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Helper function for rendering platform icon
  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return (
          <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-5 h-5 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Quick poll component
  const QuickPoll = () => {
    const [voted, setVoted] = React.useState(false);
    const [results, setResults] = React.useState({ 
      home: 65, 
      draw: 20, 
      away: 15 
    });
    const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
    
    const handleVote = () => {
      if (!selectedOption) return;
      
      setVoted(true);
      // In a real implementation, this would send the vote to a backend
    };
    
    return (
      <Card className="bg-white border-none shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-team-blue text-white">
          <CardTitle className="text-lg font-bold flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Fan Poll
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            This Weekend's Match Prediction
          </h3>
          
          {!voted ? (
            <div className="space-y-3">
              <p className="text-gray-600 mb-4">
                Banks o' Dee vs Formartine United - How do you think we'll do?
              </p>
              
              <div className="space-y-2">
                <label className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
                  <input 
                    type="radio" 
                    name="prediction" 
                    className="mr-3" 
                    onChange={() => setSelectedOption('home')}
                  />
                  <span>Banks o' Dee Win</span>
                </label>
                
                <label className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
                  <input 
                    type="radio" 
                    name="prediction" 
                    className="mr-3"
                    onChange={() => setSelectedOption('draw')}
                  />
                  <span>Draw</span>
                </label>
                
                <label className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
                  <input 
                    type="radio" 
                    name="prediction" 
                    className="mr-3"
                    onChange={() => setSelectedOption('away')}
                  />
                  <span>Formartine Win</span>
                </label>
              </div>
              
              <Button 
                className="w-full mt-3 bg-team-accent text-team-blue hover:bg-team-accent/90"
                disabled={!selectedOption}
                onClick={handleVote}
              >
                Submit Your Prediction
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 mb-2">
                Thank you for your prediction! Here's how other fans have voted:
              </p>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Banks o' Dee Win</span>
                    <span className="font-medium">{results.home}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-team-blue h-2 rounded-full" style={{ width: `${results.home}%` }}></div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Draw</span>
                    <span className="font-medium">{results.draw}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${results.draw}%` }}></div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Formartine Win</span>
                    <span className="font-medium">{results.away}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${results.away}%` }}></div>
                  </div>
                </div>
              </div>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                Based on 238 fan predictions
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Heart className="w-6 h-6 text-red-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Fan Zone</h2>
          </div>
          <Link to="/fans">
            <Button variant="outline" className="border-team-blue text-team-blue hover:bg-team-blue hover:text-white">
              Fan Community <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Social Feed Section */}
          <motion.div variants={itemVariants} className="md:col-span-8">
            <Card className="bg-white border-none shadow-lg rounded-xl overflow-hidden h-full">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <CardTitle className="text-lg font-bold">Social Media Feed</CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                <Carousel className="w-full py-4">
                  <CarouselContent>
                    {socialPosts.map((post) => (
                      <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3 pl-4 pr-0">
                        <div className="p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
                          <div className="flex items-center mb-3">
                            <div className="mr-2">
                              {renderPlatformIcon(post.platform)}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{post.author}</p>
                              <p className="text-xs text-gray-500">{post.date}</p>
                            </div>
                          </div>
                          
                          {post.image && (
                            <div className="mb-3 rounded-lg overflow-hidden">
                              <img src={post.image} alt="" className="w-full h-40 object-cover" />
                            </div>
                          )}
                          
                          <p className="text-sm text-gray-700 mb-3">{post.content}</p>
                          
                          <div className="flex text-xs text-gray-500 pt-2 border-t">
                            <div className="mr-4 flex items-center">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              <span>{post.comments}</span>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="hidden md:block">
                    <CarouselPrevious className="left-1" />
                    <CarouselNext className="right-1" />
                  </div>
                </Carousel>
              </CardContent>
              
              <CardFooter className="flex justify-center py-4 bg-gray-50 border-t">
                <Link to="/social">
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    Visit Our Social Media <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Fan Poll Section */}
          <motion.div variants={itemVariants} className="md:col-span-4">
            <QuickPoll />
          </motion.div>

          {/* Fans of the Week */}
          <motion.div variants={itemVariants} className="md:col-span-12">
            <Card className="bg-white border-none shadow-lg rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-team-blue to-blue-500 text-white">
                <CardTitle className="text-lg font-bold">Fans of the Week</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fansOfWeek.map((fan, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-team-blue/20">
                        <img 
                          src={fan.image} 
                          alt={fan.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{fan.name}</h3>
                        <p className="text-gray-600 text-sm">{fan.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <div className="text-center w-full">
                  <p className="text-gray-600 text-sm mb-2">
                    Want to be featured as our Fan of the Week?
                  </p>
                  <Link to="/fans/submit">
                    <Button size="sm" variant="outline" className="border-team-blue text-team-blue hover:bg-team-blue hover:text-white">
                      Submit Your Story
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FanEngagement;

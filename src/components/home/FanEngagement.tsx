
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SocialMediaFeed from './SocialMediaFeed';
import { motion } from 'framer-motion';

const FanEngagement: React.FC = () => {
  const [votedOption, setVotedOption] = useState<string | null>(null);
  
  // Example poll data
  const pollOptions = [
    { id: '1', text: 'Paul Campbell', votes: 48 },
    { id: '2', text: 'Lachie Macleod', votes: 36 },
    { id: '3', text: 'Mark Gilmour', votes: 28 },
    { id: '4', text: 'Hamish MacLeod', votes: 15 },
  ];
  
  const totalVotes = pollOptions.reduce((sum, option) => sum + option.votes, 0);
  
  const handleVote = (optionId: string) => {
    if (!votedOption) {
      setVotedOption(optionId);
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-team-blue mb-8">Fan Zone</h2>
        
        <Tabs defaultValue="social" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 bg-gray-100">
            <TabsTrigger value="social" className="data-[state=active]:bg-team-blue data-[state=active]:text-white">Social Media</TabsTrigger>
            <TabsTrigger value="polls" className="data-[state=active]:bg-team-blue data-[state=active]:text-white">Polls & Engagement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="social" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <SocialMediaFeed />
              </div>
              
              <motion.div 
                className="bg-gradient-to-br from-team-blue/90 to-team-navy rounded-lg p-6 text-white flex flex-col justify-center shadow-lg relative overflow-hidden"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-team-lightBlue rounded-full opacity-10 -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-team-accent rounded-full opacity-10 -ml-10 -mb-10"></div>
                
                <h3 className="text-2xl font-bold mb-4 z-10">Join Our Community</h3>
                <p className="mb-6 z-10">
                  Stay connected with Banks o' Dee FC by following our social media channels and engaging with our content.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 z-10">
                  <a 
                    href="https://x.com/banksodee_fc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-black/20 hover:bg-black/30 p-3 rounded-lg transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 mr-2">
                      <path
                        fill="currentColor"
                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                      />
                    </svg>
                    X / Twitter
                  </a>
                  <a 
                    href="https://www.instagram.com/banksodeefc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-black/20 hover:bg-black/30 p-3 rounded-lg transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 mr-2">
                      <path
                        fill="currentColor"
                        d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85,0,3.2,0,3.58-.07,4.85-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07-3.2,0-3.58,0-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85,0-3.2,0-3.58.07-4.85C2.33,3.92,3.84,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.35.2-6.78,2.62-7,7C0,8.33,0,8.74,0,12S0,15.67.07,17c.2,4.36,2.62,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.35-.2,6.78-2.62,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.35-2.62-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.43,1.44A1.44,1.44,0,0,0,18.41,4.15Z"
                      />
                    </svg>
                    Instagram
                  </a>
                  <a 
                    href="https://www.facebook.com/banksodeejfc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-black/20 hover:bg-black/30 p-3 rounded-lg transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 mr-2">
                      <path
                        fill="currentColor"
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      />
                    </svg>
                    Facebook
                  </a>
                </div>
                
                <div className="mt-6 flex justify-center z-10">
                  <Button className="bg-white text-team-blue hover:bg-team-lightBlue">
                    Join Fan Club
                  </Button>
                </div>
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="polls" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Fan Poll */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden shadow-md">
                  <CardHeader className="bg-team-blue text-white">
                    <CardTitle className="flex items-center text-lg">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                        <path
                          fill="currentColor"
                          d="M18 9.5V5.5H6V9.5H18M18 3.5C19.11 3.5 20 4.39 20 5.5V9.5C20 10.61 19.11 11.5 18 11.5H6C4.89 11.5 4 10.61 4 9.5V5.5C4 4.39 4.89 3.5 6 3.5H18M18 14.5V18.5H6V14.5H18M18 12.5H6C4.89 12.5 4 13.39 4 14.5V18.5C4 19.61 4.89 20.5 6 20.5H18C19.11 20.5 20 19.61 20 18.5V14.5C20 13.39 19.11 12.5 18 12.5Z"
                        />
                      </svg>
                      Fan Poll of the Week
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-4">Who was your Player of the Month?</h3>
                    
                    <div className="space-y-4">
                      {pollOptions.map(option => {
                        const percentage = Math.round((option.votes / totalVotes) * 100);
                        const isVoted = votedOption === option.id;
                        
                        return (
                          <div key={option.id} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-medium ${isVoted ? 'text-team-blue' : ''}`}>
                                {option.text}
                              </span>
                              <span className="text-sm font-semibold">{percentage}%</span>
                            </div>
                            <div className="relative">
                              <Progress value={percentage} className="h-8 bg-gray-100" />
                              <button
                                onClick={() => handleVote(option.id)}
                                disabled={!!votedOption}
                                className={`absolute inset-0 flex items-center justify-end px-3 text-sm font-medium ${
                                  isVoted ? 'bg-team-blue/20 border-2 border-team-blue text-team-blue' : ''
                                } ${!votedOption ? 'hover:bg-gray-200 transition-colors' : ''}`}
                                style={isVoted ? { width: `${percentage}%` } : {}}
                              >
                                {isVoted && <span className="mr-2">✓</span>}
                                {option.votes} votes
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-6 text-sm text-gray-500 text-center">
                      {votedOption ? (
                        <p>Thank you for voting! Poll ends in 2 days.</p>
                      ) : (
                        <p>Click on a bar to vote. Total votes: {totalVotes}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 flex justify-between px-6 py-3">
                    <span className="text-xs text-gray-500">Poll started: April 1, 2025</span>
                    <Button variant="link" size="sm" className="text-team-blue p-0">
                      View All Polls
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              
              {/* Instagram-Style Fan Photos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="overflow-hidden shadow-md">
                  <CardHeader className="bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                    <CardTitle className="flex items-center text-lg">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                        <path
                          fill="currentColor"
                          d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85,0,3.2,0,3.58-.07,4.85-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07-3.2,0-3.58,0-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85,0-3.2,0-3.58.07-4.85C2.33,3.92,3.84,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.35.2-6.78,2.62-7,7C0,8.33,0,8.74,0,12S0,15.67.07,17c.2,4.36,2.62,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.35-.2,6.78-2.62,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.35-2.62-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.43,1.44A1.44,1.44,0,0,0,18.41,4.15Z"
                        />
                      </svg>
                      Fan Photos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-3 gap-0.5">
                      {[
                        '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png',
                        '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png',
                        '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
                        '/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png',
                        '/lovable-uploads/8f2cd33f-1e08-494a-9aaa-65792ee9418a.png',
                        '/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png',
                        '/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png',
                        '/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png',
                        '/lovable-uploads/e2efc1b0-1c8a-4e98-9826-3030a5f5d247.png',
                      ].map((img, idx) => (
                        <div key={idx} className="aspect-square overflow-hidden group relative">
                          <img src={img} alt="Fan content" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="text-white flex space-x-4">
                              <span className="flex items-center">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 mr-1 fill-current">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                {Math.floor(Math.random() * 100)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gradient-to-r from-pink-500/10 to-orange-500/10 flex justify-center py-3">
                    <Button variant="secondary" size="sm">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                        <path
                          fill="currentColor"
                          d="M19,18H6A4,4,0,0,1,2,14,4,4,0,0,1,6,10H6.71A5.8,5.8,0,0,1,6,7a6,6,0,0,1,6-6,5.91,5.91,0,0,1,5.94,5H18a5,5,0,0,1,5,5,5,5,0,0,1-4,4.9ZM12,3a4,4,0,0,0-4,4,6.38,6.38,0,0,0,.7,2.9L9.41,11H6a2,2,0,0,0-2,2,2,2,0,0,0,2,2H19v-.1A3,3,0,0,0,22,12a3,3,0,0,0-3-3H17.59l-.71-1a2.65,2.65,0,0,0-.26-.35A3.94,3.94,0,0,0,12,3Z"
                        />
                      </svg>
                      Share Your Photos #BanksODeeFC
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default FanEngagement;

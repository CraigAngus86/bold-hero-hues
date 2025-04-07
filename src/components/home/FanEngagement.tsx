
import React, { useState } from 'react';
import { Check, Mail, User, Award, Users, MessageSquare, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Mock data
const fanOfTheMonth = {
  name: "Jamie MacDonald",
  photo: "/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png",
  quote: "I've been supporting Banks o' Dee for over 30 years. Through the highs and lows, there's no club I'd rather follow. The atmosphere at Spain Park is always brilliant!",
  since: "Supporter since 1992"
};

const pollOptions = [
  { id: '1', name: 'Michael Smith', votes: 42 },
  { id: '2', name: 'David Johnson', votes: 28 },
  { id: '3', name: 'Alex Thompson', votes: 35 },
  { id: '4', name: 'Ryan Williams', votes: 21 }
];

const totalVotes = pollOptions.reduce((sum, option) => sum + option.votes, 0);

const FanEngagement: React.FC = () => {
  const [email, setEmail] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = () => {
    if (!selectedOption) return;
    setHasVoted(true);
    toast.success("Thanks for voting! Your choice has been recorded.");
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (email.includes('@')) {
        toast.success("Thanks for subscribing to our newsletter!");
        setEmail('');
      } else {
        toast.error("Please enter a valid email address");
      }
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-team-blue mb-12">Fan Engagement</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Fan Zone */}
          <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="bg-team-blue text-white py-4 px-6">
              <CardTitle className="flex items-center text-xl">
                <Users className="w-5 h-5 mr-2" />
                Fan of the Month
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full border-4 border-team-lightBlue overflow-hidden mb-4">
                  <img 
                    src={fanOfTheMonth.photo} 
                    alt={fanOfTheMonth.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-team-blue">{fanOfTheMonth.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{fanOfTheMonth.since}</p>
                
                <blockquote className="italic text-gray-700 mb-6">
                  "{fanOfTheMonth.quote}"
                </blockquote>
                
                <div className="w-full">
                  <h4 className="font-semibold text-team-blue mb-3">Share Your Story</h4>
                  <Button variant="outline" className="w-full border-team-blue text-team-blue hover:bg-team-blue hover:text-white">
                    Submit Your Story
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Social Media Feed */}
          <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="bg-team-blue text-white py-4 px-6">
              <CardTitle className="flex items-center text-xl">
                <MessageSquare className="w-5 h-5 mr-2" />
                Social Media
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Twitter Post */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-sm">@BanksODeeFCOfficial</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <p className="text-sm mb-2">Exciting win yesterday! The team showed great determination. Next fixture: Formartine United at home this Saturday. #BanksODee #HighlandLeague</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>12 Likes</span>
                  <span>3 Retweets</span>
                  <span>2 Comments</span>
                </div>
              </div>
              
              {/* Facebook Post */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-sm">Banks o' Dee FC</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
                <p className="text-sm mb-2">New merchandise now available in our club shop! Get your hands on the new away kit for the 2025/26 season. #BanksODee</p>
                <div className="rounded-lg overflow-hidden h-32 mb-2">
                  <img src="/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png" alt="New merchandise" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>24 Likes</span>
                  <span>8 Comments</span>
                  <span>5 Shares</span>
                </div>
              </div>
              
              {/* Instagram Post */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-sm">banksofdee_official</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden h-36 mb-2">
                  <img src="/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png" alt="Youth Academy" className="w-full h-full object-cover" />
                </div>
                <p className="text-sm mb-2">Youth Academy in action this weekend! Great to see the next generation of talent coming through. #BanksODee #YouthDevelopment</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>56 Likes</span>
                  <span>4 Comments</span>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <div className="flex space-x-4">
                  <a href="https://twitter.com/banksofdeefc" target="_blank" rel="noopener noreferrer" className="text-[#1DA1F2] hover:text-[#1a91da]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a href="https://facebook.com/banksofdeefc" target="_blank" rel="noopener noreferrer" className="text-[#1877F2] hover:text-[#166fe5]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href="https://instagram.com/banksofdee_official" target="_blank" rel="noopener noreferrer" className="text-[#E4405F] hover:text-[#d62e50]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Newsletter Signup */}
          <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="bg-team-blue text-white py-4 px-6">
              <CardTitle className="flex items-center text-xl">
                <Mail className="w-5 h-5 mr-2" />
                Newsletter
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-team-blue mb-2">Stay Updated</h3>
              <p className="text-gray-600 text-sm mb-4">
                Join our mailing list to receive the latest news, updates, and special offers directly to your inbox.
              </p>
              
              <form onSubmit={handleSubscribe} className="mb-6">
                <div className="mb-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-team-blue"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-team-blue hover:bg-blue-800 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-team-blue mb-3">Subscriber Benefits:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Early access to home match tickets</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Exclusive interviews with players and staff</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Special discount offers in the club shop</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Monthly prize draws</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                By subscribing, you agree to our <a href="/privacy" className="text-team-blue hover:underline">Privacy Policy</a> and consent to receive emails from Banks o' Dee FC. You can unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
          
          {/* Match Poll - Appears on mobile only */}
          <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow md:hidden">
            <CardHeader className="bg-team-blue text-white py-4 px-6">
              <CardTitle className="flex items-center text-xl">
                <Award className="w-5 h-5 mr-2" />
                Man of the Match
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-team-blue mb-4">Who was your Man of the Match vs. Keith FC?</h3>
              
              {!hasVoted ? (
                <div className="space-y-3">
                  {pollOptions.map(option => (
                    <div 
                      key={option.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        selectedOption === option.id ? 'border-team-blue bg-team-lightBlue/20' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedOption(option.id)}
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <span className="font-medium">{option.name}</span>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={handleVote}
                    disabled={!selectedOption}
                    className="w-full mt-4 bg-team-blue hover:bg-blue-800 text-white"
                  >
                    Submit Vote
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-green-600 font-medium flex items-center">
                    <Check className="w-4 h-4 mr-1" /> Thanks for voting!
                  </p>
                  
                  <div className="space-y-3">
                    {pollOptions.map(option => {
                      const percentage = Math.round((option.votes / totalVotes) * 100);
                      const isSelected = option.id === selectedOption;
                      
                      return (
                        <div key={option.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className={isSelected ? "font-semibold text-team-blue" : ""}>{option.name}</span>
                            <span className="text-gray-500">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${isSelected ? 'bg-team-blue' : 'bg-gray-400'}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                    
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Total votes: {totalVotes}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FanEngagement;

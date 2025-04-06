
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook, Mail, Check, AlertCircle, ChevronRight, User, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SocialMediaFeed from '@/components/SocialMediaFeed';

const FanOfTheMonth = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">Fan of the Month</h3>
        <Trophy className="w-5 h-5 text-amber-500" />
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
          <img 
            src="/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png" 
            alt="Jamie MacDonald" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <h4 className="font-semibold text-lg">Jamie MacDonald</h4>
        <p className="text-sm text-gray-500 mb-3">Supporter for 12 years</p>
        
        <blockquote className="italic text-gray-600 text-sm text-center">
          "Been supporting the club through thick and thin since I was a boy. Spain Park is my second home!"
        </blockquote>
      </div>
      
      <div className="mt-4 text-center">
        <Link to="/fans/nominate" className="text-sm text-team-blue hover:underline flex items-center justify-center">
          Nominate a fan
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

const FanPoll = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  
  const pollResults = {
    'striker': 45,
    'midfielder': 25,
    'defender': 15,
    'goalkeeper': 15
  };
  
  const handleVote = () => {
    if (!selectedOption) return;
    
    // Here you would send the vote to your backend
    toast.success('Thanks for voting!');
    setHasVoted(true);
  };
  
  const totalVotes = Object.values(pollResults).reduce((a, b) => a + b, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mt-6">
      <h3 className="font-bold text-gray-800 mb-3">Fan Poll</h3>
      
      <div className="text-sm text-gray-800 mb-4">
        Which position should we strengthen in the next transfer window?
      </div>
      
      {!hasVoted ? (
        <>
          <div className="space-y-2 mb-4">
            {Object.keys(pollResults).map((option) => (
              <div 
                key={option}
                onClick={() => setSelectedOption(option)}
                className={`p-2 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${selectedOption === option ? 'border-team-blue bg-blue-50' : 'border-gray-200'}`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${selectedOption === option ? 'border-team-blue' : 'border-gray-300'}`}>
                    {selectedOption === option && (
                      <div className="w-2 h-2 rounded-full bg-team-blue"></div>
                    )}
                  </div>
                  <span className="capitalize">{option}</span>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={handleVote} 
            disabled={!selectedOption}
            className="w-full"
          >
            Cast Vote
          </Button>
        </>
      ) : (
        <div className="space-y-3">
          {Object.entries(pollResults).map(([option, votes]) => {
            const percentage = Math.round((votes / totalVotes) * 100);
            
            return (
              <div key={option} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{option}</span>
                  <span className="text-gray-500">{percentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-team-blue" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
          
          <div className="text-xs text-gray-500 text-center mt-2">
            {totalVotes} votes • Poll ends in 3 days
          </div>
          
          <div className="text-center mt-2">
            <Link to="/fans/polls" className="text-xs text-team-blue hover:underline">
              View more polls
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Success - in a real app, you would send this to your backend
    setIsSubmitting(false);
    setIsSubscribed(true);
    toast.success('Thanks for subscribing!');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">Newsletter</h3>
        <Mail className="w-5 h-5 text-team-blue" />
      </div>
      
      {!isSubscribed ? (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Get the latest news and updates from Banks o' Dee FC directly to your inbox.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
              {error && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {error}
                </p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
            </Button>
          </form>
          
          <ul className="mt-4 space-y-2">
            <li className="text-xs text-gray-600 flex items-start">
              <Check className="w-3 h-3 mr-1.5 text-green-500 mt-0.5" />
              <span>Match day previews and post-match analysis</span>
            </li>
            <li className="text-xs text-gray-600 flex items-start">
              <Check className="w-3 h-3 mr-1.5 text-green-500 mt-0.5" />
              <span>Exclusive content and player interviews</span>
            </li>
            <li className="text-xs text-gray-600 flex items-start">
              <Check className="w-3 h-3 mr-1.5 text-green-500 mt-0.5" />
              <span>Special offers and early ticket access</span>
            </li>
          </ul>
        </>
      ) : (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 text-green-500" />
          </div>
          <h4 className="font-medium mb-1">You're subscribed!</h4>
          <p className="text-sm text-gray-600 mb-3">
            Thanks for signing up to our newsletter.
          </p>
          <p className="text-xs text-gray-500">
            Check your inbox soon for the latest updates.
          </p>
        </div>
      )}
    </div>
  );
};

const FanEngagement: React.FC = () => {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Fan Engagement</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Column 1: Fan Zone */}
          <div>
            <FanOfTheMonth />
            <FanPoll />
          </div>
          
          {/* Column 2: Social Media Feed */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Social Media</h3>
                <div className="flex space-x-1.5">
                  <a 
                    href="https://twitter.com/banksodee_fc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1DA1F2] hover:text-[#1a91da]"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://www.facebook.com/banksodeejfc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1877F2] hover:text-[#166fe5]"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://www.instagram.com/banksodeefc/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#C13584] hover:text-[#b31b76]"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>
              
              {/* We'll use the imported SocialMediaFeed component here */}
              <div className="h-[400px] overflow-y-auto hide-scrollbar px-1">
                <SocialMediaFeed />
              </div>
            </div>
          </div>
          
          {/* Column 3: Newsletter Signup */}
          <div className="space-y-6">
            <NewsletterSignup />
            
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Join the Community</h3>
                <User className="w-5 h-5 text-gray-500" />
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Become a member of the Banks o' Dee FC supporters club and enjoy exclusive benefits.
              </p>
              
              <Link to="/fans/join">
                <Button className="w-full">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FanEngagement;

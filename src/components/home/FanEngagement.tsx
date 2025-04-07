
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Mail, Twitter } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const FanEngagement: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [pollVote, setPollVote] = React.useState<string | null>(null);
  
  // Mock poll data
  const pollOptions = [
    { id: '1', text: 'Jamie Michie', votes: 45 },
    { id: '2', text: 'Mark Gilmour', votes: 32 },
    { id: '3', text: 'Lachie MacLeod', votes: 18 },
    { id: '4', text: 'Kane Winton', votes: 25 }
  ];
  
  const totalVotes = pollOptions.reduce((sum, option) => sum + option.votes, 0);
  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form
      setEmail('');
      // Show success message (this would be better with a toast)
      alert('Thank you for subscribing!');
    }, 1000);
  };
  
  const handlePollVote = (optionId: string) => {
    setPollVote(optionId);
    // In a real app, you would send this vote to the backend
  };
  
  // Calculate percentage for each poll option
  const calculatePercentage = (votes: number) => {
    return totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-team-blue mb-10 text-center">Fan Zone</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Fan of the Month */}
          <Card className="overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img 
                src="/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png" 
                alt="Fan of the Month" 
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>Fan of the Month</CardTitle>
              <CardDescription>John Smith</CardDescription>
            </CardHeader>
            <CardContent>
              <blockquote className="italic text-gray-600 border-l-4 border-team-blue pl-4">
                "I've been supporting Banks o' Dee for over 20 years and I'm proud to be part of this amazing community!"
              </blockquote>
            </CardContent>
          </Card>
          
          {/* Poll Section */}
          <Card>
            <CardHeader>
              <CardTitle>Man of the Match Poll</CardTitle>
              <CardDescription>Banks o' Dee 3-1 Keith FC</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pollOptions.map(option => (
                  <div key={option.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{option.text}</span>
                      <span className="text-sm text-gray-500">{calculatePercentage(option.votes)}%</span>
                    </div>
                    <Progress value={calculatePercentage(option.votes)} className="h-2" />
                    {!pollVote && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-1"
                        onClick={() => handlePollVote(option.id)}
                      >
                        Vote
                      </Button>
                    )}
                  </div>
                ))}
                
                <p className="text-sm text-gray-500 text-center pt-2">
                  Total votes: {totalVotes}
                </p>
                
                {pollVote && (
                  <p className="text-sm text-center text-green-600 font-medium">
                    Thank you for voting!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Newsletter & Social Media */}
          <div className="space-y-6">
            {/* Newsletter Signup */}
            <Card>
              <CardHeader>
                <CardTitle>Club Newsletter</CardTitle>
                <CardDescription>Stay up to date with all things Banks o' Dee</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewsletterSubmit}>
                  <div className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-team-blue hover:bg-team-blue/80" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                    </Button>
                  </div>
                </form>
                <div className="text-xs text-gray-500 mt-4">
                  By subscribing, you agree to our <a href="/privacy" className="underline">Privacy Policy</a>. 
                  We'll send you club news, ticket information, and special offers.
                </div>
              </CardContent>
            </Card>
            
            {/* Social Media Links */}
            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <Button variant="outline" size="lg" className="flex items-center">
                    <Facebook className="mr-2 h-5 w-5" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="lg" className="flex items-center">
                    <Twitter className="mr-2 h-5 w-5" />
                    Twitter
                  </Button>
                  <Button variant="outline" size="lg" className="flex items-center">
                    <Instagram className="mr-2 h-5 w-5" />
                    Instagram
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FanEngagement;

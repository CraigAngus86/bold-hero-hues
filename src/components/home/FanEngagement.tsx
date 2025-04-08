
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Calendar, Trophy, Star, MessageSquare, Twitter, Facebook, Instagram, Send } from 'lucide-react';

// Utility function to apply staggered animations to children
const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4
    }
  }
};

const FanEngagement: React.FC = () => {
  const [pollChoice, setPollChoice] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  
  // Mock Fan of the Month data
  const fanOfMonth = {
    name: "James Anderson",
    image: "/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png",
    quote: "I've been supporting the Dee for over 30 years, through thick and thin. The atmosphere at Spain Park just keeps getting better!",
    since: 1991
  };
  
  // Mock Poll data
  const pollData = {
    question: "Who will be our Man of the Match against Formartine United?",
    options: [
      { id: "player1", name: "Michael Philipson", votes: 42 },
      { id: "player2", name: "Kane Winton", votes: 38 },
      { id: "player3", name: "Mark Gilmour", votes: 27 },
      { id: "player4", name: "Lachie MacLeod", votes: 15 }
    ]
  };
  
  // Mock Social Media posts
  const socialPosts = [
    {
      id: "post1",
      platform: "twitter",
      author: "Banks o' Dee FC",
      content: "FULL TIME: Banks o' Dee FC 3-1 Keith FC. An impressive performance from the team today!",
      date: "2 hours ago",
      likes: 24,
      comments: 5,
      image: "/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png"
    },
    {
      id: "post2",
      platform: "instagram",
      author: "bankso.deefc",
      content: "Congratulations to our April Player of the Month, chosen by the fans!",
      date: "Yesterday",
      likes: 87,
      comments: 12,
      image: "/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png"
    },
    {
      id: "post3",
      platform: "facebook",
      author: "Banks o' Dee Football Club",
      content: "Ticket information for our upcoming Scottish Cup fixture is now available on our website.",
      date: "2 days ago",
      likes: 56,
      comments: 8
    }
  ];
  
  // Calculate total votes for the poll
  const totalVotes = pollData.options.reduce((sum, option) => sum + option.votes, 0);
  
  // Handle poll vote
  const handleVote = (optionId: string) => {
    setPollChoice(optionId);
    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };
  
  // Handle newsletter signup
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${email}!`);
    setEmail('');
  };
  
  // Platform Icon Component
  const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4 text-blue-400" />;
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-600" />;
      default:
        return null;
    }
  };
  
  return (
    <section className="py-16 bg-pattern-diagonal bg-team-blue">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Fan Zone
          </motion.h2>
          <motion.div 
            className="w-24 h-1 bg-accent-500 mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          ></motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Fan of the Month */}
          <motion.div 
            className="lg:col-span-4"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-card h-full">
              <div className="bg-accent-gradient p-4 text-center text-team-blue">
                <Trophy className="inline-block h-5 w-5 mr-2" />
                <span className="font-bold">FAN OF THE MONTH</span>
              </div>
              
              <div className="p-6 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img 
                    src={fanOfMonth.image} 
                    alt={fanOfMonth.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-accent-500"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-accent-500 text-team-blue text-xs font-bold px-2 py-1 rounded-full">
                    Since {fanOfMonth.since}
                  </div>
                </div>
                
                <h3 className="font-bold text-xl text-team-blue mb-3">{fanOfMonth.name}</h3>
                
                <div className="relative">
                  <div className="absolute -top-3 -left-1 text-accent-500 text-4xl opacity-50">"</div>
                  <p className="italic text-gray-600 mb-4 relative z-10">{fanOfMonth.quote}</p>
                  <div className="absolute -bottom-3 -right-1 text-accent-500 text-4xl opacity-50">"</div>
                </div>
                
                <div className="mt-6">
                  <a 
                    href="/fans/nominate"
                    className="inline-block bg-team-blue text-white font-medium px-5 py-2 rounded hover:bg-opacity-90 transition-colors btn-hover-effect"
                  >
                    Nominate a Fan
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Interactive Poll */}
          <motion.div 
            className="lg:col-span-4"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-card h-full">
              <div className="bg-primary-gradient p-4 text-center text-white">
                <Star className="inline-block h-5 w-5 mr-2 text-accent-500" />
                <span className="font-bold">FAN POLL</span>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-lg text-team-blue mb-4">{pollData.question}</h3>
                
                {!isSubmitted ? (
                  <div className="space-y-3">
                    {pollData.options.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handleVote(option.id)}
                        className={cn(
                          "w-full text-left p-3 rounded border transition-colors",
                          pollChoice === option.id 
                            ? "border-team-blue bg-team-blue/5" 
                            : "border-gray-200 hover:border-team-blue/50"
                        )}
                      >
                        <span className="font-medium text-team-blue">{option.name}</span>
                      </button>
                    ))}
                    
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => pollChoice && setIsSubmitted(true)}
                        disabled={!pollChoice}
                        className={cn(
                          "px-5 py-2 rounded font-medium transition-colors",
                          pollChoice 
                            ? "bg-accent-500 text-team-blue hover:bg-accent-600" 
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        )}
                      >
                        Submit Vote
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pollData.options.map(option => {
                      const percentage = Math.round((option.votes / totalVotes) * 100);
                      
                      return (
                        <div key={option.id} className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className={cn(
                              "font-medium",
                              pollChoice === option.id ? "text-team-blue" : "text-gray-600"
                            )}>
                              {option.name}
                            </span>
                            <span className="font-bold">
                              {percentage}%
                            </span>
                          </div>
                          
                          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              className={cn(
                                "h-2.5 rounded-full",
                                pollChoice === option.id ? "bg-accent-500" : "bg-team-blue"
                              )}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            ></motion.div>
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="mt-4 text-center text-gray-500 text-sm">
                      <p>Total votes: {totalVotes}</p>
                      <p className="mt-1">Thank you for your vote!</p>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <a 
                        href="/polls"
                        className="inline-block bg-gray-100 text-team-blue font-medium px-5 py-2 rounded hover:bg-gray-200 transition-colors"
                      >
                        More Polls
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Social Media Feed */}
          <motion.div 
            className="lg:col-span-4"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-card h-full">
              <div className="bg-primary-gradient p-4 text-center text-white">
                <MessageSquare className="inline-block h-5 w-5 mr-2 text-accent-500" />
                <span className="font-bold">SOCIAL MEDIA</span>
              </div>
              
              <div className="p-4">
                <motion.div 
                  className="space-y-4 custom-scrollbar overflow-y-auto"
                  style={{ maxHeight: '400px' }}
                  variants={staggerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {socialPosts.map((post) => (
                    <motion.div 
                      key={post.id}
                      variants={itemVariants}
                      className="border border-gray-100 rounded-lg p-4 hover:border-team-blue/30 transition-colors"
                    >
                      <div className="flex items-center mb-3">
                        <PlatformIcon platform={post.platform} />
                        <span className="font-medium text-sm ml-2">{post.author}</span>
                        <span className="ml-auto text-xs text-gray-500">{post.date}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{post.content}</p>
                      
                      {post.image && (
                        <div className="mb-3 rounded-md overflow-hidden">
                          <img 
                            src={post.image}
                            alt="Social media post"
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="mr-4">{post.likes} likes</span>
                        <span>{post.comments} comments</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                
                <div className="mt-6 flex justify-center space-x-4">
                  <a 
                    href="https://twitter.com/BanksDee"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://www.facebook.com/banksofdeefc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://www.instagram.com/banksofdeefc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white p-2 rounded-full hover:shadow-lg transition-all"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Newsletter Signup */}
        <motion.div
          className="mt-12 bg-white rounded-lg overflow-hidden shadow-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-10">
              <h3 className="font-bold text-2xl text-team-blue mb-4">Subscribe to our Newsletter</h3>
              <p className="text-gray-600 mb-6">
                Stay up to date with all the latest news, match information, and exclusive content from Banks o' Dee FC.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="h-5 w-5 rounded-full bg-accent-500 flex items-center justify-center">
                      <svg className="h-3 w-3 text-team-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-2.5 text-gray-700">Match previews and reports</span>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="h-5 w-5 rounded-full bg-accent-500 flex items-center justify-center">
                      <svg className="h-3 w-3 text-team-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-2.5 text-gray-700">Exclusive interviews and content</span>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="h-5 w-5 rounded-full bg-accent-500 flex items-center justify-center">
                      <svg className="h-3 w-3 text-team-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-2.5 text-gray-700">Early access to ticket information</span>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="h-5 w-5 rounded-full bg-accent-500 flex items-center justify-center">
                      <svg className="h-3 w-3 text-team-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-2.5 text-gray-700">Special offers and discounts</span>
                </div>
              </div>
              
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email Address
                  </label>
                  <div className="flex">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-team-blue focus:border-transparent"
                      placeholder="example@email.com"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-team-blue text-white px-4 py-2 rounded-r-md hover:bg-opacity-90 transition-colors flex items-center"
                    >
                      Subscribe
                      <Send className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500">
                  By subscribing, you agree to our <a href="/privacy" className="text-team-blue hover:underline">Privacy Policy</a>.
                  We will never share your information with third parties.
                </p>
              </form>
            </div>
            
            <div className="hidden lg:block relative bg-gradient-to-br from-team-blue to-primary-500 overflow-hidden">
              <div className="absolute inset-0 bg-pattern-diagonal opacity-10"></div>
              <div className="p-10 relative z-10 h-full flex flex-col justify-center">
                <Calendar className="h-12 w-12 text-accent-500 mb-6" />
                <h3 className="font-bold text-2xl text-white mb-4">Upcoming Events</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-white/20 rounded p-1.5 mr-3">
                      <span className="text-white text-xs font-bold">MAY</span>
                      <div className="text-accent-500 text-lg font-bold leading-none">15</div>
                    </div>
                    <div>
                      <span className="text-white font-medium">Home vs Formartine United</span>
                      <p className="text-white/80 text-sm">Highland League - 3:00 PM</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="bg-white/20 rounded p-1.5 mr-3">
                      <span className="text-white text-xs font-bold">MAY</span>
                      <div className="text-accent-500 text-lg font-bold leading-none">22</div>
                    </div>
                    <div>
                      <span className="text-white font-medium">Away vs Turriff United</span>
                      <p className="text-white/80 text-sm">Highland League - 3:00 PM</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="bg-white/20 rounded p-1.5 mr-3">
                      <span className="text-white text-xs font-bold">JUN</span>
                      <div className="text-accent-500 text-lg font-bold leading-none">05</div>
                    </div>
                    <div>
                      <span className="text-white font-medium">Fan Appreciation Day</span>
                      <p className="text-white/80 text-sm">Spain Park - 12:00 PM</p>
                    </div>
                  </li>
                </ul>
                
                <a 
                  href="/events"
                  className="mt-6 inline-flex items-center text-white hover:text-accent-500 transition-colors"
                >
                  View All Events
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FanEngagement;

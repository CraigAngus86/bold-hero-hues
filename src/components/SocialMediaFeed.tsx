
import { useState, useEffect } from 'react';
import { Twitter, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock social media posts
const mockSocialPosts = [
  {
    id: 1,
    platform: 'twitter',
    username: 'banksodee_fc',
    content: 'Congratulations to our first team on their impressive 3-1 victory against Formartine United! #BODHIGHL',
    date: '2 hours ago',
    likes: 42,
    comments: 5,
    shares: 12,
    image: '/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png'
  },
  {
    id: 2,
    platform: 'instagram',
    username: 'banksodeefc',
    content: 'The calm before the storm. Spain Park looking immaculate ahead of tomorrow\'s big match! #MatchDay #HighlandLeague',
    date: '1 day ago',
    likes: 128,
    comments: 14,
    image: '/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png'
  },
  {
    id: 3,
    platform: 'twitter',
    username: 'banksodee_fc',
    content: 'Ticket details for our upcoming Scottish Cup fixture are now available on our website! Secure yours early to avoid disappointment. #ScottishCup',
    date: '2 days ago',
    likes: 36,
    comments: 8,
    shares: 15,
    image: null
  },
  {
    id: 4,
    platform: 'instagram',
    username: 'banksodeefc',
    content: 'Youth training sessions are back this weekend! All age groups welcome. Contact our youth development team for more information. #YouthFootball #NextGeneration',
    date: '3 days ago',
    likes: 95,
    comments: 7,
    image: '/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png'
  }
];

const SocialMediaFeed = () => {
  const [socialPosts, setSocialPosts] = useState([]);
  
  useEffect(() => {
    // In a real application, this would fetch data from social media APIs
    setSocialPosts(mockSocialPosts);
  }, []);
  
  return (
    <section className="py-16 bg-team-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-team-blue mb-4">Social Media</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow us on social media to stay updated with everything happening at Banks o' Dee FC.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {socialPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center p-4 border-b border-gray-100">
                <div className={`p-2 rounded-full mr-3 ${post.platform === 'twitter' ? 'bg-[#1DA1F2]/10 text-[#1DA1F2]' : 'bg-[#C13584]/10 text-[#C13584]'}`}>
                  {post.platform === 'twitter' ? <Twitter className="w-4 h-4" /> : <Instagram className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-semibold text-sm">@{post.username}</p>
                  <p className="text-xs text-gray-500">{post.date}</p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <p className="text-sm text-gray-700 mb-4">{post.content}</p>
                
                {post.image && (
                  <div className="rounded-md overflow-hidden mb-4">
                    <img 
                      src={post.image} 
                      alt="Social media post" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                
                {/* Stats */}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{post.likes} Likes</span>
                  <span>{post.comments} Comments</span>
                  {post.shares && <span>{post.shares} Shares</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <div className="flex justify-center space-x-4">
            <a 
              href="https://x.com/banksodee_fc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-team-blue text-white p-3 rounded-full hover:bg-team-lightBlue transition-colors"
              aria-label="Twitter/X"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://www.instagram.com/banksodeefc/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-team-blue text-white p-3 rounded-full hover:bg-team-lightBlue transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaFeed;

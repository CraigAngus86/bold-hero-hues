
import { useState, useEffect } from 'react';
import { Twitter, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

// Actual social media posts from Banks o' Dee FC
const realSocialPosts = [
  {
    id: 1,
    platform: 'twitter',
    username: 'banksodee_fc',
    content: 'NEXT MATCH 🏆 Banks o' Dee v @inverurielocos 🏟️ Spain Park ⏰ 3pm 🗓️ Saturday 27th July 2024 🎫 Adults £15, Concessions £10, U16s FREE #BODHIGHL',
    date: 'July 25, 2024',
    likes: 21,
    comments: 3,
    shares: 7,
    image: '/lovable-uploads/BOD_Navy.png'
  },
  {
    id: 2,
    platform: 'instagram',
    username: 'banksodeefc',
    content: 'BANKS O' DEE FOOTBALL CLUB ARE HIRING! We are currently recruiting for a Ladies 1st Team Manager/Coach ahead of the new season. Anyone interested should contact the club via social media or email to banksodeeLFC@gmail.com ⚽️',
    date: 'July 22, 2024',
    likes: 48,
    comments: 0,
    image: '/lovable-uploads/BOD_Navy.png'
  },
  {
    id: 3,
    platform: 'twitter',
    username: 'banksodee_fc',
    content: '2024/25 HFCL Season Ticket prices 🎟️ Adult - £210 Concession - £130 We are also pleased to introduce a discounted Season Ticket for 12-16 year old\'s! 12-16 year old - £15 Under 12\'s remain FREE! Interested? Contact banksodeefcst@gmail.com',
    date: 'July 18, 2024',
    likes: 16,
    comments: 0,
    shares: 5,
    image: null
  },
  {
    id: 4,
    platform: 'instagram',
    username: 'banksodeefc',
    content: 'Getting ready for the new season 💪 Pre-season friendly v Huntly FC at Spain Park. Great workout for the squad as we build towards our first league match.',
    date: 'July 15, 2024',
    likes: 75,
    comments: 5,
    image: '/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png'
  }
];

const SocialMediaFeed = () => {
  const [socialPosts, setSocialPosts] = useState([]);
  
  useEffect(() => {
    // In a real application, this would fetch data from social media APIs
    setSocialPosts(realSocialPosts);
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


import { useState, useEffect } from 'react';
import { Twitter, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

// Latest social media posts from Banks o' Dee FC
const realSocialPosts = [
  {
    id: 1,
    platform: 'twitter',
    username: 'banksodee_fc',
    content: "𝗙𝗧 | Banks o' Dee 1-0 Turriff United. Craig Duguid's free-kick is enough to secure all three points at Spain Park. #BODHIGHL",
    date: 'August 10, 2024',
    likes: 28,
    comments: 5,
    shares: 8,
    image: '/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png'
  },
  {
    id: 2,
    platform: 'instagram',
    username: 'banksodeefc',
    content: "Full Time | Banks o' Dee 1-0 Turriff United. Craig Duguid's stunning free-kick is enough to secure all three points at Spain Park! ⚽️",
    date: 'August 10, 2024',
    likes: 82,
    comments: 7,
    image: '/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png'
  },
  {
    id: 3,
    platform: 'twitter',
    username: 'banksodee_fc',
    content: "🔵 Banks o' Dee XI v Turriff United: A.Coutts, Byrne, Hay, Paton, Angus, Forbes, Duguid (C), Dalling, Bugeja, Peters, Logan. Subs: Yunus, Antoniazzi, Phillip, Ritchie, Mair, Watson, T.Coutts.",
    date: 'August 10, 2024',
    likes: 19,
    comments: 0,
    shares: 4,
    image: null
  },
  {
    id: 4,
    platform: 'instagram',
    username: 'banksodeefc',
    content: "NEXT MATCH | Banks o' Dee v Turriff United. Saturday 10th August, 3PM at Spain Park. Adults £15, Concessions £10 & U16s FREE.",
    date: 'August 8, 2024',
    likes: 64,
    comments: 3,
    image: '/lovable-uploads/BOD_Navy.png'
  }
];

const SocialMediaFeed = () => {
  const [socialPosts, setSocialPosts] = useState([]);
  
  useEffect(() => {
    // In a real application, this would fetch data from social media APIs
    setSocialPosts(realSocialPosts);
  }, []);
  
  return (
    <section className="py-6 bg-team-gray">
      <div className="container mx-auto px-3">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-team-blue mb-1">Social Media</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Follow us on social media to stay updated with everything happening at Banks o' Dee FC.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
              <div className="flex items-center p-2 border-b border-gray-100">
                <div className={`p-1.5 rounded-full mr-1.5 ${post.platform === 'twitter' ? 'bg-[#1DA1F2]/10 text-[#1DA1F2]' : 'bg-[#C13584]/10 text-[#C13584]'}`}>
                  {post.platform === 'twitter' ? <Twitter className="w-3.5 h-3.5" /> : <Instagram className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <p className="font-semibold text-xs">@{post.username}</p>
                  <p className="text-[10px] text-gray-500">{post.date}</p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-2">
                <p className="text-xs text-gray-700 mb-2 line-clamp-3">{post.content}</p>
                
                {post.image && (
                  <div className="rounded-md overflow-hidden mb-2">
                    <img 
                      src={post.image} 
                      alt="Social media post" 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                
                {/* Stats */}
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>{post.likes} Likes</span>
                  <span>{post.comments} Comments</span>
                  {post.shares && <span>{post.shares} Shares</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-4">
          <div className="flex justify-center space-x-3">
            <a 
              href="https://x.com/banksodee_fc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-team-blue text-white p-2.5 rounded-full hover:bg-team-lightBlue transition-colors"
              aria-label="Twitter/X"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a 
              href="https://www.instagram.com/banksodeefc/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-team-blue text-white p-2.5 rounded-full hover:bg-team-lightBlue transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaFeed;

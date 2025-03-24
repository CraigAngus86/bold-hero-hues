
import { useState, useEffect } from 'react';
import { Twitter, Instagram, Facebook, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

// Latest social media posts from Banks o' Dee FC (expanded with more posts)
const realSocialPosts = [
  {
    id: 1,
    platform: 'twitter',
    username: 'banksodee_fc',
    content: "𝗙𝗧 | Banks o' Dee 1-0 Turriff United. Craig Duguid's free-kick is enough to secure all three points at Spain Park. #BODHIGHL",
    date: 'August 10, 2024',
    likes: 28,
    comments: 5,
    shares: 8
  },
  {
    id: 2,
    platform: 'instagram',
    username: 'banksodeefc',
    content: "Full Time | Banks o' Dee 1-0 Turriff United. Craig Duguid's stunning free-kick is enough to secure all three points at Spain Park! ⚽️",
    date: 'August 10, 2024',
    likes: 82,
    comments: 7
  },
  {
    id: 3,
    platform: 'twitter',
    username: 'banksodee_fc',
    content: "🔵 Banks o' Dee XI v Turriff United: A.Coutts, Byrne, Hay, Paton, Angus, Forbes, Duguid (C), Dalling, Bugeja, Peters, Logan. Subs: Yunus, Antoniazzi, Phillip, Ritchie, Mair, Watson, T.Coutts.",
    date: 'August 10, 2024',
    likes: 19,
    comments: 0,
    shares: 4
  },
  {
    id: 4,
    platform: 'instagram',
    username: 'banksodeefc',
    content: "NEXT MATCH | Banks o' Dee v Turriff United. Saturday 10th August, 3PM at Spain Park. Adults £15, Concessions £10 & U16s FREE.",
    date: 'August 8, 2024',
    likes: 64,
    comments: 3
  },
  {
    id: 5,
    platform: 'facebook',
    username: 'BanksODeeFCOfficial',
    content: "🎟️ TICKETS | Tickets for our upcoming Highland League match against Brechin City are now available online. Get yours early to avoid queues on matchday!",
    date: 'August 7, 2024',
    likes: 38,
    comments: 5,
    shares: 12
  },
  {
    id: 6,
    platform: 'twitter',
    username: 'banksodee_fc',
    content: "📣 NEW SIGNING | We're delighted to announce the signing of midfielder Jack Henderson from Cove Rangers on a two-year deal. Welcome to Spain Park, Jack! #BODTransfer",
    date: 'August 5, 2024',
    likes: 92,
    comments: 13,
    shares: 21
  },
  {
    id: 7,
    platform: 'facebook',
    username: 'BanksODeeFCOfficial',
    content: "🏆 THROWBACK | On this day in 2022, Banks o' Dee lifted the Evening Express Aberdeenshire Cup after a thrilling 3-2 victory against Buckie Thistle at Harlaw Park. What a day for the club!",
    date: 'August 3, 2024',
    likes: 123,
    comments: 18,
    shares: 15
  },
  {
    id: 8,
    platform: 'instagram',
    username: 'banksodeefc',
    content: "💙 Supporting our local community! Players from Banks o' Dee visited Aberdeen Children's Hospital yesterday to donate signed merchandise and spend time with the young patients. #CommunitySpirit",
    date: 'August 1, 2024',
    likes: 145,
    comments: 12
  }
];

const SocialMediaFeed = () => {
  const [socialPosts, setSocialPosts] = useState([]);
  
  useEffect(() => {
    // In a real application, this would fetch data from social media APIs
    // Limit to only 8 posts
    setSocialPosts(realSocialPosts.slice(0, 8));
  }, []);
  
  return (
    <section className="py-6 bg-team-gray">
      <div className="container mx-auto px-3">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold text-team-blue mb-1">Social Media</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Follow us on social media to stay updated with everything happening at Banks o' Dee FC.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {socialPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow aspect-square flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center p-3 border-b border-gray-100">
                <div className={`p-1.5 rounded-full mr-1.5 ${
                  post.platform === 'twitter' ? 'bg-[#1DA1F2]/10 text-[#1DA1F2]' : 
                  post.platform === 'instagram' ? 'bg-[#C13584]/10 text-[#C13584]' : 
                  'bg-[#1877F2]/10 text-[#1877F2]'
                }`}>
                  {post.platform === 'twitter' ? <Twitter className="w-3.5 h-3.5" /> : 
                   post.platform === 'instagram' ? <Instagram className="w-3.5 h-3.5" /> : 
                   <Facebook className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <p className="font-semibold text-xs">@{post.username}</p>
                  <p className="text-[10px] text-gray-500">{post.date}</p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-3 flex-1 flex flex-col">
                <p className="text-xs text-gray-700 mb-2 line-clamp-6 flex-1">{post.content}</p>
                
                {/* Stats */}
                <div className="flex justify-between text-[10px] text-gray-500 mt-auto">
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
            <a 
              href="https://www.facebook.com/BanksODeeFCOfficial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-team-blue text-white p-2.5 rounded-full hover:bg-team-lightBlue transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaFeed;

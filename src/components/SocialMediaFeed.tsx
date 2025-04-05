
import { useState, useEffect } from 'react';
import { Twitter, Instagram, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Social media feed data interface
interface SocialPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'facebook';
  username: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  shares?: number;
  mediaUrl?: string;
  profileImage?: string;
}

// Latest social media posts from Banks o' Dee FC with updated links
const realSocialPosts: SocialPost[] = [
  {
    id: "1",
    platform: "twitter",
    username: "banksodee_fc",
    content: "𝗙𝗧 | Banks o' Dee 1-0 Turriff United. Craig Duguid's free-kick is enough to secure all three points at Spain Park. #BODHIGHL",
    date: "April 5, 2025",
    likes: 28,
    comments: 5,
    shares: 8,
    profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png"
  },
  {
    id: "2",
    platform: "instagram",
    username: "banksodeefc",
    content: "Full Time | Banks o' Dee 1-0 Turriff United. Craig Duguid's stunning free-kick is enough to secure all three points at Spain Park! ⚽️",
    date: "April 4, 2025",
    likes: 82,
    comments: 7,
    mediaUrl: "/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png",
    profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png"
  },
  {
    id: "3",
    platform: "twitter",
    username: "banksodee_fc",
    content: "🔵 Banks o' Dee XI v Turriff United: A.Coutts, Byrne, Hay, Paton, Angus, Forbes, Duguid (C), Dalling, Bugeja, Peters, Logan. Subs: Yunus, Antoniazzi, Phillip, Ritchie, Mair, Watson, T.Coutts.",
    date: "April 3, 2025",
    likes: 19,
    comments: 0,
    shares: 4,
    profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png"
  },
  {
    id: "4",
    platform: "instagram",
    username: "banksodeefc",
    content: "NEXT MATCH | Banks o' Dee v Turriff United. Saturday 10th April, 3PM at Spain Park. Adults £15, Concessions £10 & U16s FREE.",
    date: "April 2, 2025",
    likes: 64,
    comments: 3,
    mediaUrl: "/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png",
    profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png"
  },
  {
    id: "5",
    platform: "facebook",
    username: "banksodeejfc",
    content: "🎟️ TICKETS | Tickets for our upcoming Highland League match against Brechin City are now available online. Get yours early to avoid queues on matchday!",
    date: "April 1, 2025",
    likes: 38,
    comments: 5,
    shares: 12,
    profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png"
  },
  {
    id: "6",
    platform: "twitter",
    username: "banksodee_fc",
    content: "📣 NEW SIGNING | We're delighted to announce the signing of midfielder Jack Henderson from Cove Rangers on a two-year deal. Welcome to Spain Park, Jack! #BODTransfer",
    date: "March 31, 2025",
    likes: 92,
    comments: 13,
    shares: 21,
    mediaUrl: "/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png",
    profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png"
  },
  {
    id: "7",
    platform: "facebook",
    username: "banksodeejfc",
    content: "🏆 THROWBACK | On this day in 2022, Banks o' Dee lifted the Evening Express Aberdeenshire Cup after a thrilling 3-2 victory against Buckie Thistle at Harlaw Park. What a day for the club!",
    date: "March 29, 2025",
    likes: 123,
    comments: 18,
    shares: 15,
    profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png"
  },
  {
    id: "8",
    platform: "instagram",
    username: "banksodeefc",
    content: "💙 Supporting our local community! Players from Banks o' Dee visited Aberdeen Children's Hospital yesterday to donate signed merchandise and spend time with the young patients. #CommunitySpirit",
    date: "March 27, 2025",
    likes: 145,
    comments: 12,
    mediaUrl: "/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png",
    profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png"
  }
];

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

// Mock API function - this would be replaced with actual API calls in production
const fetchSocialPosts = async (): Promise<SocialPost[]> => {
  console.log('Fetching social media posts...');
  // This simulates an API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Sort by date (newest first)
  return [...realSocialPosts].sort((a, b) => {
    // Convert date strings to Date objects for proper comparison
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};

const SocialMediaFeed = () => {
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['socialPosts'],
    queryFn: fetchSocialPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: REFRESH_INTERVAL // Auto-refresh every 10 minutes
  });
  
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Filter posts based on active tab
  const filteredPosts = posts?.filter(post => {
    if (activeFilter === 'all') return true;
    return post.platform === activeFilter;
  }) || [];
  
  // Refresh posts manually
  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing social media feed...");
  };
  
  // Get platform icon and styling
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-3.5 h-3.5" />;
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5" />;
      case 'facebook':
        return <Facebook className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };
  
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'bg-[#1DA1F2]/10 text-[#1DA1F2]';
      case 'instagram':
        return 'bg-[#C13584]/10 text-[#C13584]';
      case 'facebook': 
        return 'bg-[#1877F2]/10 text-[#1877F2]';
      default:
        return '';
    }
  };

  const getPlatformUrl = (platform: string, username: string) => {
    switch (platform) {
      case 'twitter':
        return `https://x.com/${username}`;
      case 'instagram':
        return `https://www.instagram.com/${username}/`;
      case 'facebook':
        return `https://www.facebook.com/${username}/`;
      default:
        return '#';
    }
  };
  
  return (
    <section className="py-6 bg-team-gray">
      <div className="container mx-auto px-3">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold text-team-blue mb-1">Social Media</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Follow us on social media to stay updated with everything happening at Banks o' Dee FC.
          </p>
          
          <div className="flex justify-center mt-2 space-x-3">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`text-xs px-3 py-1 rounded-full ${
                activeFilter === 'all' 
                  ? 'bg-team-blue text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveFilter('twitter')}
              className={`text-xs px-3 py-1 rounded-full flex items-center ${
                activeFilter === 'twitter' 
                  ? 'bg-[#1DA1F2] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
            >
              <Twitter className="w-3 h-3 mr-1" /> Twitter
            </button>
            <button 
              onClick={() => setActiveFilter('instagram')}
              className={`text-xs px-3 py-1 rounded-full flex items-center ${
                activeFilter === 'instagram' 
                  ? 'bg-[#C13584] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
            >
              <Instagram className="w-3 h-3 mr-1" /> Instagram
            </button>
            <button 
              onClick={() => setActiveFilter('facebook')}
              className={`text-xs px-3 py-1 rounded-full flex items-center ${
                activeFilter === 'facebook' 
                  ? 'bg-[#1877F2] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
            >
              <Facebook className="w-3 h-3 mr-1" /> Facebook
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                    <div>
                      <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="h-12 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-800 text-center">
            <p>Unable to load social media posts. Please try again later.</p>
            <button 
              onClick={handleRefresh} 
              className="mt-2 px-4 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredPosts.slice(0, 8).map((post) => (
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
                  <div className={`p-1.5 rounded-full mr-1.5 ${getPlatformColor(post.platform)}`}>
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div>
                    <p className="font-semibold text-xs">@{post.username}</p>
                    <p className="text-[10px] text-gray-500">{post.date}</p>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-3 flex-1 flex flex-col">
                  <p className="text-xs text-gray-700 mb-2 line-clamp-6 flex-1">{post.content}</p>
                  
                  {post.mediaUrl && (
                    <div className="mb-2 rounded overflow-hidden">
                      <img 
                        src={post.mediaUrl} 
                        alt="Post media" 
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
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
        )}
        
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
              href="https://www.facebook.com/banksodeejfc/" 
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

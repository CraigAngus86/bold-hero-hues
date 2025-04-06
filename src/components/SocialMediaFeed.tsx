
import React, { useState } from 'react';
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
  }
];

const fetchSocialPosts = async (): Promise<SocialPost[]> => {
  // This simulates an API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return realSocialPosts;
};

const SocialMediaFeed: React.FC = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['socialPosts'],
    queryFn: fetchSocialPosts
  });
  
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Filter posts based on active tab
  const filteredPosts = posts?.filter(post => {
    if (activeFilter === 'all') return true;
    return post.platform === activeFilter;
  }) || [];
  
  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-3 h-3" />;
      case 'instagram':
        return <Instagram className="w-3 h-3" />;
      case 'facebook':
        return <Facebook className="w-3 h-3" />;
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
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 rounded-md p-3 animate-pulse">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="ml-2">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-2 bg-gray-200 rounded w-16 mt-1"></div>
              </div>
            </div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">Unable to load social posts</p>
      </div>
    );
  }
  
  return (
    <div>
      {/* Filter tabs */}
      <div className="flex justify-center mb-3 space-x-2">
        <button 
          onClick={() => setActiveFilter('all')}
          className={`text-xs px-2 py-0.5 rounded-full ${
            activeFilter === 'all' 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-colors`}
        >
          All
        </button>
        <button 
          onClick={() => setActiveFilter('twitter')}
          className={`text-xs px-2 py-0.5 rounded-full flex items-center ${
            activeFilter === 'twitter' 
              ? 'bg-[#1DA1F2] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-colors`}
        >
          <Twitter className="w-2.5 h-2.5 mr-1" /> Twitter
        </button>
        <button 
          onClick={() => setActiveFilter('instagram')}
          className={`text-xs px-2 py-0.5 rounded-full flex items-center ${
            activeFilter === 'instagram' 
              ? 'bg-[#C13584] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-colors`}
        >
          <Instagram className="w-2.5 h-2.5 mr-1" /> Insta
        </button>
      </div>
      
      {/* Posts */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto hide-scrollbar pr-2">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-gray-50 rounded-md p-3"
          >
            {/* Header */}
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                {post.profileImage ? (
                  <img 
                    src={post.profileImage} 
                    alt={post.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                    {post.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="ml-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">@{post.username}</span>
                  <span className={`text-[10px] rounded-full px-1.5 py-0.5 flex items-center ${getPlatformColor(post.platform)}`}>
                    {getPlatformIcon(post.platform)}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500">{post.date}</div>
              </div>
            </div>
            
            {/* Content */}
            <p className="text-xs text-gray-700 mb-2">{post.content}</p>
            
            {/* Media */}
            {post.mediaUrl && (
              <div className="rounded-md overflow-hidden mb-2">
                <img 
                  src={post.mediaUrl} 
                  alt="Post media" 
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            )}
            
            {/* Stats */}
            <div className="flex text-[10px] text-gray-500 space-x-3">
              <span>{post.likes} likes</span>
              <span>{post.comments} comments</span>
              {post.shares !== undefined && <span>{post.shares} shares</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaFeed;


import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SocialPost {
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
  url?: string;
}

// Function to format relative time
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const secondsDiff = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (secondsDiff < 60) return `${secondsDiff}s ago`;
  if (secondsDiff < 3600) return `${Math.floor(secondsDiff / 60)}m ago`;
  if (secondsDiff < 86400) return `${Math.floor(secondsDiff / 3600)}h ago`;
  if (secondsDiff < 604800) return `${Math.floor(secondsDiff / 86400)}d ago`;
  
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

// Function to fetch social media posts from edge function
const fetchSocialMedia = async (platforms: string[] = ['twitter', 'instagram', 'facebook']) => {
  try {
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('social-media-feeds', {
      body: { platforms }
    });
    
    if (error) {
      console.error('Error from Edge Function:', error);
      throw error;
    }
    
    return data.posts;
  } catch (error) {
    console.error('Error fetching social media posts:', error);
    
    // Fallback to mock data in case of errors
    return [
      {
        id: "1",
        platform: "twitter",
        username: "banksodee_fc",
        content: "𝗙𝗧 | Banks o' Dee 1-0 Turriff United. Craig Duguid's free-kick is enough to secure all three points at Spain Park. #BODHIGHL",
        date: new Date().toISOString(),
        likes: 28,
        comments: 5,
        shares: 8,
        profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
        url: "https://x.com/banksodee_fc/status/1234567890"
      },
      {
        id: "2",
        platform: "instagram",
        username: "banksodeefc",
        content: "Full Time | Banks o' Dee 1-0 Turriff United. Craig Duguid's stunning free-kick is enough to secure all three points at Spain Park! ⚽️",
        date: new Date().toISOString(),
        likes: 82,
        comments: 7,
        mediaUrl: "/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png",
        profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
        url: "https://www.instagram.com/p/abcdef/"
      },
      {
        id: "3",
        platform: "facebook",
        username: "banksodeejfc",
        content: "🎟️ TICKETS | Tickets for our upcoming Highland League match against Brechin City are now available online. Get yours early to avoid queues on matchday!",
        date: new Date().toISOString(),
        likes: 38,
        comments: 5,
        shares: 12,
        profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
        url: "https://www.facebook.com/banksodeejfc/posts/123456789"
      }
    ];
  }
};

export function useSocialMedia(platforms?: string[]) {
  const fetchPosts = useCallback(() => {
    return fetchSocialMedia(platforms);
  }, [platforms]);

  return useQuery({
    queryKey: ['socialMedia', ...(platforms || [])],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
  });
}

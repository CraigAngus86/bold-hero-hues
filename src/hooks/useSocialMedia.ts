
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
      },
      {
        id: "4",
        platform: "twitter",
        username: "banksodee_fc", 
        content: "📣 NEW SIGNING | We're delighted to announce the signing of midfielder Jack Henderson from Cove Rangers on a two-year deal. Welcome to Spain Park, Jack! #BODTransfer",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 92,
        comments: 13,
        shares: 21,
        mediaUrl: "/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png",
        profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
        url: "https://x.com/banksodee_fc/status/0987654321"
      },
      {
        id: "5",
        platform: "instagram",
        username: "banksodeefc",
        content: "💙 Supporting our local community! Players from Banks o' Dee visited Aberdeen Children's Hospital yesterday to donate signed merchandise and spend time with the young patients. #CommunitySpirit",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 145,
        comments: 12,
        mediaUrl: "/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png",
        profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
        url: "https://www.instagram.com/p/ghijkl/"
      },
      {
        id: "6",
        platform: "facebook",
        username: "banksodeejfc",
        content: "🏆 THROWBACK | On this day in 2022, Banks o' Dee lifted the Evening Express Aberdeenshire Cup after a thrilling 3-2 victory against Buckie Thistle at Harlaw Park. What a day for the club!",
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 123,
        comments: 18,
        shares: 15,
        profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
        url: "https://www.facebook.com/banksodeejfc/posts/123456789"
      },
      {
        id: "7",
        platform: "twitter",
        username: "banksodee_fc",
        content: "🔵 Banks o' Dee XI v Turriff United: A.Coutts, Byrne, Hay, Paton, Angus, Forbes, Duguid (C), Dalling, Bugeja, Peters, Logan. Subs: Yunus, Antoniazzi, Phillip, Ritchie, Mair, Watson, T.Coutts.",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 19,
        comments: 0,
        shares: 4,
        profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
        url: "https://x.com/banksodee_fc/status/1234567890"
      },
      {
        id: "8",
        platform: "instagram",
        username: "banksodeefc",
        content: "NEXT MATCH | Banks o' Dee v Brechin City. Saturday 17th April, 3PM at Spain Park. Adults £15, Concessions £10 & U16s FREE.",
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 64,
        comments: 3,
        mediaUrl: "/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png",
        profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
        url: "https://www.instagram.com/p/abcdef/"
      },
      {
        id: "9",
        platform: "facebook",
        username: "banksodeejfc",
        content: "🎫 SEASON TICKETS | 2025/26 season tickets are now available to purchase online. Secure your seat for all home Highland League matches! Visit our website for more information.",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 87,
        comments: 11,
        shares: 23,
        profileImage: "/lovable-uploads/banks-o-dee-dark-logo.png",
        url: "https://www.facebook.com/banksodeejfc/posts/123456789"
      },
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

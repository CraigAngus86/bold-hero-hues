
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Updated mock data for featured content with correct image paths
const mockFeaturedItems = [
  {
    id: uuidv4(),
    title: 'Banks O\' Dee Secure Highland League Title',
    content: 'In a thrilling match, Banks O\' Dee secured the Highland League title with a 3-1 victory.',
    image: '/public/HLC_Slider_1920x1080.jpg',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'news',
    slug: 'banks-o-dee-secure-highland-league-title'
  },
  {
    id: uuidv4(),
    title: 'New Stadium Development Update',
    content: 'Progress on the new stadium development continues with the completion of the main stand foundations.',
    image: '/public/Training-02.jpg',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'news',
    slug: 'new-stadium-development-update'
  },
  {
    id: uuidv4(),
    title: 'Club Announces New Sponsor',
    content: 'Banks O\' Dee FC is proud to announce a new sponsorship deal with a leading local business.',
    image: '/public/Training-04.jpg',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'news',
    slug: 'club-announces-new-sponsor'
  },
  {
    id: uuidv4(),
    title: 'Youth Team Wins Regional Cup',
    content: 'Our U18 team has won the regional youth cup after a penalty shootout victory.',
    image: '/public/Post-Match-Reaction-Players.jpg',
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'news',
    slug: 'youth-team-wins-regional-cup'
  }
];

// Type for featured content items
export interface FeaturedItem {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  type: string;
  slug: string;
  summary?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  slug: string;
  summary?: string;
}

export interface UseContentResult {
  featured: FeaturedItem[];
  featuredArticle?: FeaturedItem;
  nextMatch?: any;
  leaguePosition?: any;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useFeaturedContent(): UseContentResult {
  const [featured, setFeatured] = useState<FeaturedItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Process the mock data
      const processedItems = mockFeaturedItems.map(item => ({
        ...item,
        summary: item.content?.substring(0, 120) + (item.content?.length > 120 ? '...' : ''),
      }));
      
      setFeatured(processedItems);
    } catch (err) {
      console.error('Error fetching featured content:', err);
      setError('Failed to load featured content');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedContent();
  }, [fetchFeaturedContent]);

  return {
    featured,
    featuredArticle: featured.length > 0 ? featured[0] : undefined,
    nextMatch: { opponent: "Fraserburgh FC", date: "2023-12-16", time: "15:00", location: "Home" },
    leaguePosition: { position: 3, points: 42, gamesPlayed: 18 },
    isLoading,
    error,
    refresh: fetchFeaturedContent
  };
}

export default useFeaturedContent;

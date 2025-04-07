import { useState, useEffect } from 'react';
import { useNewsStore } from '@/services/news';
import { supabase } from '@/lib/supabase';

interface FeaturedArticle {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  image_url: string;
  category: string;
  publish_date: string;
}

interface NextMatch {
  id: string;
  home_team: string;
  away_team: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  is_next_match: boolean;
  ticket_link?: string;
}

interface LeaguePosition {
  position: number;
  played: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

interface UseFeaturedContentResult {
  featuredArticle: FeaturedArticle | null;
  nextMatch: NextMatch | null;
  leaguePosition: LeaguePosition | null;
  isLoading: boolean;
  error: Error | null;
}

export const useFeaturedContent = (): UseFeaturedContentResult => {
  const [featuredArticle, setFeaturedArticle] = useState<FeaturedArticle | null>(null);
  const [nextMatch, setNextMatch] = useState<NextMatch | null>(null);
  const [leaguePosition, setLeaguePosition] = useState<LeaguePosition | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { news } = useNewsStore();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get featured article from news store or fetch it
        let featuredArticleData = null;
        if (news && news.length > 0) {
          // Find a featured article or use the most recent one
          const featured = news.find(article => article.is_featured) || news[0];
          featuredArticleData = {
            id: featured.id,
            title: featured.title,
            content: featured.excerpt || featured.summary || 'No content available',
            excerpt: featured.excerpt || featured.summary ? 
              (featured.excerpt || featured.summary).substring(0, 150) + '...' : 
              'No content available',
            image_url: featured.image_url || '/lovable-uploads/banks-o-dee-dark-logo.png',
            category: featured.category || 'News',
            publish_date: featured.publish_date || featured.date || new Date().toISOString()
          };
        } else {
          // If no articles in store, fetch from Supabase
          const { data: articleData } = await supabase
            .from('news_articles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (articleData) {
            featuredArticleData = {
              id: articleData.id,
              title: articleData.title,
              content: articleData.content,
              excerpt: articleData.content.substring(0, 150) + '...',
              image_url: articleData.image_url || '/lovable-uploads/banks-o-dee-dark-logo.png',
              category: articleData.category,
              publish_date: articleData.publish_date
            };
          }
        }
        
        // 2. Get next match data
        const { data: matchData } = await supabase
          .from('fixtures')
          .select('*')
          .eq('is_next_match', true)
          .limit(1)
          .single();
          
        // 3. Get league position data (mock data as we don't have a league table yet)
        const mockLeaguePosition: LeaguePosition = {
          position: 3,
          played: 10,
          points: 21,
          form: ['W', 'W', 'D', 'L', 'W']
        };
        
        setFeaturedArticle(featuredArticleData);
        setNextMatch(matchData);
        setLeaguePosition(mockLeaguePosition);
      } catch (err) {
        console.error('Error fetching featured content:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [news]);
  
  return {
    featuredArticle,
    nextMatch,
    leaguePosition,
    isLoading,
    error
  };
};

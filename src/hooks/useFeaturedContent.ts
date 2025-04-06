
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types/news';
import { TeamStats } from '@/types/fixtures';

export interface FeaturedContentData {
  featuredArticle: NewsArticle | null;
  nextMatch: any | null; // Using any for fixture since there are type inconsistencies
  leaguePosition: TeamStats | null;
  isLoading: boolean;
  error: Error | null;
}

export const useFeaturedContent = (): FeaturedContentData => {
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(null);
  const [nextMatch, setNextMatch] = useState<any | null>(null);
  const [leaguePosition, setLeaguePosition] = useState<TeamStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchFeaturedContent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch featured article
        const { data: articles, error: articlesError } = await supabase
          .from('news_articles')
          .select('*')
          .eq('is_featured', true)
          .order('publish_date', { ascending: false })
          .limit(1);
        
        if (articlesError) throw articlesError;
        
        // Fetch next match
        const { data: matches, error: matchesError } = await supabase
          .from('fixtures')
          .select('*')
          .eq('is_next_match', true)
          .limit(1);
        
        if (matchesError) throw matchesError;
        
        // Fetch league position (Banks o' Dee FC)
        const { data: teamStats, error: statsError } = await supabase
          .from('highland_league_table')
          .select('*')
          .eq('team', 'Banks o\' Dee')
          .single();
        
        if (statsError && statsError.code !== 'PGRST116') throw statsError;
        
        // Update state with fetched data
        setFeaturedArticle(articles && articles.length > 0 ? articles[0] : null);
        setNextMatch(matches && matches.length > 0 ? matches[0] : null);
        setLeaguePosition(teamStats || null);
      } catch (err) {
        console.error('Error fetching featured content:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch featured content'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedContent();
  }, []);
  
  return {
    featuredArticle,
    nextMatch,
    leaguePosition,
    isLoading,
    error
  };
};

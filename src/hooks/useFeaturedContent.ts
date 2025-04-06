
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { NewsArticle } from '@/types/news';
import { Fixture } from '@/types/fixtures';
import { TeamStats } from '@/types/fixtures';

interface UseFeaturedContentResult {
  featuredArticle: NewsArticle | null;
  nextMatch: Fixture | null;
  leaguePosition: TeamStats | null;
  isLoading: boolean;
  error: Error | null;
}

export const useFeaturedContent = (): UseFeaturedContentResult => {
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(null);
  const [nextMatch, setNextMatch] = useState<Fixture | null>(null);
  const [leaguePosition, setLeaguePosition] = useState<TeamStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      setIsLoading(true);
      
      try {
        // Fetch featured article
        const { data: featuredData, error: featuredError } = await supabase
          .from('news_articles')
          .select('*')
          .eq('is_featured', true)
          .order('publish_date', { ascending: false })
          .limit(1)
          .single();
          
        if (featuredError && featuredError.code !== 'PGRST116') {
          console.error('Error fetching featured article:', featuredError);
        } else {
          setFeaturedArticle(featuredData || null);
        }
        
        // Fetch next match
        const { data: nextMatchData, error: nextMatchError } = await supabase
          .from('fixtures')
          .select('*')
          .eq('is_next_match', true)
          .limit(1)
          .single();
          
        if (nextMatchError && nextMatchError.code !== 'PGRST116') {
          console.error('Error fetching next match:', nextMatchError);
        } else {
          setNextMatch(nextMatchData || null);
        }
        
        // Fetch league position data
        const { data: leagueData, error: leagueError } = await supabase
          .from('highland_league_table')
          .select('*')
          .eq('team', 'Banks o\' Dee')
          .single();
          
        if (leagueError && leagueError.code !== 'PGRST116') {
          console.error('Error fetching league position:', leagueError);
        } else {
          setLeaguePosition(leagueData || null);
        }
        
      } catch (err) {
        console.error('Error fetching featured content:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch featured content'));
        toast.error('Failed to load featured content');
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

export default useFeaturedContent;

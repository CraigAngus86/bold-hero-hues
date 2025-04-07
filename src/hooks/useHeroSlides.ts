
import { useState, useEffect } from 'react';

// Types for hero slider content
export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  video_url?: string;
  link_text?: string;
  link_url?: string;
}

export interface NextMatch {
  id: string;
  home_team: string;
  away_team: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  ticket_link?: string;
}

export interface LatestResult {
  id: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  date: string;
  competition: string;
}

export interface BreakingNews {
  active: boolean;
  message: string;
  link?: string;
}

/**
 * Hook to fetch hero slides data
 * Currently uses static data, but can be updated to fetch from API
 */
export const useHeroSlides = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [nextMatch, setNextMatch] = useState<NextMatch | null>(null);
  const [latestResult, setLatestResult] = useState<LatestResult | null>(null);
  const [breakingNews, setBreakingNews] = useState<BreakingNews | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // This would be replaced by actual API calls
        
        // Mock data for hero slides
        const heroSlides: HeroSlide[] = [
          {
            id: '1',
            image_url: '/lovable-uploads/banks-o-dee-dark-logo.png',
            title: 'Welcome to Banks o\' Dee FC',
            subtitle: 'Home of Spain Park, Aberdeen',
            link_text: 'Learn More',
            link_url: '/about',
          },
          {
            id: '2',
            image_url: '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
            title: 'Join us at Spain Park',
            subtitle: 'Support the team in our upcoming fixtures',
            link_text: 'View Fixtures',
            link_url: '/fixtures',
          },
          {
            id: '3',
            image_url: '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png',
            title: 'Latest Club News',
            subtitle: 'Stay up to date with all things Banks o\' Dee',
            link_text: 'Read More',
            link_url: '/news',
          }
        ];
        
        // Mock data for next match
        const nextMatchData: NextMatch = {
          id: 'next-1',
          home_team: 'Banks o\' Dee',
          away_team: 'Formartine United',
          date: '2025-05-15',
          time: '15:00',
          venue: 'Spain Park',
          competition: 'Highland League',
          ticket_link: '/tickets/next-match'
        };
        
        // Mock data for latest result
        const latestResultData: LatestResult = {
          id: 'result-1',
          home_team: 'Banks o\' Dee',
          away_team: 'Keith FC',
          home_score: 3,
          away_score: 1,
          date: '2025-05-01',
          competition: 'Highland League'
        };
        
        // Mock breaking news
        const breakingNewsData: BreakingNews = {
          active: true,
          message: 'New signing announcement: John Smith joins from Aberdeen FC!',
          link: '/news/new-signing'
        };

        setSlides(heroSlides);
        setNextMatch(nextMatchData);
        setLatestResult(latestResultData);
        setBreakingNews(breakingNewsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching hero slides:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching hero slides'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    slides,
    isLoading,
    error,
    nextMatch,
    latestResult,
    breakingNews
  };
};

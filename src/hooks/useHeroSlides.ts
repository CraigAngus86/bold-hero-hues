
import { useState, useEffect } from 'react';

interface HeroSlide {
  id: string;
  image_url: string;
  video_url?: string;
  title: string;
  subtitle?: string;
  link_text?: string;
  link_url?: string;
}

interface NextMatch {
  id: string;
  home_team: string;
  away_team: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  ticket_link?: string;
}

interface LatestResult {
  id: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  date: string;
  competition: string;
}

interface BreakingNews {
  active: boolean;
  message: string;
}

interface UseHeroSlidesReturn {
  slides: HeroSlide[];
  isLoading: boolean;
  error: Error | null;
  nextMatch: NextMatch | null;
  latestResult: LatestResult | null;
  breakingNews: BreakingNews | null;
}

export const useHeroSlides = (): UseHeroSlidesReturn => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [nextMatch, setNextMatch] = useState<NextMatch | null>(null);
  const [latestResult, setLatestResult] = useState<LatestResult | null>(null);
  const [breakingNews, setBreakingNews] = useState<BreakingNews | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API loading
        await new Promise(resolve => setTimeout(resolve, 500));

        // Updated hero slide data with correct image paths
        const mockSlides: HeroSlide[] = [
          {
            id: '1',
            image_url: '/lovable-uploads/9ca9c466-2008-4fa8-8258-979a7b5ae9f8.jpeg',
            title: 'Welcome to Banks o\' Dee FC',
            subtitle: 'Home of Spain Park, Aberdeen',
            link_text: 'Learn More',
            link_url: '/about',
          },
          {
            id: '2',
            image_url: '/lovable-uploads/74f0cf13-9569-4b38-a479-b24192aeb21f.jpeg',
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

        // Mock next match data
        const mockNextMatch: NextMatch = {
          id: 'next-1',
          home_team: 'Banks o\' Dee',
          away_team: 'Formartine United',
          date: '2025-05-15',
          time: '15:00',
          venue: 'Spain Park',
          competition: 'Highland League',
          ticket_link: '/tickets/next-match'
        };

        // Mock latest result data
        const mockLatestResult: LatestResult = {
          id: 'result-1',
          home_team: 'Banks o\' Dee',
          away_team: 'Keith FC',
          home_score: 3,
          away_score: 1,
          date: '2025-05-01',
          competition: 'Highland League'
        };

        // Mock breaking news
        const mockBreakingNews: BreakingNews = {
          active: true,
          message: 'New signing announcement: John Smith joins from Aberdeen FC!'
        };

        setSlides(mockSlides);
        setNextMatch(mockNextMatch);
        setLatestResult(mockLatestResult);
        setBreakingNews(mockBreakingNews);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching hero data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching hero data'));
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


import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface HeroSlide {
  id: string;
  image_url: string;
  video_url?: string;
  title: string;
  subtitle?: string;
  link_text?: string;
  link_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface BreakingNews {
  active: boolean;
  message: string;
}

export interface UseHeroSlidesResult {
  slides: HeroSlide[];
  currentIndex: number;
  currentSlide: HeroSlide;
  isLoading: boolean;
  error: Error | null;
  goToSlide: (index: number) => void;
  goToNextSlide: () => void;
  goToPrevSlide: () => void;
  nextMatch: any;
  latestResult: any;
  recentResults: any[];
  breakingNews?: BreakingNews;
}

export const useHeroSlides = (): UseHeroSlidesResult => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [nextMatch, setNextMatch] = useState<any>(null);
  const [latestResult, setLatestResult] = useState<any>(null);
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [breakingNews, setBreakingNews] = useState<BreakingNews | undefined>(undefined);

  // Function to fetch hero slides
  useEffect(() => {
    const fetchSlides = async () => {
      setIsLoading(true);
      try {
        // Fetch hero slides
        const { data: slideData, error: slideError } = await supabase
          .from('hero_slides')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (slideError) throw slideError;
        
        // If no slides, create demo slides
        if (!slideData || slideData.length === 0) {
          // Fallback to news articles for demo slides
          const { data: newsData } = await supabase
            .from('news_articles')
            .select('*')
            .order('publish_date', { ascending: false })
            .limit(3);
            
          if (newsData && newsData.length > 0) {
            const demoSlides = newsData.map((item, index) => ({
              id: item.id.toString(),
              image_url: item.image_url || '/lovable-uploads/banks-o-dee-dark-logo.png',
              title: item.title,
              subtitle: `Latest news from Banks o' Dee FC - ${new Date(item.publish_date).toLocaleDateString()}`,
              link_text: 'Read More',
              link_url: `/news/${item.id}`,
              display_order: index,
              is_active: true
            }));
            setSlides(demoSlides);
          } else {
            // If even news isn't available, create a default slide
            setSlides([{
              id: '1',
              image_url: '/lovable-uploads/banks-o-dee-dark-logo.png',
              title: 'Welcome to Banks o\' Dee FC',
              subtitle: 'Home of Spain Park, Aberdeen',
              link_text: 'Explore',
              link_url: '/about',
              display_order: 0,
              is_active: true
            }]);
          }
        } else {
          setSlides(slideData);
        }

        // Fetch next match
        const { data: nextMatchData } = await supabase
          .from('fixtures')
          .select('*')
          .eq('is_next_match', true)
          .limit(1)
          .single();
          
        setNextMatch(nextMatchData || null);
        
        // Fetch latest result
        const { data: latestResultData } = await supabase
          .from('fixtures')
          .select('*')
          .eq('is_latest_result', true)
          .limit(1)
          .single();
          
        setLatestResult(latestResultData || null);
        
        // Fetch recent results
        const { data: recentResultsData } = await supabase
          .from('fixtures')
          .select('*')
          .eq('is_completed', true)
          .order('date', { ascending: false })
          .limit(5);
          
        setRecentResults(recentResultsData || []);
        
        // Fetch breaking news
        const { data: breakingNewsData } = await supabase
          .from('site_settings')
          .select('*')
          .eq('key', 'breaking_news')
          .single();
          
        if (breakingNewsData && breakingNewsData.value) {
          try {
            const newsData = JSON.parse(breakingNewsData.value);
            setBreakingNews({
              active: newsData.active || false,
              message: newsData.message || ''
            });
          } catch (err) {
            console.error('Error parsing breaking news:', err);
          }
        }
        
      } catch (err) {
        console.error('Error fetching hero data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch hero data'));
        toast.error('Failed to load hero content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  // Determine the current slide
  const currentSlide = slides[currentIndex] || {
    id: '0',
    image_url: '',
    title: '',
    display_order: 0,
    is_active: true
  };

  return {
    slides,
    currentIndex,
    currentSlide,
    isLoading,
    error,
    goToSlide,
    goToNextSlide,
    goToPrevSlide,
    nextMatch,
    latestResult,
    recentResults,
    breakingNews
  };
};

export default useHeroSlides;


import { useState, useEffect } from 'react';
import { HeroSlide, getActiveHeroSlides } from '@/services/heroService';
import { useNewsStore, formatDate } from '@/services/news';
import { useFixturesData } from '@/components/home/fixtures';

export const useHeroSlides = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { news } = useNewsStore();
  const { nextMatch, recentResults } = useFixturesData();
  
  // Fetch hero slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      setIsLoading(true);
      
      try {
        // First try to get slides from the database
        const activeSlides = await getActiveHeroSlides();
        
        if (activeSlides && activeSlides.length > 0) {
          setSlides(activeSlides);
        } else {
          // Fallback to generating slides from news articles
          const heroNews = [...news]
            .filter(article => article.image_url)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3)
            .map((article, index) => ({
              id: article.id,
              image_url: article.image_url || '',
              title: article.title,
              subtitle: article.category,
              link_text: 'Read More',
              link_url: `/news/${article.id}`,
              display_order: index,
              is_active: true
            }));
          
          setSlides(heroNews as HeroSlide[]);
        }
      } catch (error) {
        console.error('Error in useHeroSlides:', error);
        // If all fails, use empty array
        setSlides([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSlides();
  }, [news]);
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };
  
  return {
    slides,
    currentIndex,
    currentSlide: slides[currentIndex],
    isLoading,
    goToSlide,
    goToNextSlide,
    goToPrevSlide,
    nextMatch,
    recentResults
  };
};

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/services/news/utils';
import { Link } from 'react-router-dom';
import { useFeaturedArticles } from '@/hooks/useFeaturedArticles';
import HeroSkeleton from './HeroSkeleton';

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const slideIntervalRef = useRef<number | null>(null);
  
  // Fetch featured news articles using our custom hook
  const { data: articles, isLoading, error } = useFeaturedArticles(4);
  
  // Reset interval when current slide changes
  useEffect(() => {
    if (slideIntervalRef.current) {
      window.clearInterval(slideIntervalRef.current);
    }
    
    // Only setup interval if we have articles and not hovering
    if (articles && articles.length > 0 && !isHovering) {
      slideIntervalRef.current = window.setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % articles.length);
      }, 4000);
    }
    
    return () => {
      if (slideIntervalRef.current) {
        window.clearInterval(slideIntervalRef.current);
      }
    };
  }, [currentSlide, articles, isHovering]);
  
  const navigateSlide = (direction: 'prev' | 'next') => {
    if (!articles || articles.length === 0) return;
    
    if (direction === 'prev') {
      setCurrentSlide(prev => (prev === 0 ? articles.length - 1 : prev - 1));
    } else {
      setCurrentSlide(prev => (prev + 1) % articles.length);
    }
  };
  
  const selectSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  // Touch handling for swipe support
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    // Swipe threshold of 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        navigateSlide('next');
      } else {
        navigateSlide('prev');
      }
    }
    
    touchStartX.current = null;
  };
  
  // Render loading state
  if (isLoading) {
    return <HeroSkeleton />;
  }
  
  // Render error state
  if (error || !articles || articles.length === 0) {
    return (
      <div className="w-full h-[60vh] md:h-[60vh] sm:h-[40vh] relative bg-team-navy flex items-center justify-center">
        <div className="text-white text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Welcome to Banks o' Dee FC</h2>
          <p className="mb-6">The home of Banks o' Dee Football Club</p>
          <Button asChild>
            <Link to="/news">Latest News</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] relative overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {articles.map((article, index) => (
        <div 
          key={article.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${article.image_url || '/placeholder.svg'})`,
              transition: 'transform 6s ease-in-out',
              transform: currentSlide === index ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full md:w-2/3 text-white">
            <div className="animate-fade-in">
              <div className="mb-2">
                <span className="bg-team-blue text-white px-2 py-1 text-xs font-medium rounded">
                  {article.category}
                </span>
                <span className="ml-2 text-sm text-gray-300">{formatDate(article.publish_date)}</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 line-clamp-2">
                {article.title}
              </h2>
              
              <p className="text-sm md:text-base mb-4 line-clamp-2 text-gray-200">
                {article.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
              </p>
              
              <Button asChild size="sm" className="bg-team-blue hover:bg-team-navy">
                <Link to={`/news/${article.slug}`}>
                  Read More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation Arrows (visible on hover) */}
      <div className={cn(
        "absolute top-1/2 left-4 -translate-y-1/2 z-20 transition-opacity duration-300",
        isHovering ? "opacity-100" : "opacity-0 sm:opacity-50"
      )}>
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full bg-black/30 border-white/20 text-white hover:bg-black/50"
          onClick={() => navigateSlide('prev')}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className={cn(
        "absolute top-1/2 right-4 -translate-y-1/2 z-20 transition-opacity duration-300",
        isHovering ? "opacity-100" : "opacity-0 sm:opacity-50"
      )}>
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full bg-black/30 border-white/20 text-white hover:bg-black/50"
          onClick={() => navigateSlide('next')}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {articles.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentSlide === index 
                ? "bg-white w-6" 
                : "bg-white/50 hover:bg-white/80"
            )}
            onClick={() => selectSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;

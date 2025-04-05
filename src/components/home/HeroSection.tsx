
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui';
import { formatDate } from '@/services/news/utils';
import { Link } from 'react-router-dom';
import { useFeaturedArticles } from '@/hooks/useFeaturedArticles';
import HeroSkeleton from './HeroSkeleton';

const { H1, Body } = Typography;

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const slideIntervalRef = useRef<number | null>(null);
  
  const { data: articles, isLoading, error } = useFeaturedArticles(4);
  
  useEffect(() => {
    if (slideIntervalRef.current) {
      window.clearInterval(slideIntervalRef.current);
    }
    
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
  
  const selectSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentSlide(prev => (prev + 1) % (articles?.length || 1));
      } else {
        setCurrentSlide(prev => prev === 0 ? (articles?.length || 1) - 1 : prev - 1);
      }
    }
    
    touchStartX.current = null;
  };
  
  const getLocalImageFallback = (index: number) => {
    const heroImages = [
      '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png',
      '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
      '/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png',
      '/lovable-uploads/ba4e2b09-12ed-48ad-a4ba-1162ab87ad70.png',
      '/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png',
      '/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png',
      '/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png',
      '/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png',
      '/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png',
      '/lovable-uploads/b937e144-e94f-4e75-881f-1e560c6b520a.png',
      '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png'
    ];
    return heroImages[index % heroImages.length];
  };
  
  if (isLoading) {
    return <HeroSkeleton />;
  }
  
  if (error || !articles || articles.length === 0) {
    return (
      <div className="w-full h-[60vh] md:h-[60vh] sm:h-[40vh] relative bg-primary-800 flex items-center justify-center">
        <div className="text-white text-center p-8">
          <H1 className="mb-4 text-white">Welcome to Banks o' Dee FC</H1>
          <Body className="mb-6 text-white">The home of Banks o' Dee Football Club</Body>
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
      {articles.map((article, index) => {
        const imageUrl = article.image_url || getLocalImageFallback(index);
        
        return (
          <div 
            key={article.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <div className="absolute inset-0">
              <img
                src={imageUrl}
                alt={article.title}
                className="w-full h-full object-cover object-center"
                style={{ 
                  transition: 'transform 6s ease-in-out',
                  transform: currentSlide === index ? 'scale(1.05)' : 'scale(1)'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = getLocalImageFallback(index);
                }}
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full md:w-2/3 text-white">
              <div className="animate-fade-in">
                <span className="inline-block px-3 py-1 mb-4 bg-secondary-300 text-primary-800 text-xs font-semibold rounded">
                  {article.category || 'News'}
                </span>
                
                <H1 className="mb-2 text-white line-clamp-2">
                  {article.title}
                </H1>
                
                <Body className="mb-4 line-clamp-2 text-gray-200">
                  {article.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                </Body>
                
                <div className="flex items-center gap-4">
                  <Button asChild size="sm">
                    <Link to={`/news/${article.slug}`}>
                      Read More
                    </Link>
                  </Button>
                  <span className="text-white/70 text-sm">
                    {formatDate(article.publish_date)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => selectSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentSlide === index 
                ? "bg-white w-6" 
                : "bg-white/40 scale-75 hover:bg-white/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;

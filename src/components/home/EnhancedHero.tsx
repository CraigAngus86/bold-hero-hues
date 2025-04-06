
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar, Ticket, Bell } from 'lucide-react';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { formatDate } from '@/utils/date';
import { useIsMobile } from '@/hooks/use-mobile';

const EnhancedHero: React.FC = () => {
  const { slides, isLoading, error, nextMatch, latestResult, breakingNews } = useHeroSlides();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  // Countdown timer for next match
  const [countdown, setCountdown] = useState<{days: number, hours: number, minutes: number} | null>(null);
  
  // Calculate countdown for next match
  useEffect(() => {
    if (!nextMatch) return;
    
    const calculateTimeRemaining = () => {
      const matchDate = new Date(`${nextMatch.date}T${nextMatch.time}`);
      const now = new Date();
      const difference = matchDate.getTime() - now.getTime();
      
      if (difference <= 0) return null;
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      return { days, hours, minutes };
    };
    
    setCountdown(calculateTimeRemaining());
    
    const countdownInterval = setInterval(() => {
      setCountdown(calculateTimeRemaining());
    }, 60000); // Update every minute
    
    return () => clearInterval(countdownInterval);
  }, [nextMatch]);
  
  // Handle hero slide autoplay
  useEffect(() => {
    if (!autoplay || slides.length === 0) return;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [slides.length, autoplay, currentIndex]);
  
  const handleNext = () => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };
  
  const handlePrev = () => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };
  
  const goToSlide = (index: number) => {
    setAutoplay(false);
    setCurrentIndex(index);
  };
  
  if (isLoading) {
    return (
      <div className="w-full h-[80vh] bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading hero content...</div>
      </div>
    );
  }
  
  if (error || slides.length === 0) {
    return (
      <div className="w-full h-[80vh] bg-team-blue flex items-center justify-center">
        <div className="text-white text-center px-4">
          <h2 className="text-2xl font-bold mb-4">Welcome to Banks o' Dee FC</h2>
          <p>Home of Spain Park, Aberdeen</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative h-[80vh] w-full overflow-hidden bg-black">
      {/* Breaking News Banner */}
      {breakingNews && breakingNews.active && (
        <div className="absolute top-0 left-0 right-0 z-30 bg-red-600 text-white px-4 py-2 flex items-center justify-center">
          <Bell className="w-4 h-4 mr-2 animate-pulse" />
          <p className="text-sm md:text-base font-medium">{breakingNews.message}</p>
        </div>
      )}
      
      {/* Hero Slider */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-full h-full">
            {slides[currentIndex].video_url ? (
              <video 
                autoPlay 
                muted 
                loop 
                className="w-full h-full object-cover"
                style={{ transform: "scale(1.03)", transition: "transform 8s ease-out" }}
              >
                <source src={slides[currentIndex].video_url} type="video/mp4" />
              </video>
            ) : (
              <div className="h-full w-full overflow-hidden">
                <img 
                  src={slides[currentIndex].image_url} 
                  alt={slides[currentIndex].title}
                  className="w-full h-full object-cover transform scale-105"
                  style={{ 
                    transform: "scale(1.03)", 
                    transition: "transform 8s ease-out",
                    willChange: "transform"
                  }}
                />
              </div>
            )}
            
            {/* Enhanced Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          </div>
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container px-4 py-12 text-white">
              <motion.div
                className="max-w-4xl mx-auto md:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {slides[currentIndex].title && (
                  <motion.h1 
                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {slides[currentIndex].title}
                  </motion.h1>
                )}
                
                {slides[currentIndex].subtitle && (
                  <motion.p 
                    className="text-xl md:text-2xl mb-8 max-w-3xl drop-shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {slides[currentIndex].subtitle}
                  </motion.p>
                )}
                
                {slides[currentIndex].link_url && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <Link to={slides[currentIndex].link_url}>
                      <Button size="lg" className="bg-team-accent text-team-blue hover:bg-team-accent/90 font-bold">
                        {slides[currentIndex].link_text || 'Learn More'}
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Next Match Card with Countdown */}
      {nextMatch && !isMobile && (
        <div className="absolute top-16 right-8 z-20">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-md shadow-lg max-w-[320px]">
            <div className="text-center mb-2">
              <Badge variant="outline" className="bg-team-blue text-white border-none uppercase text-xs font-medium px-3 py-1">
                Next Match
              </Badge>
            </div>
            
            {countdown && (
              <div className="flex justify-center gap-2 mb-3">
                <div className="text-center bg-team-blue text-white rounded px-2 py-1">
                  <span className="block text-lg font-bold">{countdown.days}</span>
                  <span className="text-xs">days</span>
                </div>
                <div className="text-center bg-team-blue text-white rounded px-2 py-1">
                  <span className="block text-lg font-bold">{countdown.hours}</span>
                  <span className="text-xs">hrs</span>
                </div>
                <div className="text-center bg-team-blue text-white rounded px-2 py-1">
                  <span className="block text-lg font-bold">{countdown.minutes}</span>
                  <span className="text-xs">min</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-2">
              <div className="text-right mr-3 font-medium">
                <div className="text-team-blue">{nextMatch.home_team}</div>
                <div className="h-4">
                  {nextMatch.home_team === 'Banks o\' Dee' && (
                    <span className="text-[10px] text-gray-500">HOME</span>
                  )}
                </div>
              </div>
              <div className="text-center text-xs bg-gray-100 rounded p-2">
                <span className="block text-lg font-bold">VS</span>
              </div>
              <div className="text-left ml-3 font-medium">
                <div className="text-team-blue">{nextMatch.away_team}</div>
                <div className="h-4">
                  {nextMatch.away_team === 'Banks o\' Dee' && (
                    <span className="text-[10px] text-gray-500">AWAY</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-1 text-sm mt-3">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                <span>{formatDate(nextMatch.date)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                <span>{nextMatch.time}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                <span>{nextMatch.venue}</span>
              </div>
            </div>
            
            {nextMatch.ticket_link && (
              <div className="mt-4">
                <a 
                  href={nextMatch.ticket_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-team-accent hover:bg-team-accent/90 text-team-blue text-center text-xs font-medium rounded py-2 transition-colors flex items-center justify-center"
                >
                  <Ticket className="w-3.5 h-3.5 mr-1.5" />
                  Buy Match Tickets
                </a>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Latest Result Card */}
      {latestResult && !isMobile && (
        <div className="absolute bottom-16 left-8 z-20">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-md shadow-lg max-w-[320px]">
            <div className="text-center mb-3">
              <Badge variant="outline" className="bg-gray-800 text-white border-none uppercase text-xs font-medium">
                Latest Result
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-center flex-1 px-2">
                <div className="text-team-blue font-bold truncate">{latestResult.home_team}</div>
                <div className="h-4">
                  {latestResult.home_team === 'Banks o\' Dee' && (
                    <span className="text-[10px] text-gray-500">HOME</span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center items-center p-2 mx-2 bg-team-blue bg-opacity-10 rounded">
                <span className="font-bold text-2xl">
                  {latestResult.home_score} - {latestResult.away_score}
                </span>
              </div>
              
              <div className="text-center flex-1 px-2">
                <div className="text-team-blue font-bold truncate">{latestResult.away_team}</div>
                <div className="h-4">
                  {latestResult.away_team === 'Banks o\' Dee' && (
                    <span className="text-[10px] text-gray-500">AWAY</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-3 text-sm text-gray-600 text-center">
              {latestResult.competition} - {formatDate(latestResult.date)}
            </div>
            
            <div className="mt-3">
              <Link
                to={`/fixtures/${latestResult.id}`}
                className="block w-full bg-gray-800 hover:bg-gray-700 text-white text-center text-xs font-medium rounded py-2 transition-colors"
              >
                Match Details
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300 transform",
              currentIndex === index 
                ? "bg-white scale-100 w-6" 
                : "bg-white/50 hover:bg-white/80 scale-75 hover:scale-90"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/50 transition-colors z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/50 transition-colors z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default EnhancedHero;

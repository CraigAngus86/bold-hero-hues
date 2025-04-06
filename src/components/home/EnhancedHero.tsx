
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar, Ticket } from 'lucide-react';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { formatDate } from '@/utils/date';

const EnhancedHero: React.FC = () => {
  const { slides, isLoading, error, nextMatch, latestResult } = useHeroSlides();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  // Handle hero slide autoplay
  useEffect(() => {
    if (!autoplay || slides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length, autoplay]);
  
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
      <div className="w-full h-[500px] bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading hero content...</div>
      </div>
    );
  }
  
  if (error || slides.length === 0) {
    return (
      <div className="w-full h-[400px] bg-team-blue flex items-center justify-center">
        <div className="text-white text-center px-4">
          <h2 className="text-2xl font-bold mb-4">Welcome to Banks o' Dee FC</h2>
          <p>Home of the Spain Park, Aberdeen</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative h-[600px] md:h-[650px] w-full overflow-hidden bg-black">
      {/* Hero Slider */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {slides[currentIndex].video_url ? (
            <video 
              autoPlay 
              muted 
              loop 
              className="w-full h-full object-cover"
            >
              <source src={slides[currentIndex].video_url} type="video/mp4" />
            </video>
          ) : (
            <img 
              src={slides[currentIndex].image_url} 
              alt={slides[currentIndex].title}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container px-4 py-12 text-white text-center">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {slides[currentIndex].title}
              </motion.h1>
              
              {slides[currentIndex].subtitle && (
                <motion.p 
                  className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
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
                    <Button variant="outline" className="bg-white text-team-blue hover:bg-gray-100">
                      {slides[currentIndex].link_text || 'Learn More'}
                    </Button>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Next Match Card */}
      {nextMatch && (
        <div className="absolute top-16 right-8 hidden md:block">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-md shadow-lg max-w-[300px]">
            <div className="text-center mb-2">
              <Badge variant="outline" className="bg-team-blue text-white border-none uppercase text-xs font-medium">
                Next Match
              </Badge>
            </div>
            <div className="flex items-center justify-center mb-2">
              <div className="text-right mr-3 font-medium text-sm">
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
              <div className="text-left ml-3 font-medium text-sm">
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
              <div className="mt-3">
                <a 
                  href={nextMatch.ticket_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-team-blue hover:bg-team-blue/90 text-white text-center text-xs font-medium rounded-sm py-1.5 transition-colors"
                >
                  <Ticket className="w-3.5 h-3.5 mr-1.5 inline-block" />
                  Buy Tickets
                </a>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Latest Result Card */}
      {latestResult && (
        <div className="absolute bottom-16 left-8 hidden md:block">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-md shadow-lg max-w-[300px]">
            <div className="text-center mb-2">
              <Badge variant="outline" className="bg-gray-800 text-white border-none uppercase text-xs font-medium">
                Latest Result
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="text-team-blue font-bold">{latestResult.home_team}</div>
                <div className="h-4">
                  {latestResult.home_team === 'Banks o\' Dee' && (
                    <span className="text-[10px] text-gray-500">HOME</span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center items-center p-2 mx-2">
                <span className="font-bold text-lg">
                  {latestResult.home_score} - {latestResult.away_score}
                </span>
              </div>
              
              <div className="text-center flex-1">
                <div className="text-team-blue font-bold">{latestResult.away_team}</div>
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
                className="block w-full bg-gray-800 hover:bg-gray-700 text-white text-center text-xs font-medium rounded-sm py-1.5 transition-colors"
              >
                Match Details
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              currentIndex === index ? "bg-white" : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default EnhancedHero;

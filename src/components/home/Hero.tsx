
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/date';

interface HeroSlide {
  id: string;
  imageUrl: string;
  videoUrl?: string;
  title: string;
  subtitle?: string;
  linkText?: string;
  linkUrl?: string;
}

const Hero: React.FC = () => {
  // Mock data with updated image paths
  const slides: HeroSlide[] = [
    {
      id: '1',
      imageUrl: '/lovable-uploads/banks-o-dee-dark-logo.png',
      title: 'Welcome to Banks o\' Dee FC',
      subtitle: 'Home of Spain Park, Aberdeen',
      linkText: 'Learn More',
      linkUrl: '/about',
    },
    {
      id: '2',
      imageUrl: '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
      title: 'Join us at Spain Park',
      subtitle: 'Support the team in our upcoming fixtures',
      linkText: 'View Fixtures',
      linkUrl: '/fixtures',
    },
    {
      id: '3',
      imageUrl: '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png',
      title: 'Latest Club News',
      subtitle: 'Stay up to date with all things Banks o\' Dee',
      linkText: 'Read More',
      linkUrl: '/news',
    }
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Mock data for next match
  const nextMatch = {
    id: 'next-1',
    homeTeam: 'Banks o\' Dee',
    awayTeam: 'Formartine United',
    date: '2025-05-15',
    time: '15:00',
    venue: 'Spain Park',
    competition: 'Highland League',
    ticketLink: '/tickets/next-match'
  };
  
  // Mock data for latest result
  const latestResult = {
    id: 'result-1',
    homeTeam: 'Banks o\' Dee',
    awayTeam: 'Keith FC',
    homeScore: 3,
    awayScore: 1,
    date: '2025-05-01',
    competition: 'Highland League'
  };
  
  // Mock breaking news
  const breakingNews = {
    active: true,
    message: 'New signing announcement: John Smith joins from Aberdeen FC!'
  };
  
  // Calculate countdown for next match
  const [countdown, setCountdown] = useState<{days: number, hours: number, minutes: number} | null>(null);
  
  useEffect(() => {
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
  }, []);
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
    resetAutoplay();
  };
  
  const goToPrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
    resetAutoplay();
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    resetAutoplay();
  };
  
  const resetAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      if (isAutoplay) {
        autoplayRef.current = setInterval(goToNext, 5000);
      }
    }
  };
  
  useEffect(() => {
    if (isAutoplay) {
      autoplayRef.current = setInterval(goToNext, 5000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isAutoplay]);
  
  const handleMouseEnter = () => setIsAutoplay(false);
  const handleMouseLeave = () => setIsAutoplay(true);
  
  return (
    <section 
      className="relative w-full h-[70vh] md:h-[70vh] sm:h-[50vh] overflow-hidden" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Breaking News Banner */}
      {breakingNews.active && (
        <div className="absolute top-0 left-0 right-0 z-30 bg-team-gold text-team-blue px-4 py-3 flex justify-center items-center">
          <p className="font-medium">{breakingNews.message}</p>
          <button className="ml-3 underline text-sm hover:text-team-blue/70">Read More</button>
        </div>
      )}
      
      {/* Hero Slides */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slides[currentIndex].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          
          {slides[currentIndex].videoUrl ? (
            <video 
              src={slides[currentIndex].videoUrl} 
              autoPlay 
              muted 
              loop 
              className="object-cover w-full h-full"
            />
          ) : (
            <img 
              src={slides[currentIndex].imageUrl} 
              alt={slides[currentIndex].title}
              className="object-cover w-full h-full"
            />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-end pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[currentIndex].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {slides[currentIndex].title}
            </h1>
            {slides[currentIndex].subtitle && (
              <p className="text-xl text-white/90 mb-6">
                {slides[currentIndex].subtitle}
              </p>
            )}
            {slides[currentIndex].linkText && slides[currentIndex].linkUrl && (
              <a 
                href={slides[currentIndex].linkUrl} 
                className="inline-block bg-team-gold text-team-blue font-semibold px-6 py-3 rounded hover:bg-opacity-90 transition-colors"
              >
                {slides[currentIndex].linkText}
              </a>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "bg-white scale-100" 
                  : "bg-white/40 scale-75 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Next Match Card */}
      <div className="absolute bottom-10 right-10 z-20 bg-white/80 p-4 rounded-lg shadow-lg max-w-xs backdrop-blur-sm hidden md:block">
        <h3 className="text-sm font-bold text-team-blue mb-2">NEXT MATCH</h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">{nextMatch.homeTeam}</span>
          <span className="text-xs bg-gray-200 px-2 py-1 rounded">VS</span>
          <span className="text-sm font-medium">{nextMatch.awayTeam}</span>
        </div>
        
        {countdown && (
          <div className="flex justify-center gap-2 mb-3">
            <div className="text-center bg-team-blue/10 rounded px-2 py-1">
              <span className="block text-sm font-bold">{countdown.days}</span>
              <span className="text-xs uppercase">days</span>
            </div>
            <div className="text-center bg-team-blue/10 rounded px-2 py-1">
              <span className="block text-sm font-bold">{countdown.hours}</span>
              <span className="text-xs uppercase">hrs</span>
            </div>
            <div className="text-center bg-team-blue/10 rounded px-2 py-1">
              <span className="block text-sm font-bold">{countdown.minutes}</span>
              <span className="text-xs uppercase">min</span>
            </div>
          </div>
        )}
        
        <div className="space-y-1 text-xs mb-3">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1 text-team-blue" />
            <span>{formatDate(nextMatch.date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1 text-team-blue" />
            <span>{nextMatch.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1 text-team-blue" />
            <span>{nextMatch.venue}</span>
          </div>
        </div>
        
        <a 
          href={nextMatch.ticketLink} 
          className="block text-center bg-team-gold text-team-blue font-medium text-sm py-2 rounded hover:bg-opacity-90 transition-colors"
        >
          <Ticket className="w-4 h-4 inline-block mr-1" />
          Buy Tickets
        </a>
      </div>
      
      {/* Latest Result Card */}
      <div className="absolute bottom-10 left-10 z-20 bg-white/80 p-4 rounded-lg shadow-lg max-w-xs backdrop-blur-sm hidden md:block">
        <h3 className="text-sm font-bold text-team-blue mb-2">LATEST RESULT</h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">{latestResult.homeTeam}</span>
          <span className="text-md font-bold bg-gray-100 px-3 py-1 rounded">
            {latestResult.homeScore} - {latestResult.awayScore}
          </span>
          <span className="text-sm font-medium">{latestResult.awayTeam}</span>
        </div>
        
        <div className="text-xs text-center mb-3">
          {latestResult.competition} • {formatDate(latestResult.date)}
        </div>
        
        <a 
          href={`/match-report/${latestResult.id}`} 
          className="block text-center bg-gray-800 text-white font-medium text-sm py-2 rounded hover:bg-opacity-90 transition-colors"
        >
          Match Report
        </a>
      </div>
      
      {/* Arrow Navigation */}
      <button
        onClick={goToPrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors hidden md:block z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors hidden md:block z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
};

export default Hero;

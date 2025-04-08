
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

// Types for our slider
interface HeroSlide {
  id: string;
  imageUrl: string;
  videoUrl?: string;
  title: string;
  subtitle?: string;
  linkText?: string;
  linkUrl?: string;
}

// Types for next match
interface NextMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  ticketLink?: string;
}

// Types for latest result
interface LatestResult {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  competition: string;
}

interface BreakingNews {
  active: boolean;
  message: string;
  link?: string;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const EnhancedHero: React.FC = () => {
  // Mock data with updated image paths
  const slides: HeroSlide[] = [
    {
      id: '1',
      imageUrl: '/public/banks-o-dee-dark-logo.png',
      title: 'Welcome to Banks o\' Dee FC',
      subtitle: 'Home of Spain Park, Aberdeen',
      linkText: 'Learn More',
      linkUrl: '/about',
    },
    {
      id: '2',
      imageUrl: '/public/Spain_Park_Slider_1920x1080.jpg',
      title: 'Join us at Spain Park',
      subtitle: 'Support the team in our upcoming fixtures',
      linkText: 'View Fixtures',
      linkUrl: '/fixtures',
    },
    {
      id: '3',
      imageUrl: '/public/Keith_Slider_1920x1080.jpg',
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
  const nextMatch: NextMatch = {
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
  const latestResult: LatestResult = {
    id: 'result-1',
    homeTeam: 'Banks o\' Dee',
    awayTeam: 'Keith FC',
    homeScore: 3,
    awayScore: 1,
    date: '2025-05-01',
    competition: 'Highland League'
  };
  
  // Mock breaking news
  const breakingNews: BreakingNews = {
    active: true,
    message: 'New signing announcement: John Smith joins from Aberdeen FC!',
    link: '/news/new-signing'
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
  }, [nextMatch.date, nextMatch.time]);
  
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
  
  // Check if we're on a mobile device
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  return (
    <section 
      className="relative w-full h-[80vh] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Breaking News Banner */}
      {breakingNews.active && (
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 left-0 right-0 z-30 bg-accent-500 text-team-blue px-4 py-2 flex items-center justify-center"
        >
          <span className="mr-3 font-bold">BREAKING:</span>
          <p className="font-medium">{breakingNews.message}</p>
          {breakingNews.link && (
            <a href={breakingNews.link} className="ml-3 text-sm font-semibold underline hover:text-team-blue/80">
              Read More
            </a>
          )}
        </motion.div>
      )}
      
      {/* Diagonal Pattern Background */}
      <div className="absolute inset-0 w-full h-full bg-pattern-diagonal opacity-20 z-10"></div>
      
      {/* Hero Slides */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={slides[currentIndex].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 z-10"></div>
          
          {slides[currentIndex].videoUrl ? (
            <video 
              src={slides[currentIndex].videoUrl} 
              autoPlay 
              muted 
              loop 
              className="object-cover w-full h-full"
            />
          ) : (
            <motion.div 
              className="h-full w-full overflow-hidden"
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              transition={{ duration: 8, ease: "easeOut" }}
            >
              <img 
                src={slides[currentIndex].imageUrl} 
                alt={slides[currentIndex].title}
                className="w-full h-full object-cover scale-105"
              />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[currentIndex].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.5,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
            className="max-w-3xl"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-block px-3 py-1 mb-4 bg-accent-500 text-team-blue text-sm font-bold rounded-md"
            >
              OFFICIAL CLUB WEBSITE
            </motion.span>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {slides[currentIndex].title}
            </motion.h1>
            
            {slides[currentIndex].subtitle && (
              <motion.p 
                className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {slides[currentIndex].subtitle}
              </motion.p>
            )}
            
            {slides[currentIndex].linkText && slides[currentIndex].linkUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Button
                  asChild
                  className="bg-accent-500 hover:bg-accent-600 text-team-blue font-semibold text-lg px-8 py-6 rounded-md shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 btn-hover-effect"
                  size="lg"
                >
                  <Link to={slides[currentIndex].linkUrl}>
                    {slides[currentIndex].linkText}
                  </Link>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "bg-accent-500 scale-110" 
                  : "bg-white/40 scale-75 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Next Match Card */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute bottom-16 right-12 z-20 max-w-xs"
        >
          <div className="bg-white/95 backdrop-blur-lg p-5 rounded-lg shadow-card">
            <div className="text-center mb-3">
              <Badge variant="outline" className="bg-team-blue text-white border-none font-semibold">
                NEXT MATCH
              </Badge>
            </div>
            
            {countdown && (
              <div className="flex justify-center gap-2 mb-4">
                <div className="countdown-digit">
                  <span>{countdown.days}</span>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-digit">
                  <span>{countdown.hours}</span>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-digit">
                  <span>{countdown.minutes}</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">{nextMatch.homeTeam}</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">VS</span>
              <span className="text-sm font-semibold">{nextMatch.awayTeam}</span>
            </div>
            
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
              className="block text-center bg-team-blue text-white font-medium text-sm py-2 rounded hover:bg-opacity-90 transition-colors btn-hover-effect"
            >
              <Ticket className="w-4 h-4 inline-block mr-1" />
              Buy Tickets
            </a>
          </div>
        </motion.div>
      )}
      
      {/* Latest Result Card */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="absolute bottom-16 left-12 z-20 max-w-xs"
        >
          <div className="bg-white/95 backdrop-blur-lg p-5 rounded-lg shadow-card">
            <div className="text-center mb-3">
              <Badge variant="outline" className="bg-gray-800 text-white border-none font-semibold">
                LATEST RESULT
              </Badge>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">{latestResult.homeTeam}</span>
              <span className="text-lg font-bold bg-gray-100 px-3 py-1 rounded">
                {latestResult.homeScore} - {latestResult.awayScore}
              </span>
              <span className="text-sm font-medium">{latestResult.awayTeam}</span>
            </div>
            
            <div className="text-xs text-center mb-3">
              {latestResult.competition} • {formatDate(latestResult.date)}
            </div>
            
            <a 
              href={`/match-report/${latestResult.id}`} 
              className="block text-center bg-gray-800 text-white font-medium text-sm py-2 rounded hover:bg-opacity-90 transition-colors btn-hover-effect"
            >
              Match Report
            </a>
          </div>
        </motion.div>
      )}
      
      {/* Arrow Navigation */}
      <button
        onClick={goToPrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/50 transition-colors z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/50 transition-colors z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
};

export default EnhancedHero;

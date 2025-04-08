
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNewsStore, formatDate } from '@/services/news';
import { NewsItem } from '@/types/news';
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar, Ticket } from 'lucide-react';

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  
  const { news } = useNewsStore();
  const heroNews = [...news]
    .sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())
    .slice(0, 3)
    .map((item, index) => {
      const images = [
        '/public/banks-o-dee-dark-logo.png',
        '/public/Keith_Slider_1920x1080.jpg',
        '/public/Spain_Park_Slider_1920x1080.jpg'
      ];
      return {
        ...item,
        image_url: images[index] || item.image_url || item.image
      };
    });
  
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
      prevIndex === heroNews.length - 1 ? 0 : prevIndex + 1
    );
    resetAutoplay();
  };
  
  const goToPrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? heroNews.length - 1 : prevIndex - 1
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
        autoplayRef.current = setInterval(goToNext, 6000);
      }
    }
  };
  
  useEffect(() => {
    if (isAutoplay) {
      autoplayRef.current = setInterval(goToNext, 6000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isAutoplay]);
  
  const handleMouseEnter = () => setIsAutoplay(false);
  const handleMouseLeave = () => setIsAutoplay(true);
  
  if (heroNews.length === 0) {
    return null;
  }
  
  return (
    <div className="hero-section-wrapper relative">
      {/* Hero Section */}
      <section 
        className="relative w-full h-[85vh] overflow-hidden bg-[#00105a]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Breaking News Banner with Animation */}
        {breakingNews.active && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-0 left-0 right-0 z-30 bg-team-accent/95 text-team-blue px-4 py-2.5 flex items-center justify-center"
          >
            <div className="flex items-center overflow-hidden max-w-5xl mx-auto w-full">
              <span className="font-bold text-sm mr-3 whitespace-nowrap">BREAKING NEWS</span>
              <motion.span 
                className="font-medium truncate"
                animate={{ 
                  x: [0, -5, 0, -5, 0], 
                  scale: [1, 1.02, 1, 1.02, 1] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 4,
                  ease: "easeInOut"
                }}
              >
                {breakingNews.message}
              </motion.span>
              {breakingNews.link && (
                <a href={breakingNews.link} className="ml-3 text-sm font-bold underline underline-offset-2 hover:text-team-blue/80 whitespace-nowrap">
                  Read More
                </a>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Diagonal Pattern Background */}
        <div className="absolute inset-0 bg-[url('/public/diagonal-pattern.svg')] bg-repeat opacity-10 z-10"></div>
        
        {/* Vignette Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00105a]/30 to-[#00105a]/90 z-10"></div>
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] z-10"></div>
        
        {/* Hero Slides */}
        <AnimatePresence initial={false}>
          <motion.div
            key={heroNews[currentIndex]?.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#00105a]/90 to-[#00105a]/30 z-10" />
            <motion.img 
              src={heroNews[currentIndex]?.image_url || '/public/banks-o-dee-dark-logo.png'} 
              alt={heroNews[currentIndex]?.title || 'Banks o\' Dee FC'}
              className="object-cover w-full h-full"
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              transition={{ duration: 8, ease: "easeOut" }}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-end pb-32 md:pb-40">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroNews[currentIndex]?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="max-w-4xl"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-block px-3 py-1 mb-4 bg-team-accent text-team-blue text-xs font-semibold rounded"
              >
                {heroNews[currentIndex]?.category}
              </motion.span>
              
              <motion.h2 
                className="text-3xl md:text-5xl lg:text-[clamp(3rem,8vw,5rem)] font-extrabold text-white mb-4 leading-tight drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{ 
                  textShadow: "0 4px 15px rgba(0,0,0,0.35)" 
                }}
              >
                {heroNews[currentIndex]?.title}
              </motion.h2>
              
              <motion.p 
                className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl backdrop-blur-[2px] bg-team-blue/10 p-2 rounded-sm border-l-4 border-team-accent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {heroNews[currentIndex]?.excerpt}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <a 
                  href={`/news/${heroNews[currentIndex]?.id}`} 
                  className="inline-block bg-white text-team-blue font-semibold px-6 py-3 rounded hover:bg-gray-100 transition-all transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Read More
                </a>
                <span className="text-white/70 text-sm ml-6">
                  {formatDate(heroNews[currentIndex]?.publish_date || heroNews[currentIndex]?.date || '')}
                </span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-30">
            {heroNews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index === currentIndex 
                    ? "bg-team-accent scale-110" 
                    : "bg-white/40 scale-75 hover:bg-white/60"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Arrow Navigation */}
        <button
          onClick={goToPrev}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors hidden md:flex items-center justify-center z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors hidden md:flex items-center justify-center z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      {/* Overlapping Match Cards Container */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-28 md:-mt-32 lg:-mt-36 z-30 flex flex-col md:flex-row justify-between gap-6">
          {/* Latest Result Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full md:w-[calc(50%-1rem)] bg-white rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3">
              <h3 className="text-white font-bold text-center">LATEST RESULT</h3>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mb-2 flex items-center justify-center">
                      <img 
                        src="/public/banks-o-dee-dark-logo.png" 
                        alt="Banks o' Dee" 
                        className="w-12 h-12 object-contain" 
                      />
                    </div>
                    <span className="font-bold text-team-blue">
                      {latestResult.homeTeam}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center mx-4">
                  <div className="relative">
                    {/* Score display with accent for winning team */}
                    <div className="flex items-center">
                      <div className={`text-2xl font-black p-2 ${latestResult.homeScore > latestResult.awayScore ? 'text-team-blue' : 'text-gray-600'}`}>
                        {latestResult.homeScore}
                      </div>
                      <div className="mx-1 text-gray-400">-</div>
                      <div className={`text-2xl font-black p-2 ${latestResult.awayScore > latestResult.homeScore ? 'text-team-blue' : 'text-gray-600'}`}>
                        {latestResult.awayScore}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-500 text-center">FULL TIME</div>
                  </div>
                  
                  {/* Competition Badge */}
                  <div className="mt-2 py-1 px-2 bg-gray-100 rounded-full">
                    <span className="text-xs font-medium">{latestResult.competition}</span>
                  </div>
                </div>
                
                <div className="text-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mb-2 flex items-center justify-center">
                      <span className="font-bold text-lg">KFC</span>
                    </div>
                    <span className="font-bold text-gray-700">
                      {latestResult.awayTeam}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 text-center">
                <span className="text-sm text-gray-500">
                  {formatDate(latestResult.date)}
                </span>
              </div>
              
              <a 
                href={`/match-report/${latestResult.id}`} 
                className="block w-full mt-4 text-center bg-gray-800 text-white font-medium py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Match Report
              </a>
              
              {/* Diagonal Accent */}
              <div className="absolute top-0 right-0 w-24 h-24">
                <div className="absolute transform rotate-45 bg-team-accent/20 w-24 h-6 -right-12 top-6"></div>
              </div>
            </div>
          </motion.div>
          
          {/* Next Match Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full md:w-[calc(50%-1rem)] bg-white rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-team-blue to-team-blue/90 px-4 py-3">
              <h3 className="text-white font-bold text-center">NEXT MATCH</h3>
            </div>
            
            <div className="p-4">
              {/* Match Details */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mb-2 flex items-center justify-center">
                      <img 
                        src="/public/banks-o-dee-dark-logo.png" 
                        alt="Banks o' Dee" 
                        className="w-12 h-12 object-contain" 
                      />
                    </div>
                    <span className="font-bold text-team-blue">
                      {nextMatch.homeTeam}
                    </span>
                    <span className="text-xs bg-team-blue/10 text-team-blue px-2 py-0.5 mt-1 rounded">
                      HOME
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center mx-4">
                  <div className="bg-gray-100 px-3 py-1.5 rounded-full mb-2">
                    <span className="text-sm font-semibold text-gray-600">VS</span>
                  </div>
                  
                  {/* Competition Badge */}
                  <div className="py-1 px-2 bg-team-blue/10 rounded-full">
                    <span className="text-xs font-medium text-team-blue">{nextMatch.competition}</span>
                  </div>
                </div>
                
                <div className="text-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mb-2 flex items-center justify-center">
                      <span className="font-bold text-lg">FU</span>
                    </div>
                    <span className="font-bold text-gray-700">
                      {nextMatch.awayTeam}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Countdown */}
              {countdown && (
                <div className="flex justify-center gap-2 mb-4">
                  <div className="bg-team-blue/10 text-team-blue text-center px-2 py-1 rounded-md w-16">
                    <span className="block text-lg font-bold">{countdown.days}</span>
                    <span className="text-xs uppercase">days</span>
                  </div>
                  <div className="bg-team-blue/10 text-team-blue text-center px-2 py-1 rounded-md w-16">
                    <span className="block text-lg font-bold">{countdown.hours}</span>
                    <span className="text-xs uppercase">hrs</span>
                  </div>
                  <div className="bg-team-blue/10 text-team-blue text-center px-2 py-1 rounded-md w-16">
                    <span className="block text-lg font-bold">{countdown.minutes}</span>
                    <span className="text-xs uppercase">min</span>
                  </div>
                </div>
              )}
              
              {/* Match Info */}
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{formatDate(nextMatch.date)}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{nextMatch.time}</span>
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{nextMatch.venue}</span>
                </div>
              </div>
              
              <a 
                href={nextMatch.ticketLink} 
                className="block w-full text-center bg-team-blue text-white font-medium py-2 rounded hover:bg-opacity-90 transition-colors"
              >
                <Ticket className="w-4 h-4 inline-block mr-1" />
                Buy Tickets
              </a>
              
              {/* Diagonal Accent */}
              <div className="absolute top-0 right-0 w-24 h-24">
                <div className="absolute transform rotate-45 bg-team-accent w-24 h-6 -right-12 top-6"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Spacer for content below */}
      <div className="h-24 md:h-28 lg:h-32"></div>
    </div>
  );
};

export default Hero;


import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Ticket, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { formatMatchDate, isBanksODee } from '@/components/home/fixtures/utils';

const EnhancedHero: React.FC = () => {
  const {
    slides,
    currentIndex,
    currentSlide,
    isLoading,
    goToSlide,
    goToNextSlide,
    goToPrevSlide,
    nextMatch,
    recentResults
  } = useHeroSlides();
  
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle autoplay
  useEffect(() => {
    if (isAutoplay && slides.length > 1) {
      autoplayRef.current = setInterval(goToNextSlide, 6000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isAutoplay, slides.length, goToNextSlide]);
  
  const resetAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      if (isAutoplay && slides.length > 1) {
        autoplayRef.current = setInterval(goToNextSlide, 6000);
      }
    }
  };
  
  const handleManualNavigation = (fn: Function) => {
    fn();
    resetAutoplay();
  };
  
  const handleMouseEnter = () => setIsAutoplay(false);
  const handleMouseLeave = () => setIsAutoplay(true);
  
  if (isLoading) {
    return <HeroSkeleton />;
  }
  
  if (slides.length === 0) {
    return null;
  }
  
  return (
    <section 
      className="relative w-full h-[90vh] overflow-hidden bg-[#00105a]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentSlide?.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#00105a]/90 to-[#00105a]/30 z-10" />
          
          {currentSlide?.video_url ? (
            <video 
              src={currentSlide.video_url} 
              autoPlay 
              muted 
              loop 
              className="object-cover w-full h-full"
            />
          ) : (
            <img 
              src={currentSlide?.image_url} 
              alt={currentSlide?.title}
              className="object-cover object-center w-full h-full"
            />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-end pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Hero Content */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                {currentSlide?.subtitle && (
                  <span className="inline-block px-3 py-1 mb-4 bg-[#C5E7FF] text-[#00105a] text-xs font-semibold rounded">
                    {currentSlide.subtitle}
                  </span>
                )}
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {currentSlide?.title}
                </h2>
                
                {currentSlide?.link_text && currentSlide?.link_url && (
                  <div className="mt-6">
                    <Button asChild className="bg-white text-[#00105a] hover:bg-gray-100">
                      <Link to={currentSlide.link_url}>
                        {currentSlide.link_text}
                      </Link>
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Next Match Widget */}
          <div className="lg:col-span-5 space-y-4">
            {nextMatch && (
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold flex items-center">
                    <Calendar className="w-4 h-4 mr-2" /> Next Match
                  </h3>
                  <span className="text-white/80 text-sm">
                    {formatMatchDate(nextMatch.date)}
                  </span>
                </div>
                
                <div className="flex items-center justify-center my-2 text-white">
                  <div className="flex-1 text-right">
                    <p className={cn(
                      "font-medium",
                      isBanksODee(nextMatch.homeTeam) ? "text-white" : "text-white/80"
                    )}>
                      {nextMatch.homeTeam}
                    </p>
                  </div>
                  <div className="mx-4 text-lg font-bold">vs</div>
                  <div className="flex-1">
                    <p className={cn(
                      "font-medium",
                      isBanksODee(nextMatch.awayTeam) ? "text-white" : "text-white/80"
                    )}>
                      {nextMatch.awayTeam}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span>{nextMatch.competition}</span>
                  <span>{nextMatch.time}</span>
                </div>
                
                {nextMatch.ticketLink && (
                  <div className="mt-3">
                    <Button 
                      asChild
                      variant="outline" 
                      className="w-full bg-transparent text-white border-white/30 hover:bg-white/10"
                    >
                      <a 
                        href={nextMatch.ticketLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        <Ticket className="w-4 h-4 mr-2" /> Buy Tickets
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {recentResults.length > 0 && (
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">Latest Result</h3>
                    <Link 
                      to="/fixtures" 
                      className="text-white/80 text-xs flex items-center hover:text-white"
                    >
                      View All <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                  
                  {recentResults[0] && (
                    <>
                      <div className="flex items-center justify-center my-2 text-white">
                        <div className="flex-1 text-right">
                          <p className={cn(
                            "font-medium",
                            isBanksODee(recentResults[0].homeTeam) ? "text-white" : "text-white/80"
                          )}>
                            {recentResults[0].homeTeam}
                          </p>
                        </div>
                        <div className="mx-4 text-lg font-bold">
                          {recentResults[0].homeScore} - {recentResults[0].awayScore}
                        </div>
                        <div className="flex-1">
                          <p className={cn(
                            "font-medium",
                            isBanksODee(recentResults[0].awayTeam) ? "text-white" : "text-white/80"
                          )}>
                            {recentResults[0].awayTeam}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-white/80">
                        <span>{recentResults[0].competition}</span>
                        <span>{formatMatchDate(recentResults[0].date)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => handleManualNavigation(goToPrevSlide)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => handleManualNavigation(goToNextSlide)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-30">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleManualNavigation(() => goToSlide(index))}
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
        </>
      )}
    </section>
  );
};

// Loading skeleton for the hero section
const HeroSkeleton: React.FC = () => (
  <div className="relative w-full h-[90vh] bg-[#00105a]/90 overflow-hidden">
    <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <Skeleton className="h-4 w-24 mb-4 bg-white/20" />
          <Skeleton className="h-14 w-full mb-2 bg-white/20" />
          <Skeleton className="h-14 w-3/4 mb-4 bg-white/20" />
          <Skeleton className="h-10 w-32 mt-6 bg-white/20" />
        </div>
        <div className="lg:col-span-5 space-y-4">
          <Skeleton className="h-40 w-full rounded-lg bg-white/20" />
          <Skeleton className="h-40 w-full rounded-lg bg-white/20 hidden lg:block" />
        </div>
      </div>
    </div>
  </div>
);

export default EnhancedHero;

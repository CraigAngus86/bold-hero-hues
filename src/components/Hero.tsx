import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNewsStore, formatDate } from '@/services/news';

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  
  const { news } = useNewsStore();
  const heroNews = [...news]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === heroNews.length - 1 ? 0 : prevIndex + 1
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
    <section 
      className="relative w-full h-screen overflow-hidden bg-[#00105a]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={heroNews[currentIndex].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#00105a]/90 to-[#00105a]/30 z-10" />
          <img 
            src={heroNews[currentIndex].image} 
            alt={heroNews[currentIndex].title}
            className="object-cover w-full h-full"
          />
        </motion.div>
      </AnimatePresence>
      
      <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-end pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroNews[currentIndex].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="max-w-4xl"
          >
            <span className="inline-block px-3 py-1 mb-4 bg-[#c5e7ff] text-[#00105a] text-xs font-semibold rounded">
              {heroNews[currentIndex].category}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {heroNews[currentIndex].title}
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-6 max-w-2xl">
              {heroNews[currentIndex].excerpt}
            </p>
            <div className="flex items-center space-x-6">
              <a href={`/news/${heroNews[currentIndex].id}`} className="bg-white text-[#00105a] font-medium px-6 py-3 rounded hover:bg-gray-100 transition-colors">
                Read More
              </a>
              <span className="text-white/70 text-sm">
                {formatDate(heroNews[currentIndex].date)}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute bottom-16 left-0 right-0 flex justify-center space-x-2 z-30">
          {heroNews.map((_, index) => (
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
    </section>
  );
};

export default Hero;

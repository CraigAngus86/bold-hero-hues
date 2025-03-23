import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
}

const mockNews: NewsItem[] = [
  {
    id: 1,
    title: "Banks o' Dee crowned Highland League Cup Champions",
    excerpt: "The team celebrates after defeating Formartine United to claim the prestigious Highland League Cup.",
    date: "April 18, 2023",
    image: "/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png",
    category: "Cup Success"
  },
  {
    id: 2,
    title: "Goalkeeper makes crucial save in tense derby match",
    excerpt: "Our keeper pulls off a spectacular save to maintain our clean sheet against local rivals.",
    date: "March 12, 2023",
    image: "/lovable-uploads/e2efc1b0-1c8a-4e98-9826-3030a5f5d247.png",
    category: "Match Highlights"
  },
  {
    id: 3,
    title: "Spain Park Stadium - Our home by the River Dee",
    excerpt: "Aerial view of our recently upgraded facilities at Spain Park, the home of Banks o' Dee FC since 1924.",
    date: "February 28, 2023",
    image: "/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png",
    category: "Stadium News"
  }
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? mockNews.length - 1 : prevIndex - 1
    );
    resetAutoplay();
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === mockNews.length - 1 ? 0 : prevIndex + 1
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
  
  return (
    <section 
      className="relative w-full h-screen overflow-hidden bg-team-blue"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image with Overlay */}
      <AnimatePresence initial={false}>
        <motion.div
          key={mockNews[currentIndex].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-team-blue/90 to-team-blue/30 z-10" />
          <img 
            src={mockNews[currentIndex].image} 
            alt={mockNews[currentIndex].title}
            className="object-cover w-full h-full"
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-end pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={mockNews[currentIndex].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="max-w-4xl"
          >
            <span className="inline-block px-3 py-1 mb-4 bg-white text-team-blue text-xs font-semibold rounded">
              {mockNews[currentIndex].category}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {mockNews[currentIndex].title}
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-6 max-w-2xl">
              {mockNews[currentIndex].excerpt}
            </p>
            <div className="flex items-center space-x-6">
              <button className="bg-white text-team-blue font-medium px-6 py-3 rounded hover:bg-gray-100 transition-colors">
                Read More
              </button>
              <span className="text-white/70 text-sm">
                {mockNews[currentIndex].date}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Controls */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center space-x-2 z-30">
          {mockNews.map((_, index) => (
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
        
        {/* Arrow Controls */}
        <button 
          className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full transition-colors"
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button 
          className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full transition-colors"
          onClick={goToNext}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </section>
  );
};

export default Hero;

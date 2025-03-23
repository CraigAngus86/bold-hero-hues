
import { motion } from 'framer-motion';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NewsCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  featured?: boolean;
  size?: 'small' | 'medium' | 'large';  // Added size option
  className?: string;
}

const NewsCard = ({
  title,
  excerpt,
  image,
  date,
  category,
  featured = false,
  size = 'medium',
  className,
}: NewsCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "group rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl bg-white h-full flex flex-col",
        featured ? "md:col-span-2" : "",
        size === 'large' ? "md:col-span-2" : "",
        size === 'small' ? "md:col-span-1" : "",
        className
      )}
    >
      <div className={cn(
        "overflow-hidden relative",
        size === 'small' ? "h-48" : "h-64",
        size === 'large' ? "h-80" : ""
      )}>
        <div className="absolute top-0 left-0 z-10 m-4">
          <Badge className="bg-team-red hover:bg-team-red/90 text-white text-xs font-semibold">
            {category}
          </Badge>
        </div>
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      <div className={cn(
        "p-6 flex-1 flex flex-col",
        size === 'large' ? "p-8" : "",
        size === 'small' ? "p-4" : ""
      )}>
        <div className="flex items-center mb-3 text-sm text-gray-500">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>{date}</span>
        </div>
        
        <h3 className={cn(
          "font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-team-blue transition-colors",
          size === 'large' ? "text-2xl" : "text-xl",
          size === 'small' ? "text-lg" : ""
        )}>
          {title}
        </h3>
        
        <p className={cn(
          "text-gray-600 mb-4 flex-1",
          size === 'small' ? "line-clamp-2" : "line-clamp-3",
          size === 'large' ? "text-lg" : ""
        )}>
          {excerpt}
        </p>
        
        <div className="mt-auto">
          <button className="text-team-blue font-medium inline-flex items-center transition-colors hover:text-team-red">
            Read Full Story
            <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;

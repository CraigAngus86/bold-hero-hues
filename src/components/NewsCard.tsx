
import { motion } from 'framer-motion';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  featured?: boolean;
  className?: string;
}

const NewsCard = ({
  title,
  excerpt,
  image,
  date,
  category,
  featured = false,
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
        className
      )}
    >
      <div className="overflow-hidden relative">
        <div className="absolute top-0 left-0 z-10 m-4">
          <span className="inline-block px-3 py-1 bg-white text-team-blue text-xs font-semibold rounded shadow-sm">
            {category}
          </span>
        </div>
        <img 
          src={image} 
          alt={title}
          className="w-full h-60 object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center mb-3 text-sm text-gray-500">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>{date}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-team-blue transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
          {excerpt}
        </p>
        
        <div className="mt-auto">
          <button className="text-team-blue font-medium inline-flex items-center transition-colors hover:text-team-silver">
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

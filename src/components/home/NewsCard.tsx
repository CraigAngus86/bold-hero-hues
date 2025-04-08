
import React from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ArrowRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
  link: string;
  featured?: boolean;
  className?: string;
}

// Format date properly
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  excerpt,
  category,
  date,
  imageUrl,
  link,
  featured = false,
  className,
}) => {
  return (
    <motion.div
      className={cn(
        "card-premium relative overflow-hidden rounded-lg bg-white shadow-card h-full",
        featured ? "col-span-2 md:col-span-2" : "",
        className
      )}
      whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <div className="relative overflow-hidden" style={{ paddingBottom: featured ? "56.25%" : "65%" }}>
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        </div>
        
        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1 bg-accent-500 text-team-blue text-xs font-semibold rounded">
            {category}
          </span>
        </div>
        
        {featured && (
          <div className="card-accent-corner"></div>
        )}
      </div>
      
      <div className="p-5 relative z-10">
        <h3 className={cn(
          "font-bold leading-tight mb-2 text-team-blue truncate-2-lines",
          featured ? "text-xl" : "text-lg"
        )}>
          <a href={link} className="hover:text-team-blue/80 transition-colors">
            {title}
          </a>
        </h3>
        
        {featured && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{excerpt}</p>
        )}
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-500">
            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
            <span>{formatDate(date)}</span>
          </div>
          
          <a 
            href={link}
            className="flex items-center font-medium text-team-blue hover:text-team-blue/80 text-animated-underline"
          >
            Read More
            <ArrowRightIcon className="h-3.5 w-3.5 ml-1" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;

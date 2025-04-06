
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ExternalLink, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNewsGrid } from '@/hooks/useNewsGrid';

const NewsGrid: React.FC = () => {
  const { articles, isLoading, error } = useNewsGrid();
  
  // Format date to display in a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Create excerpt from content
  const createExcerpt = (content: string, maxLength = 120) => {
    // Strip HTML tags
    const plainText = content.replace(/<[^>]*>/g, '');
    // Truncate to max length
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...' 
      : plainText;
  };
  
  // Loading skeleton for news cards
  const NewsCardSkeleton = () => (
    <div className="col-span-12 md:col-span-6 lg:col-span-4 animate-pulse">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="aspect-[16/9] bg-gray-200"></div>
        <div className="p-4 space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-red-600 mb-2">Failed to load news articles.</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
          <Link 
            to="/news" 
            className="text-[#00105a] font-medium inline-flex items-center hover:underline"
          >
            View All News
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {isLoading ? (
            // Show skeletons while loading
            Array.from({ length: 3 }).map((_, index) => (
              <NewsCardSkeleton key={index} />
            ))
          ) : articles.length > 0 ? (
            // Show articles
            articles.map((article, index) => (
              <motion.div 
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="col-span-12 md:col-span-6 lg:col-span-4"
              >
                <Link 
                  to={`/news/${article.slug}`} 
                  className="group block bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img 
                      src={article.image_url || '/placeholder.svg'} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex flex-col h-[calc(100%-9rem)]">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-gray-100 hover:bg-gray-100 text-gray-700 text-xs">
                        {article.category}
                      </Badge>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(article.publish_date)}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#00105a] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-3">
                      {createExcerpt(article.content)}
                    </p>
                    
                    <span className="text-sm text-[#00105a] font-medium inline-flex items-center mt-auto group-hover:text-[#00105a]/70 transition-colors">
                      Read More
                      <ExternalLink className="ml-1 w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            // No articles available
            <div className="col-span-12 text-center py-8">
              <p className="text-gray-500">No recent articles available.</p>
              <Link 
                to="/news" 
                className="text-[#00105a] font-medium mt-2 inline-block hover:underline"
              >
                Browse All News
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsGrid;


import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Tag } from 'lucide-react';
import { useNewsGrid } from '@/hooks/useNewsGrid';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/date';

const NewsGrid: React.FC = () => {
  const { articles, isLoading, error } = useNewsGrid(6, true);
  
  // Generate a skeleton loader for loading state
  const NewsCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-200 animate-pulse"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 w-1/4 rounded animate-pulse"></div>
        <div className="h-6 bg-gray-200 w-3/4 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 w-full rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 w-full rounded animate-pulse"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 w-1/4 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 w-1/5 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
  
  return (
    <section className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
          <Link 
            to="/news" 
            className="text-team-blue hover:text-team-blue/80 font-medium flex items-center"
          >
            View All News
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {error ? (
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-red-600">Failed to load news articles. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Show skeleton loaders while loading
              Array(6).fill(0).map((_, index) => (
                <NewsCardSkeleton key={index} />
              ))
            ) : articles.length > 0 ? (
              // Show news articles
              articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <Link to={`/news/${article.slug}`} className="group">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={article.image_url || '/placeholder.svg'} 
                        alt={article.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-[#c5e7ff] hover:bg-[#c5e7ff]/90 text-[#00105a] text-xs font-semibold">
                          {article.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(article.publish_date, 'MMM d, yyyy')}
                        </div>
                        {article.author && (
                          <div className="flex items-center">
                            <span className="mx-1">•</span>
                            <span>{article.author}</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-team-blue transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {article.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                      </p>
                      
                      <span className="text-team-blue text-sm font-medium inline-flex items-center group-hover:underline">
                        Read More
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              // Show message when no articles are available
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No news articles available at the moment</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsGrid;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NewsArticle } from '@/types';
import { fetchNewsArticles } from '@/services/newsService';
import { toast } from "sonner";

const NewsSection: React.FC = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchNews = async () => {
    try {
      setIsLoading(true);
      
      // Use pagination parameters
      const { articles } = await fetchNewsArticles({
        limit: 3, // Show only 3 articles on homepage
        orderBy: 'publish_date',
        orderDirection: 'desc'
      });
      
      setNewsArticles(articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to load latest news');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNews();
  }, []);
  
  return (
    <section className="py-12 bg-team-gray">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-team-blue">Latest News</h2>
          <Link 
            to="/news" 
            className="px-5 py-2 bg-team-blue text-white rounded-md hover:bg-team-navy transition-colors text-sm font-medium"
          >
            View All News
          </Link>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading ? (
            // Loading state
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="animate-pulse h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="animate-pulse h-6 bg-gray-200 mb-2"></div>
                  <div className="animate-pulse h-4 bg-gray-200"></div>
                  <div className="animate-pulse h-4 bg-gray-200 mt-2"></div>
                </div>
              </div>
            ))
          ) : newsArticles.length > 0 ? (
            // News articles
            newsArticles.map((article) => (
              <Link to={`/news/${article.slug}`} key={article.id}>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                  {article.image_url && (
                    <img 
                      src={article.image_url} 
                      alt={article.title} 
                      className="w-full h-48 object-cover" 
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {article.content.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            // No articles state
            <div className="text-center text-gray-500">
              No news articles found.
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default NewsSection;

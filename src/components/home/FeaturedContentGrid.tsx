
import React from 'react';
import { motion } from 'framer-motion';
import NewsCard from './NewsCard';

interface FeaturedContentGridProps {
  featuredArticle: any;
  nextMatch: any;
  leaguePosition: any;
  isLoading: boolean;
}

const FeaturedContentGrid: React.FC<FeaturedContentGridProps> = ({
  featuredArticle,
  nextMatch,
  leaguePosition,
  isLoading
}) => {
  if (isLoading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>;
  }

  // Ensure featuredArticle has a valid image URL
  const articleWithImage = {
    ...featuredArticle,
    image_url: featuredArticle.image_url || '/public/banks-o-dee-dark-logo.png'
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-team-blue mb-8">Featured Content</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Featured Article */}
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <NewsCard
            title={articleWithImage.title}
            excerpt={articleWithImage.excerpt}
            category={articleWithImage.category}
            date={articleWithImage.publish_date}
            imageUrl={articleWithImage.image_url}
            link={`/news/${articleWithImage.id}`}
            featured={true}
          />
        </motion.div>
        
        {/* Next Match & League Position */}
        <div className="space-y-6">
          {/* Next Match Card */}
          <motion.div
            className="bg-white rounded-lg shadow-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-primary-gradient p-4 text-white">
              <h3 className="font-bold text-lg">Next Match</h3>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">{nextMatch.home_team}</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-sm">VS</span>
                <span className="font-medium">{nextMatch.away_team}</span>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <p>{nextMatch.date} · {nextMatch.time}</p>
                <p>{nextMatch.venue}</p>
                <p>{nextMatch.competition}</p>
              </div>
              
              <a 
                href="/fixtures" 
                className="block w-full text-center bg-team-blue text-white rounded py-2 hover:bg-opacity-90 transition-colors"
              >
                View Fixtures
              </a>
            </div>
          </motion.div>
          
          {/* League Position Card */}
          <motion.div
            className="bg-white rounded-lg shadow-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-primary-gradient p-4 text-white">
              <h3 className="font-bold text-lg">League Position</h3>
            </div>
            
            <div className="p-4">
              <div className="flex items-center">
                <div className="bg-accent-500 w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl text-team-blue mr-4">
                  {leaguePosition.position}
                </div>
                
                <div>
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <span className="block text-sm text-gray-500">Played</span>
                      <span className="font-bold">{leaguePosition.played}</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-sm text-gray-500">Points</span>
                      <span className="font-bold">{leaguePosition.points}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-1 mt-3">
                {leaguePosition.form && leaguePosition.form.map((result: string, index: number) => (
                  <span 
                    key={index} 
                    className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full ${
                      result === 'W' ? 'bg-green-500 text-white' : 
                      result === 'D' ? 'bg-yellow-400 text-gray-800' : 
                      'bg-red-500 text-white'
                    }`}
                  >
                    {result}
                  </span>
                ))}
              </div>
              
              <a 
                href="/table" 
                className="block w-full text-center bg-gray-100 text-gray-800 rounded py-2 hover:bg-gray-200 transition-colors mt-3"
              >
                View Table
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedContentGrid;

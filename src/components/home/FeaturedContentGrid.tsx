
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trophy } from 'lucide-react';
import { Fixture } from '@/types/fixtures';
import { NewsItem, FeaturedArticle } from '@/types/news';

interface FeaturedContentGridProps {
  featuredArticle?: NewsItem;
  nextMatch?: Partial<Fixture>;
  leaguePosition?: {
    position: number;
    played: number;
    points: number;
    form: ('W' | 'D' | 'L')[];
  };
  isLoading: boolean;
}

const FeaturedContentGrid: React.FC<FeaturedContentGridProps> = ({
  featuredArticle,
  nextMatch,
  leaguePosition,
  isLoading
}) => {
  if (isLoading) {
    return <FeaturedContentSkeleton />;
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-12 gap-6">
        {/* Featured Article */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="col-span-12 lg:col-span-6 bg-white rounded-lg shadow-md overflow-hidden"
        >
          {featuredArticle && (
            <>
              <div className="relative h-56 md:h-64 overflow-hidden">
                <img 
                  src={featuredArticle.image_url || featuredArticle.image || '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png'} 
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-team-accent text-team-blue text-xs font-semibold px-3 py-1 rounded">
                  {featuredArticle.category}
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl md:text-2xl font-bold text-team-blue mb-3 line-clamp-2">
                  {featuredArticle.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {featuredArticle.excerpt || featuredArticle.content.substring(0, 150) + '...'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(featuredArticle.publish_date || featuredArticle.date || '').toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <a href={`/news/${featuredArticle.id}`} className="text-team-blue font-semibold hover:underline">
                    Read More
                  </a>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Next Match */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="bg-team-blue text-white py-3 px-4">
            <h3 className="font-semibold text-lg">Next Match</h3>
          </div>
          {nextMatch ? (
            <div className="p-6 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center w-full mb-4">
                <div className="flex flex-col items-center">
                  <img 
                    src="/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png" 
                    alt={nextMatch.home_team || 'Home team'}
                    className="w-16 h-16 object-contain"
                  />
                  <span className="text-sm font-semibold mt-2 text-center">{nextMatch.home_team}</span>
                </div>
                
                <div className="mx-4 text-center">
                  <span className="font-bold text-xl text-gray-400">VS</span>
                  <p className="text-xs bg-team-blue text-white px-2 py-1 rounded mt-2">
                    {nextMatch.competition || 'Highland League'}
                  </p>
                </div>
                
                <div className="flex flex-col items-center">
                  <img 
                    src="/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png" 
                    alt={nextMatch.away_team || 'Away team'}
                    className="w-16 h-16 object-contain"
                  />
                  <span className="text-sm font-semibold mt-2 text-center">{nextMatch.away_team}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center mb-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {nextMatch.date && new Date(nextMatch.date).toLocaleDateString('en-GB', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <span className="text-sm">{nextMatch.time}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{nextMatch.venue}</span>
                </div>
              </div>
              
              <a 
                href={nextMatch.ticket_link || '/tickets'} 
                className="bg-team-accent text-team-blue font-medium py-2 px-6 rounded hover:bg-opacity-90 transition-colors w-full text-center"
              >
                Buy Tickets
              </a>
            </div>
          ) : (
            <div className="p-6 flex flex-col items-center justify-center h-64">
              <p className="text-gray-500">No upcoming matches scheduled</p>
            </div>
          )}
        </motion.div>

        {/* League Position */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="bg-team-blue text-white py-3 px-4">
            <h3 className="font-semibold text-lg">League Table</h3>
          </div>
          {leaguePosition ? (
            <div className="p-6 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center mb-6">
                <span className="text-gray-500 text-sm">Current Position</span>
                <span className="text-5xl font-bold text-team-blue">{leaguePosition.position}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 w-full mb-6">
                <div className="text-center">
                  <span className="text-gray-500 text-xs">Played</span>
                  <p className="font-semibold text-xl">{leaguePosition.played}</p>
                </div>
                <div className="text-center">
                  <span className="text-gray-500 text-xs">Points</span>
                  <p className="font-semibold text-xl">{leaguePosition.points}</p>
                </div>
              </div>
              
              <div className="mb-5">
                <span className="text-gray-500 text-xs block mb-2 text-center">Form</span>
                <div className="flex justify-center space-x-1">
                  {leaguePosition.form.map((result, index) => (
                    <span 
                      key={index}
                      className={`w-6 h-6 flex items-center justify-center text-xs font-medium rounded-full ${
                        result === 'W' ? 'bg-green-100 text-green-700' : 
                        result === 'D' ? 'bg-amber-100 text-amber-700' : 
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      {result}
                    </span>
                  ))}
                </div>
              </div>
              
              <a 
                href="/table" 
                className="text-team-blue font-medium hover:underline flex items-center"
              >
                View Full Table
                <Trophy className="w-4 h-4 ml-1" />
              </a>
            </div>
          ) : (
            <div className="p-6 flex flex-col items-center justify-center h-64">
              <p className="text-gray-500">League table data unavailable</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

const FeaturedContentSkeleton = () => (
  <section className="container mx-auto px-4 py-12">
    <div className="grid grid-cols-12 gap-6">
      {/* Featured Article Skeleton */}
      <div className="col-span-12 lg:col-span-6 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-56 md:h-64 bg-gray-200 animate-pulse" />
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse" />
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Next Match Skeleton */}
      <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-10 bg-gray-200 animate-pulse" />
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gray-200 rounded animate-pulse mr-6" />
            <div className="h-16 w-16 bg-gray-200 rounded animate-pulse ml-6" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-5 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-full animate-pulse" />
        </div>
      </div>

      {/* League Position Skeleton */}
      <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-10 bg-gray-200 animate-pulse" />
        <div className="p-6">
          <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  </section>
);

export default FeaturedContentGrid;

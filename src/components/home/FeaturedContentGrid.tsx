
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarIcon, Award, TrendingUp, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useFeaturedContent } from '@/hooks/useFeaturedContent';

const FeaturedContentGrid: React.FC = () => {
  const { 
    featuredArticle, 
    nextMatch, 
    leaguePosition, 
    isLoading, 
    error 
  } = useFeaturedContent();

  // Format date to display in a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Generate form indicators (W, D, L) with appropriate colors
  const FormIndicator = ({ result }: { result: string }) => {
    const getBgColor = () => {
      switch (result) {
        case 'W': return 'bg-green-500';
        case 'D': return 'bg-amber-500';
        case 'L': return 'bg-red-500';
        default: return 'bg-gray-300';
      }
    };

    return (
      <span className={`${getBgColor()} text-white font-bold w-6 h-6 inline-flex items-center justify-center rounded-full text-xs`}>
        {result}
      </span>
    );
  };

  // Loading skeletons for different sections
  const FeaturedNewsSkeleton = () => (
    <div className="col-span-12 lg:col-span-6 rounded-lg overflow-hidden bg-white shadow-md">
      <div className="aspect-[16/9] bg-gray-200 animate-pulse"></div>
      <div className="p-5 space-y-3">
        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  );

  const MatchSkeleton = () => (
    <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-lg shadow-md p-5 space-y-4 animate-pulse">
      <div className="h-5 bg-gray-200 w-1/3 rounded"></div>
      <div className="h-6 bg-gray-200 w-3/4 rounded"></div>
      <div className="h-6 bg-gray-200 w-full rounded"></div>
      <div className="h-5 bg-gray-200 w-1/2 rounded"></div>
      <div className="h-8 bg-gray-200 w-1/2 rounded"></div>
    </div>
  );

  const LeaguePositionSkeleton = () => (
    <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-lg shadow-md p-5 space-y-4 animate-pulse">
      <div className="h-5 bg-gray-200 w-1/2 rounded"></div>
      <div className="h-14 bg-gray-200 w-1/4 rounded"></div>
      <div className="h-5 bg-gray-200 w-3/4 rounded"></div>
      <div className="h-5 bg-gray-200 w-1/2 rounded"></div>
      <div className="flex space-x-2">
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );

  // Handle error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-red-600 mb-2">An error occurred while loading content.</p>
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
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Featured News */}
          {isLoading ? (
            <FeaturedNewsSkeleton />
          ) : featuredArticle ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-12 lg:col-span-6 rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <Link to={`/news/${featuredArticle.slug}`} className="group">
                <div className="aspect-[16/9] overflow-hidden">
                  <img 
                    src={featuredArticle.image_url || '/placeholder.svg'} 
                    alt={featuredArticle.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-[#c5e7ff] hover:bg-[#c5e7ff]/90 text-[#00105a] text-xs font-semibold">
                      {featuredArticle.category}
                    </Badge>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(featuredArticle.publish_date)}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#00105a] transition-colors line-clamp-2">
                    {featuredArticle.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {featuredArticle.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </p>
                  
                  <span className="text-[#00105a] font-medium inline-flex items-center group-hover:text-[#00105a]/70 transition-colors">
                    Read Full Story
                    <ExternalLink className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ) : (
            <div className="col-span-12 lg:col-span-6 rounded-lg bg-white shadow-md p-6 text-center">
              <p className="text-gray-500">No featured articles available at the moment</p>
            </div>
          )}

          {/* Next Match */}
          {isLoading ? (
            <MatchSkeleton />
          ) : nextMatch ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-lg shadow-md p-5"
            >
              <div className="flex items-center text-[#00105a] font-semibold mb-3">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>Next Match</span>
              </div>
              
              <h3 className="font-bold mb-4">
                {nextMatch.home_team} vs {nextMatch.away_team}
              </h3>
              
              <div className="flex items-center mb-3 text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>
                  {new Date(nextMatch.date).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: 'numeric', 
                    month: 'short'
                  })} at {nextMatch.time}
                </span>
              </div>
              
              <div className="text-gray-600 mb-4">
                <span>{nextMatch.competition}</span>
                {nextMatch.venue && (
                  <span className="block">{nextMatch.venue}</span>
                )}
              </div>
              
              {nextMatch.ticket_link ? (
                <a 
                  href={nextMatch.ticket_link}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="bg-[#00105a] text-white py-2 px-4 rounded text-sm font-medium inline-flex items-center hover:bg-[#00105a]/80 transition-colors"
                >
                  Get Tickets
                  <ExternalLink className="ml-1 w-3 h-3" />
                </a>
              ) : (
                <Link 
                  to="/fixtures"
                  className="text-[#00105a] font-medium text-sm inline-flex items-center hover:underline"
                >
                  View All Fixtures
                  <ExternalLink className="ml-1 w-3 h-3" />
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-lg shadow-md p-5 text-center">
              <div className="text-gray-500">
                <p>No upcoming matches</p>
                <Link to="/fixtures" className="text-[#00105a] font-medium text-sm mt-2 inline-block hover:underline">
                  View Fixtures
                </Link>
              </div>
            </div>
          )}

          {/* League Position */}
          {isLoading ? (
            <LeaguePositionSkeleton />
          ) : leaguePosition ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-lg shadow-md p-5"
            >
              <div className="flex items-center text-[#00105a] font-semibold mb-3">
                <Award className="w-4 h-4 mr-2" />
                <span>League Position</span>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="text-4xl font-bold text-[#00105a]">
                  {leaguePosition.position}
                </div>
                <div className="text-sm text-gray-600">
                  <div>Played: {leaguePosition.played}</div>
                  <div>Points: {leaguePosition.points}</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Recent form:</div>
                <div className="flex gap-1">
                  {leaguePosition.form?.slice(0, 5).map((result, index) => (
                    <FormIndicator key={index} result={result} />
                  ))}
                </div>
              </div>
              
              <Link 
                to="/league-table" 
                className="text-[#00105a] font-medium text-sm inline-flex items-center hover:underline"
              >
                View Full Table
                <TrendingUp className="ml-1 w-3 h-3" />
              </Link>
            </motion.div>
          ) : (
            <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-lg shadow-md p-5 text-center">
              <div className="text-gray-500">
                <p>League table data unavailable</p>
                <Link to="/league-table" className="text-[#00105a] font-medium text-sm mt-2 inline-block hover:underline">
                  View Table
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedContentGrid;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FeaturedArticle } from '@/types/news';
import { formatDate } from '@/utils/date';
import { Fixture } from '@/types/fixtures';
import { Ticket, Clock, MapPin, Calendar, TrendingUp, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaguePosition {
  position: number;
  played: number;
  points: number;
  form: ("W" | "D" | "L")[];
}

interface FeaturedContentGridProps {
  featuredArticle: FeaturedArticle | null;
  nextMatch: Fixture | null;
  leaguePosition: LeaguePosition | null;
  isLoading: boolean;
}

const FormBadge: React.FC<{ result: "W" | "D" | "L" }> = ({ result }) => {
  const getColorClass = () => {
    switch (result) {
      case "W": return "bg-green-500 text-white";
      case "D": return "bg-amber-500 text-white";
      case "L": return "bg-red-500 text-white";
      default: return "bg-gray-300 text-gray-800";
    }
  };
  
  return (
    <span className={cn(
      "inline-block w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
      getColorClass()
    )}>
      {result}
    </span>
  );
};

const FeaturedContentGrid: React.FC<FeaturedContentGridProps> = ({
  featuredArticle,
  nextMatch,
  leaguePosition,
  isLoading
}) => {
  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-12 gap-6">
          {/* Featured Article Skeleton */}
          <div className="col-span-12 md:col-span-6 animate-pulse">
            <div className="bg-gray-100 h-64 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
          
          {/* Next Match Skeleton */}
          <div className="col-span-12 md:col-span-3 animate-pulse">
            <div className="bg-white rounded-lg shadow overflow-hidden h-full">
              <div className="h-10 bg-gray-100 rounded-t-lg"></div>
              <div className="p-4 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-full"></div>
                <div className="h-16 bg-gray-200 rounded w-full"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
          
          {/* League Position Skeleton */}
          <div className="col-span-12 md:col-span-3 animate-pulse">
            <div className="bg-white rounded-lg shadow overflow-hidden h-full">
              <div className="h-10 bg-gray-100 rounded-t-lg"></div>
              <div className="p-4 space-y-4">
                <div className="h-16 bg-gray-200 rounded-full w-16 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-full"></div>
                <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-12 gap-6">
        {/* Featured Article */}
        <div className="col-span-12 md:col-span-6">
          {featuredArticle ? (
            <div className="bg-white rounded-lg shadow overflow-hidden h-full flex flex-col">
              <div className="relative">
                {featuredArticle.image_url && (
                  <img 
                    src={featuredArticle.image_url} 
                    alt={featuredArticle.title}
                    className="w-full aspect-video object-cover"
                  />
                )}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-team-accent text-team-blue hover:bg-team-accent/90">
                    {featuredArticle.category}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl md:text-2xl font-bold text-team-blue mb-3 line-clamp-2">
                  {featuredArticle.title}
                </h2>
                
                {featuredArticle.excerpt && (
                  <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {formatDate(featuredArticle.publish_date)}
                  </span>
                  
                  <Link to={`/news/${featuredArticle.id}`}>
                    <Button variant="outline" className="border-team-blue text-team-blue hover:bg-team-blue hover:text-white">
                      Read More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center h-full p-10">
                <p className="text-gray-500">No featured article available</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Next Match */}
        <div className="col-span-12 md:col-span-3">
          <Card className="h-full">
            <CardHeader className="bg-team-blue/10 pb-3">
              <CardTitle className="text-center text-team-blue">Next Match</CardTitle>
            </CardHeader>
            
            <CardContent className="p-4">
              {nextMatch ? (
                <>
                  <div className="text-center mb-3">
                    <Badge variant="outline" className="bg-team-blue/10 text-team-blue border-0">
                      {nextMatch.competition}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-center flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 border border-gray-200">
                        <span className="font-bold text-xs text-team-blue">
                          {nextMatch.home_team.split(' ').map(word => word[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm font-medium block text-center truncate">
                        {nextMatch.home_team}
                      </span>
                    </div>
                    
                    <div className="mx-2 text-center">
                      <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                        VS
                      </span>
                    </div>
                    
                    <div className="text-center flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 border border-gray-200">
                        <span className="font-bold text-xs text-team-blue">
                          {nextMatch.away_team.split(' ').map(word => word[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm font-medium block text-center truncate">
                        {nextMatch.away_team}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-team-blue" />
                      <span>{formatDate(nextMatch.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-team-blue" />
                      <span>{nextMatch.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-team-blue" />
                      <span>{nextMatch.venue}</span>
                    </div>
                  </div>
                  
                  {nextMatch.ticket_link && (
                    <Button asChild className="w-full bg-team-accent text-team-blue hover:bg-amber-500">
                      <Link to={nextMatch.ticket_link}>
                        <Ticket className="w-4 h-4 mr-1.5" />
                        Buy Tickets
                      </Link>
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-48">
                  <p className="text-gray-500">No upcoming matches</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* League Position */}
        <div className="col-span-12 md:col-span-3">
          <Card className="h-full">
            <CardHeader className="bg-team-blue/10 pb-3">
              <CardTitle className="text-center text-team-blue">League Table</CardTitle>
            </CardHeader>
            
            <CardContent className="p-4">
              {leaguePosition ? (
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full bg-team-blue flex items-center justify-center text-white">
                      <span className="text-3xl font-bold">{leaguePosition.position}</span>
                    </div>
                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-team-accent text-team-blue text-xs px-2 py-0.5 rounded-full font-bold">
                      Position
                    </span>
                  </div>
                  
                  <div className="flex justify-between w-full mb-4">
                    <div className="text-center">
                      <span className="text-xl font-bold">{leaguePosition.played}</span>
                      <span className="block text-xs text-gray-500">Played</span>
                    </div>
                    
                    <div className="text-center">
                      <span className="text-xl font-bold">{leaguePosition.points}</span>
                      <span className="block text-xs text-gray-500">Points</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-center mb-1">
                      <span className="text-sm font-medium">Form</span>
                    </div>
                    <div className="flex justify-center space-x-1">
                      {leaguePosition.form.map((result, index) => (
                        <FormBadge key={index} result={result} />
                      ))}
                    </div>
                  </div>
                  
                  <Button asChild variant="outline" size="sm" className="mt-2">
                    <Link to="/table" className="flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 mr-1" />
                      View Full Table
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48">
                  <p className="text-gray-500">League data not available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturedContentGrid;

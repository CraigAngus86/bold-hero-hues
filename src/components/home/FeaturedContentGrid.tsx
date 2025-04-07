import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, Table, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/date';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FeaturedArticle {
  id: string;
  title: string;
  content: string;
  image_url: string;
  category: string;
  publish_date: string;
}

interface NextMatch {
  id: string;
  home_team: string;
  away_team: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
}

interface LeaguePosition {
  position: number;
  played: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

interface FeaturedContentGridProps {
  featuredArticle?: FeaturedArticle;
  nextMatch?: NextMatch;
  leaguePosition?: LeaguePosition;
  isLoading: boolean;
}

const FeaturedContentGrid: React.FC<FeaturedContentGridProps> = ({ 
  featuredArticle, 
  nextMatch, 
  leaguePosition, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6">
            <Card>
              <Skeleton className="h-64 w-full" />
              <CardHeader>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-28" />
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-6 w-8" />
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
                <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="text-center">
                <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                <div className="flex justify-center space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <motion.div 
          className="md:col-span-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {featuredArticle ? (
            <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
              <div className="relative aspect-video">
                <img 
                  src={featuredArticle.image_url} 
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <Badge className="absolute top-4 left-4 bg-team-accent text-team-blue font-medium">
                  {featuredArticle.category}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-2xl text-team-blue">{featuredArticle.title}</CardTitle>
                <CardDescription>
                  {featuredArticle.content.substring(0, 120)}
                  {featuredArticle.content.length > 120 ? '...' : ''}
                </CardDescription>
              </CardHeader>
              
              <CardFooter className="flex justify-between">
                <Button asChild>
                  <Link to={`/news/${featuredArticle.id}`}>
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <span className="text-sm text-gray-500">
                  {formatDate(featuredArticle.publish_date)}
                </span>
              </CardFooter>
            </Card>
          ) : (
            <Card className="flex items-center justify-center h-full">
              <CardContent className="text-center py-12">
                <p className="text-gray-500">Featured article not available</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
        
        <motion.div 
          className="md:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {nextMatch ? (
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-center">Next Match</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center space-y-1">
                    <div className="w-14 h-14 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                      <span className="font-bold text-sm text-team-blue">
                        {nextMatch.home_team.split(' ').map(word => word[0]).join('')}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{nextMatch.home_team}</p>
                  </div>
                  
                  <div className="text-2xl font-bold text-gray-400">VS</div>
                  
                  <div className="text-center space-y-1">
                    <div className="w-14 h-14 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                      <span className="font-bold text-sm text-team-blue">
                        {nextMatch.away_team.split(' ').map(word => word[0]).join('')}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{nextMatch.away_team}</p>
                  </div>
                </div>
                
                <div className="text-center space-y-1 text-sm text-gray-600 mb-4">
                  <p>{nextMatch.competition}</p>
                  <p>{formatDate(nextMatch.date)} • {nextMatch.time}</p>
                  <p>{nextMatch.venue}</p>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button variant="default" className="w-full bg-team-accent text-team-blue hover:bg-team-accent/90">
                  <Ticket className="mr-2 h-4 w-4" />
                  Buy Tickets
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="flex items-center justify-center h-full">
              <CardContent className="text-center py-12">
                <p className="text-gray-500">Next match information not available</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
        
        <motion.div 
          className="md:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {leaguePosition ? (
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
                  <Table className="h-5 w-5" />
                  League Table
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="w-20 h-20 rounded-full bg-team-blue text-white flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold">{leaguePosition.position}</span>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    {leaguePosition.points} points from {leaguePosition.played} games
                  </p>
                </div>
                
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">LAST 5 GAMES</p>
                  <div className="flex justify-center space-x-2">
                    {leaguePosition.form.map((result, i) => (
                      <div 
                        key={i}
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white",
                          result === 'W' ? 'bg-green-500' : 
                          result === 'D' ? 'bg-amber-500' : 'bg-red-500'
                        )}
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Full Table
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="flex items-center justify-center h-full">
              <CardContent className="text-center py-12">
                <p className="text-gray-500">League position information not available</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedContentGrid;

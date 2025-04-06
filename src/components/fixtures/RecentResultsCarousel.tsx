
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar, Trophy } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Match } from '@/components/fixtures/types';

interface RecentResultsCarouselProps {
  results: Match[];
  isLoading: boolean;
  error: string | null;
}

const RecentResultsCarousel: React.FC<RecentResultsCarouselProps> = ({ 
  results, 
  isLoading, 
  error 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No recent results available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((match) => (
        <Card key={match.id} className="overflow-hidden hover:ring-1 hover:ring-primary/40 transition-all">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Result details section */}
              <div className="p-4 flex-1">
                <div className="mb-4">
                  <span className="text-xs font-medium bg-primary/10 text-primary rounded-full px-2 py-1">
                    {match.competition}
                  </span>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-between mb-3">
                  <div className="flex items-center space-x-4 mb-2 md:mb-0">
                    <div className="flex flex-col items-center">
                      <img 
                        src={`/team-logos/${match.homeTeam.toLowerCase().replace(/\s+/g, '-')}.png`}
                        alt={match.homeTeam}
                        className="h-12 w-12 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/team-logos/default.png';
                        }}
                      />
                      <span className="text-xs mt-1 text-center max-w-[60px] truncate">{match.homeTeam}</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-100 px-4 py-1 rounded font-bold">
                        {typeof match.homeScore === 'number' && typeof match.awayScore === 'number'
                          ? `${match.homeScore} - ${match.awayScore}`
                          : 'TBD'
                        }
                      </div>
                      <span className="text-xs mt-1">Full Time</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <img 
                        src={`/team-logos/${match.awayTeam.toLowerCase().replace(/\s+/g, '-')}.png`}
                        alt={match.awayTeam}
                        className="h-12 w-12 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/team-logos/default.png';
                        }}
                      />
                      <span className="text-xs mt-1 text-center max-w-[60px] truncate">{match.awayTeam}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{format(parseISO(match.date), 'dd MMM yyyy')}</span>
                    </div>
                    {match.venue && (
                      <span className="text-xs text-gray-500 mt-1">{match.venue}</span>
                    )}
                  </div>
                </div>
                
                {/* Result info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Trophy className="h-4 w-4 mr-1 text-gray-500" />
                    <span>
                      {typeof match.homeScore === 'number' && typeof match.awayScore === 'number' ? (
                        match.homeScore > match.awayScore ? (
                          <span className="font-medium">{match.homeTeam} won</span>
                        ) : match.homeScore < match.awayScore ? (
                          <span className="font-medium">{match.awayTeam} won</span>
                        ) : (
                          <span className="font-medium">Draw</span>
                        )
                      ) : (
                        "Result unavailable"
                      )}
                    </span>
                  </div>
                  
                  {match.match_report && (
                    <Button asChild size="sm" variant="outline">
                      <a href={`/match-reports/${match.id}`}>Match Report</a>
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Call to action */}
              <div className="md:w-16 flex md:flex-col items-center justify-center bg-gray-50 md:border-l border-t md:border-t-0 p-2">
                <a 
                  href={`/fixtures/${match.id}`} 
                  className="flex md:flex-col items-center justify-center p-2 text-primary hover:text-primary/90 transition-colors"
                >
                  <span className="text-xs text-center hidden md:block mb-1">View Details</span>
                  <ChevronRight className="h-5 w-5" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecentResultsCarousel;

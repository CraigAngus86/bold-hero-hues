
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getFixturesForLovable } from '@/services/supabase/fixtures/integrationService';
import { formatDate } from '@/utils/date';
import { Match } from '@/components/fixtures/types';

const MatchCenter: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['matchCenter'],
    queryFn: async () => {
      const response = await getFixturesForLovable({ 
        upcomingLimit: 4,
        recentLimit: 4
      });
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      return response.data;
    }
  });
  
  // Function to determine if a team name is Banks o' Dee
  const isBanksODee = (team: string) => {
    return team.toLowerCase().includes('banks') && team.toLowerCase().includes('dee');
  };
  
  // Function to determine result styling based on Banks o' Dee result
  const getResultClass = (match: Match) => {
    if (!match.homeScore || !match.awayScore) return '';
    
    const bankIsHome = isBanksODee(match.homeTeam);
    const bankIsAway = isBanksODee(match.awayTeam);
    
    if (!bankIsHome && !bankIsAway) return '';
    
    const bankScore = bankIsHome ? match.homeScore : match.awayScore;
    const opponentScore = bankIsHome ? match.awayScore : match.homeScore;
    
    if (bankScore > opponentScore) return 'text-green-600 font-bold';
    if (bankScore < opponentScore) return 'text-red-600';
    return 'text-amber-600';
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[0, 1].map(i => (
            <Card key={i} className="shadow-md bg-white">
              <CardHeader className="bg-gray-100 animate-pulse h-14"></CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {[0, 1, 2, 3].map(j => (
                    <div key={j} className="border-b pb-4">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-medium text-red-800">Unable to load match data</h3>
          <p className="text-red-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }
  
  const { upcoming, recent } = data;
  
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upcoming Fixtures Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-md bg-white h-full">
              <CardHeader className="bg-team-blue text-white border-b-4 border-team-gold flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <CardTitle>Upcoming Fixtures</CardTitle>
                </div>
                <Link to="/fixtures" className="text-white text-sm font-medium hover:underline flex items-center">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </CardHeader>
              <CardContent className="p-4">
                {upcoming.length > 0 ? (
                  <div className="space-y-4">
                    {upcoming.map(match => (
                      <div key={match.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                        <div className="text-sm text-gray-600 mb-1 font-medium flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(match.date, 'EEE, d MMM')}
                          <span className="mx-1">•</span>
                          <Clock className="w-3 h-3 mr-1" />
                          {match.time}
                        </div>
                        <p className="text-xs text-team-blue font-medium mb-2">{match.competition}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className={`font-medium text-base truncate ${isBanksODee(match.homeTeam) ? 'text-team-blue font-bold' : ''}`}>
                              {match.homeTeam}
                            </p>
                            <p className={`font-medium text-base truncate ${isBanksODee(match.awayTeam) ? 'text-team-blue font-bold' : ''}`}>
                              {match.awayTeam}
                            </p>
                          </div>
                          
                          <div className="flex-shrink-0">
                            {match.ticketLink && (
                              <Button size="sm" variant="outline" className="text-xs" asChild>
                                <a href={match.ticketLink} target="_blank" rel="noopener noreferrer">
                                  Buy Tickets
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-2">{match.venue}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[240px]">
                    <p className="text-gray-500 font-medium">No upcoming fixtures</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Recent Results Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-md bg-white h-full">
              <CardHeader className="bg-team-blue text-white border-b-4 border-team-gold flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <CardTitle>Recent Results</CardTitle>
                </div>
                <Link to="/results" className="text-white text-sm font-medium hover:underline flex items-center">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </CardHeader>
              <CardContent className="p-4">
                {recent.length > 0 ? (
                  <div className="space-y-4">
                    {recent.map(match => (
                      <div key={match.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                        <div className="text-sm text-gray-600 mb-1 font-medium">
                          {formatDate(match.date, 'EEE, d MMM')} • {match.competition}
                        </div>
                        
                        <div className="flex items-center mb-2">
                          <div className="flex-1 text-right pr-3">
                            <span className={`font-medium text-base truncate inline-block max-w-[120px] ${isBanksODee(match.homeTeam) ? 'text-team-blue font-bold' : ''}`}>
                              {match.homeTeam}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-center space-x-3 font-bold text-base">
                            <span className={`bg-gray-100 px-3 py-1 rounded-md min-w-[32px] text-center ${getResultClass(match)}`}>
                              {match.homeScore}
                            </span>
                            <span className="text-sm text-gray-400">-</span>
                            <span className={`bg-gray-100 px-3 py-1 rounded-md min-w-[32px] text-center ${getResultClass(match)}`}>
                              {match.awayScore}
                            </span>
                          </div>
                          
                          <div className="flex-1 pl-3">
                            <span className={`font-medium text-base truncate inline-block max-w-[120px] ${isBanksODee(match.awayTeam) ? 'text-team-blue font-bold' : ''}`}>
                              {match.awayTeam}
                            </span>
                          </div>
                        </div>
                        
                        {match.match_report && (
                          <div className="text-center">
                            <Button size="sm" variant="link" className="text-xs text-team-blue p-0" asChild>
                              <Link to={`/match/${match.id}/report`}>
                                Match Report
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[240px]">
                    <p className="text-gray-500 font-medium">No recent results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MatchCenter;

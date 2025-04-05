
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getAllFixtures } from '@/services/fixturesService';
import { Fixture } from '@/types/fixtures';
import { toast } from 'sonner';

const FixturesSection: React.FC = () => {
  const [upcomingFixtures, setUpcomingFixtures] = useState<Fixture[]>([]);
  const [recentResults, setRecentResults] = useState<Fixture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFixtures = async () => {
      setIsLoading(true);
      
      try {
        const response = await getAllFixtures();
        
        if (response.success && response.data) {
          const today = new Date();
          
          // Filter for upcoming fixtures (not completed and date is in the future)
          const upcoming = response.data
            .filter(fixture => !fixture.isCompleted && new Date(fixture.date) >= today)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 4);
          
          // Filter for recent results (completed)
          const recent = response.data
            .filter(fixture => fixture.isCompleted)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);
          
          setUpcomingFixtures(upcoming);
          setRecentResults(recent);
        }
      } catch (error) {
        console.error('Failed to fetch fixtures:', error);
        toast.error('Failed to load fixtures data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFixtures();
  }, []);
  
  // Format date for display (e.g., "Sat, 11 Jun")
  const formatMatchDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };
  
  // Check if the provided team is Banks o' Dee
  const isBanksODee = (team: string) => {
    return team.toLowerCase().includes('banks') && team.toLowerCase().includes('dee');
  };
  
  // Get next match (first upcoming fixture)
  const nextMatch = upcomingFixtures.length > 0 ? upcomingFixtures[0] : null;
  
  return (
    <section className="py-16 bg-team-gray">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-team-blue">Fixtures & Results</h2>
            
            <Button asChild variant="outline" className="bg-team-lightBlue hover:bg-team-blue hover:text-white text-team-blue">
              <Link to="/fixtures" className="inline-flex items-center">
                View All Fixtures <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-6 flex items-center justify-center h-64 bg-white rounded-lg shadow-sm animate-pulse">
                <p className="text-gray-400">Loading next match...</p>
              </div>
              <div className="col-span-12 lg:col-span-6 flex items-center justify-center h-64 bg-white rounded-lg shadow-sm animate-pulse">
                <p className="text-gray-400">Loading fixtures and results...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-6">
              {/* Next Match Feature */}
              <div className="col-span-12 lg:col-span-6">
                <Card className="overflow-hidden h-full border-team-lightBlue shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-team-blue text-white p-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Next Match
                    </h3>
                  </CardHeader>
                  
                  {nextMatch ? (
                    <CardContent className="p-6">
                      <div className="mb-3">
                        <Badge className="bg-team-lightBlue text-team-blue font-medium">
                          {nextMatch.competition}
                        </Badge>
                        <span className="text-sm text-gray-500 ml-3">
                          {formatMatchDate(nextMatch.date)} • {nextMatch.time}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6 mb-8">
                        <div className="flex-1 text-right pr-3">
                          <div className={`font-bold text-xl ${isBanksODee(nextMatch.homeTeam) ? 'text-team-blue' : 'text-gray-800'}`}>
                            {nextMatch.homeTeam}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center text-lg font-bold bg-team-lightBlue text-team-blue px-3 py-2 rounded-md">
                          VS
                        </div>
                        
                        <div className="flex-1 pl-3">
                          <div className={`font-bold text-xl ${isBanksODee(nextMatch.awayTeam) ? 'text-team-blue' : 'text-gray-800'}`}>
                            {nextMatch.awayTeam}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 text-center mb-6">
                        {nextMatch.venue}
                      </div>
                      
                      {nextMatch.ticketLink && (
                        <div className="text-center">
                          <Button asChild className="bg-team-blue hover:bg-team-navy">
                            <a href={nextMatch.ticketLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                              <Ticket className="w-4 h-4 mr-2" /> Buy Tickets
                            </a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  ) : (
                    <CardContent className="p-6 flex items-center justify-center h-64">
                      <p className="text-gray-500">No upcoming matches scheduled</p>
                    </CardContent>
                  )}
                </Card>
              </div>
              
              {/* Results & Upcoming Fixtures */}
              <div className="col-span-12 lg:col-span-6">
                <div className="grid grid-cols-1 gap-4 h-full">
                  {/* Recent Results */}
                  <Card className="border-team-lightBlue shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="bg-team-blue text-white p-4">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        Recent Results
                      </h3>
                    </CardHeader>
                    <CardContent className="p-4">
                      {recentResults.length > 0 ? (
                        <div className="space-y-3">
                          {recentResults.map(result => (
                            <div key={result.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                              <div className="text-xs text-gray-500 mb-2">
                                {formatMatchDate(result.date)} • {result.competition}
                              </div>
                              <div className="flex items-center">
                                <div className="flex-1 text-right pr-3">
                                  <span className={`font-medium ${isBanksODee(result.homeTeam) ? 'text-team-blue' : ''}`}>
                                    {result.homeTeam}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-center space-x-3 font-bold">
                                  <span className="bg-team-lightBlue text-team-blue px-2 py-1 rounded-sm min-w-[24px] text-center">{result.homeScore}</span>
                                  <span className="text-xs">-</span>
                                  <span className="bg-team-lightBlue text-team-blue px-2 py-1 rounded-sm min-w-[24px] text-center">{result.awayScore}</span>
                                </div>
                                
                                <div className="flex-1 pl-3">
                                  <span className={`font-medium ${isBanksODee(result.awayTeam) ? 'text-team-blue' : ''}`}>
                                    {result.awayTeam}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-24">
                          <p className="text-gray-500">No recent results</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* More Upcoming Fixtures */}
                  {upcomingFixtures.length > 1 && (
                    <Card className="border-team-lightBlue shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="bg-team-blue text-white p-4">
                        <h3 className="text-lg font-semibold">Upcoming Fixtures</h3>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {upcomingFixtures.slice(1, 4).map(fixture => (
                            <div key={fixture.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                              <div className="text-xs text-gray-500 mb-2">
                                {formatMatchDate(fixture.date)} • {fixture.time} • {fixture.competition}
                              </div>
                              <div className="flex items-center">
                                <div className="flex-1 text-right pr-3">
                                  <span className={`font-medium ${isBanksODee(fixture.homeTeam) ? 'text-team-blue' : ''}`}>
                                    {fixture.homeTeam}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-center px-3">
                                  <span className="bg-team-lightBlue text-team-blue text-xs font-semibold px-2 py-1 rounded-sm">
                                    VS
                                  </span>
                                </div>
                                
                                <div className="flex-1 pl-3">
                                  <span className={`font-medium ${isBanksODee(fixture.awayTeam) ? 'text-team-blue' : ''}`}>
                                    {fixture.awayTeam}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FixturesSection;

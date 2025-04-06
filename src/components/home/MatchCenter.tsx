
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Calendar, Trophy, Table2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFixturesData } from './fixtures/useFixturesData';
import FixturesList from '../fixtures/FixturesList';

const MatchCenter: React.FC = () => {
  const { upcomingFixtures, recentResults, isLoading, nextMatch } = useFixturesData();
  const [activeTab, setActiveTab] = useState('fixtures');

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="h-12 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 bg-gray-200 rounded-lg h-[400px] animate-pulse"></div>
            <div className="md:col-span-7 bg-gray-200 rounded-lg h-[400px] animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Helper function to determine result style based on scores
  const getResultStyle = (homeTeam: string, homeScore?: number, awayScore?: number) => {
    const isBanksODee = homeTeam.includes("Banks o' Dee");
    
    if (homeScore === undefined || awayScore === undefined) return {};
    
    const teamScore = isBanksODee ? homeScore : awayScore;
    const opponentScore = isBanksODee ? awayScore : homeScore;
    
    if (teamScore === opponentScore) {
      return { badge: 'D', color: 'bg-amber-500' }; // Draw
    } else if ((isBanksODee && homeScore > awayScore) || (!isBanksODee && awayScore > homeScore)) {
      return { badge: 'W', color: 'bg-green-600' }; // Win
    } else {
      return { badge: 'L', color: 'bg-red-600' }; // Loss
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Trophy className="w-6 h-6 text-team-accent mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Fixtures & Results</h2>
            </div>
            
            <Button asChild variant="outline" className="border-team-blue text-team-blue hover:bg-team-blue hover:text-white transition-colors duration-300">
              <Link to="/fixtures" className="inline-flex items-center">
                View All Fixtures <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Next Match Feature */}
            {nextMatch && (
              <motion.div variants={itemVariants} className="md:col-span-5">
                <Card className="overflow-hidden h-full border-none shadow-lg bg-white rounded-xl">
                  <div className="bg-team-blue text-white p-4">
                    <CardTitle className="text-lg font-bold flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Next Match
                    </CardTitle>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex flex-col items-center space-y-6 py-3">
                      <div className="text-sm font-medium text-gray-500 bg-gray-50 px-4 py-1 rounded-full">
                        {nextMatch.competition} • {new Date(nextMatch.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} • {nextMatch.time}
                      </div>
                      
                      <div className="flex items-center justify-center w-full">
                        <div className="text-right mr-8 flex flex-col items-center">
                          <div className="w-20 h-20 bg-gray-100 rounded-full mb-3 flex items-center justify-center border-2 border-gray-200 shadow-md overflow-hidden">
                            {nextMatch.home_team === 'Banks o\' Dee' ? (
                              <img 
                                src="/lovable-uploads/banks-o-dee-dark-logo.png" 
                                alt="Banks o' Dee Logo" 
                                className="w-16 h-16 object-contain" 
                              />
                            ) : (
                              <span className="font-bold text-xl text-team-blue">
                                {nextMatch.home_team.split(' ').map(word => word[0]).join('')}
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-gray-800">{nextMatch.home_team}</div>
                          <div className="text-xs text-gray-500 uppercase mt-1">
                            {nextMatch.home_team === 'Banks o\' Dee' ? 'HOME' : ''}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-bold mb-2 text-gray-300">VS</div>
                          <div className="bg-team-blue text-white text-sm py-1 px-4 rounded-full shadow-md">
                            {new Date(nextMatch.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </div>
                        </div>
                        
                        <div className="text-left ml-8 flex flex-col items-center">
                          <div className="w-20 h-20 bg-gray-100 rounded-full mb-3 flex items-center justify-center border-2 border-gray-200 shadow-md overflow-hidden">
                            {nextMatch.away_team === 'Banks o\' Dee' ? (
                              <img 
                                src="/lovable-uploads/banks-o-dee-dark-logo.png" 
                                alt="Banks o' Dee Logo" 
                                className="w-16 h-16 object-contain" 
                              />
                            ) : (
                              <span className="font-bold text-xl text-team-blue">
                                {nextMatch.away_team.split(' ').map(word => word[0]).join('')}
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-gray-800">{nextMatch.away_team}</div>
                          <div className="text-xs text-gray-500 uppercase mt-1">
                            {nextMatch.away_team === 'Banks o\' Dee' ? 'AWAY' : ''}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">
                          {nextMatch.venue}
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                          <Button 
                            onClick={() => {
                              // Create calendar event
                              const startDate = new Date(`${nextMatch.date}T${nextMatch.time || '15:00'}`);
                              const endDate = new Date(startDate);
                              endDate.setHours(endDate.getHours() + 2);
                              
                              const title = `${nextMatch.home_team} vs ${nextMatch.away_team}`;
                              const details = `${nextMatch.competition} match at ${nextMatch.venue}`;
                              
                              // Format dates for Google Calendar
                              const formatForCalendar = (date: Date) => {
                                return date.toISOString().replace(/-|:|\.\d+/g, '');
                              };
                              
                              const start = formatForCalendar(startDate);
                              const end = formatForCalendar(endDate);
                              
                              const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(nextMatch.venue)}&dates=${start}/${end}`;
                              
                              window.open(googleCalendarUrl, '_blank');
                            }}
                            variant="outline" 
                            size="sm" 
                            className="text-xs border-gray-300 text-gray-700 hover:bg-gray-100"
                          >
                            <Calendar className="mr-1 h-3.5 w-3.5" />
                            Add to Calendar
                          </Button>
                        
                          {nextMatch.ticket_link && (
                            <Button 
                              asChild
                              className="bg-team-accent text-team-blue hover:bg-team-accent/90 text-xs shadow-md"
                            >
                              <a href={nextMatch.ticket_link} target="_blank" rel="noopener noreferrer">
                                Buy Tickets
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {/* Fixtures & Results Tabs */}
            <motion.div variants={itemVariants} className="md:col-span-7">
              <Card className="overflow-hidden h-full border-none shadow-lg bg-white rounded-xl">
                <Tabs 
                  defaultValue="fixtures" 
                  value={activeTab} 
                  onValueChange={setActiveTab}
                  className="w-full h-full"
                >
                  <div className="bg-team-blue text-white">
                    <TabsList className="w-full grid grid-cols-2 bg-transparent rounded-none h-auto">
                      <TabsTrigger 
                        value="fixtures" 
                        className="py-4 data-[state=active]:bg-white data-[state=active]:text-team-blue rounded-none border-r border-white/20"
                      >
                        Upcoming Fixtures
                      </TabsTrigger>
                      <TabsTrigger 
                        value="results" 
                        className="py-4 data-[state=active]:bg-white data-[state=active]:text-team-blue rounded-none"
                      >
                        Latest Results
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="fixtures" className="m-0 p-0 h-full">
                    <div className="p-4">
                      {upcomingFixtures.length > 0 ? (
                        <FixturesList fixtures={upcomingFixtures.slice(0, 5)} compact={true} />
                      ) : (
                        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-md">
                          <p>No upcoming fixtures available</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="results" className="m-0 p-0 h-full">
                    <div className="p-4">
                      {recentResults.length > 0 ? (
                        <FixturesList fixtures={recentResults.slice(0, 5)} showScores={true} compact={true} />
                      ) : (
                        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-md">
                          <p>No recent results available</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </motion.div>
            
            {/* League Position */}
            <motion.div variants={itemVariants} className="md:col-span-12">
              <Card className="overflow-hidden border-none shadow-lg bg-white rounded-xl">
                <CardHeader className="bg-gray-50 border-b border-gray-100 p-4 flex flex-row justify-between items-center">
                  <CardTitle className="text-lg font-bold flex items-center text-gray-800">
                    <Table2 className="w-5 h-5 mr-2 text-team-blue" />
                    League Position
                  </CardTitle>
                  <Link to="/table">
                    <Button variant="ghost" size="sm" className="text-team-blue hover:bg-team-blue/10">
                      View Full Table <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 rounded-full bg-team-blue/10 flex items-center justify-center border-2 border-team-blue text-team-blue font-bold text-2xl">
                        3<sup>rd</sup>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">Banks o' Dee FC</h3>
                        <p className="text-gray-500 text-sm">Highland League</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-6 text-center">
                      <div>
                        <div className="text-xl font-bold text-gray-800">18</div>
                        <div className="text-xs text-gray-500">PLAYED</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-800">12</div>
                        <div className="text-xs text-gray-500">WON</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-800">3</div>
                        <div className="text-xs text-gray-500">DRAWN</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-800">3</div>
                        <div className="text-xs text-gray-500">LOST</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-800">39</div>
                        <div className="text-xs text-gray-500">POINTS</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MatchCenter;

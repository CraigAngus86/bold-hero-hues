
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFixturesData } from './fixtures/useFixturesData';
import UpcomingFixtures from '../fixtures/UpcomingFixtures';
import RecentResults from '../fixtures/RecentResults';

const MatchCenter: React.FC = () => {
  const { upcomingMatches, recentMatches, isLoading, nextMatch } = useFixturesData();
  const [activeTab, setActiveTab] = useState('fixtures');

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="h-12 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-200 rounded h-96 animate-pulse"></div>
            <div className="bg-gray-200 rounded h-96 animate-pulse"></div>
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

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-team-blue">Match Center</h2>
          
          <Link to="/fixtures">
            <Button variant="outline" className="border-team-blue text-team-blue hover:bg-team-blue/10">
              View Full Schedule <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Next Match Feature */}
          {nextMatch && (
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <Card className="overflow-hidden h-full border-none shadow-lg bg-white">
                <CardHeader className="bg-team-blue text-white p-4">
                  <CardTitle className="text-lg font-semibold">Next Match</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-sm font-medium text-gray-500">
                      {nextMatch.competition} • {new Date(nextMatch.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} • {nextMatch.time}
                    </div>
                    
                    <div className="flex items-center justify-center w-full">
                      <div className="text-right mr-6 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full mb-2 flex items-center justify-center">
                          <span className="font-bold text-team-blue">
                            {nextMatch.home_team.split(' ').map(word => word[0]).join('')}
                          </span>
                        </div>
                        <div className="font-bold mb-1">{nextMatch.home_team}</div>
                        <div className="text-xs text-gray-500 uppercase">
                          {nextMatch.home_team === 'Banks o\' Dee' ? 'HOME' : ''}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="text-lg font-semibold mb-2">VS</div>
                        <div className="bg-team-blue text-white text-sm py-1 px-3 rounded-full">
                          {new Date(nextMatch.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                      
                      <div className="text-left ml-6 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full mb-2 flex items-center justify-center">
                          <span className="font-bold text-team-blue">
                            {nextMatch.away_team.split(' ').map(word => word[0]).join('')}
                          </span>
                        </div>
                        <div className="font-bold mb-1">{nextMatch.away_team}</div>
                        <div className="text-xs text-gray-500 uppercase">
                          {nextMatch.away_team === 'Banks o\' Dee' ? 'AWAY' : ''}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-center text-gray-600 mt-2">
                      {nextMatch.venue}
                    </div>
                    
                    {nextMatch.ticket_link && (
                      <Button className="bg-team-accent text-team-blue hover:bg-team-accent/90 w-full mt-4">
                        Buy Tickets
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {/* Fixtures & Results Tabs */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card className="overflow-hidden h-full border-none shadow-lg bg-white">
              <CardHeader className="bg-team-blue text-white p-0">
                <Tabs 
                  defaultValue="fixtures" 
                  value={activeTab} 
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="w-full grid grid-cols-2 bg-transparent rounded-none">
                    <TabsTrigger 
                      value="fixtures" 
                      className="py-4 data-[state=active]:bg-white data-[state=active]:text-team-blue rounded-none"
                    >
                      Upcoming Fixtures
                    </TabsTrigger>
                    <TabsTrigger 
                      value="results" 
                      className="py-4 data-[state=active]:bg-white data-[state=active]:text-team-blue rounded-none"
                    >
                      Recent Results
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="fixtures" className="m-0">
                    {upcomingMatches.length > 0 ? (
                      <UpcomingFixtures matches={upcomingMatches.slice(0, 4)} />
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <p>No upcoming fixtures available</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="results" className="m-0">
                    {recentMatches.length > 0 ? (
                      <RecentResults matches={recentMatches.slice(0, 4)} />
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <p>No recent results available</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MatchCenter;

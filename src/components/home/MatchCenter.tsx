
import React from 'react';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Mock data
const upcomingFixtures = [
  {
    id: 'fix-1',
    date: '2025-05-15',
    time: '15:00',
    competition: 'Highland League',
    homeTeam: 'Banks o\' Dee',
    awayTeam: 'Formartine United',
    venue: 'Spain Park',
    ticketsAvailable: true
  },
  {
    id: 'fix-2',
    date: '2025-05-22',
    time: '19:45',
    competition: 'Highland League Cup',
    homeTeam: 'Buckie Thistle',
    awayTeam: 'Banks o\' Dee',
    venue: 'Victoria Park',
    ticketsAvailable: true
  },
  {
    id: 'fix-3',
    date: '2025-05-29',
    time: '15:00',
    competition: 'Highland League',
    homeTeam: 'Banks o\' Dee',
    awayTeam: 'Fraserburgh',
    venue: 'Spain Park',
    ticketsAvailable: false
  },
  {
    id: 'fix-4',
    date: '2025-06-05',
    time: '15:00',
    competition: 'Scottish Cup',
    homeTeam: 'Banks o\' Dee',
    awayTeam: 'Brora Rangers',
    venue: 'Spain Park',
    ticketsAvailable: false
  }
];

const recentResults = [
  {
    id: 'res-1',
    date: '2025-05-01',
    competition: 'Highland League',
    homeTeam: 'Banks o\' Dee',
    homeScore: 3,
    awayTeam: 'Keith FC',
    awayScore: 1,
    hasMatchReport: true
  },
  {
    id: 'res-2',
    date: '2025-04-24',
    competition: 'Highland League Cup',
    homeTeam: 'Huntly',
    homeScore: 0,
    awayTeam: 'Banks o\' Dee',
    awayScore: 2,
    hasMatchReport: true
  },
  {
    id: 'res-3',
    date: '2025-04-17',
    competition: 'Highland League',
    homeTeam: 'Banks o\' Dee',
    homeScore: 1,
    awayTeam: 'Deveronvale',
    awayScore: 1,
    hasMatchReport: true
  },
  {
    id: 'res-4',
    date: '2025-04-10',
    competition: 'Highland League',
    homeTeam: 'Inverurie Loco Works',
    homeScore: 0,
    awayTeam: 'Banks o\' Dee',
    awayScore: 3,
    hasMatchReport: false
  }
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
};

const isBanksODee = (team: string) => {
  return team.toLowerCase().includes('banks') && team.toLowerCase().includes('dee');
};

const getResultClass = (homeTeam: string, homeScore: number, awayScore: number) => {
  const isBanksHome = isBanksODee(homeTeam);
  
  if (isBanksHome && homeScore > awayScore) return 'text-green-600 font-bold';
  if (!isBanksHome && homeScore < awayScore) return 'text-green-600 font-bold';
  if (homeScore === awayScore) return 'text-amber-600';
  return 'text-red-600';
};

const MatchCenter: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-team-blue mb-12">Match Center</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Fixture List */}
          <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="bg-team-blue text-white py-4 px-6">
              <CardTitle className="flex items-center text-xl">
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming Fixtures
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {upcomingFixtures.map((fixture) => (
                  <motion.div 
                    key={fixture.id}
                    className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center mb-1 text-team-blue font-medium">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(fixture.date)}</span>
                          <span className="mx-2">•</span>
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{fixture.time}</span>
                        </div>
                        
                        <div className="text-xs bg-gray-100 rounded-full px-2 py-1 inline-block mb-2">
                          {fixture.competition}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={isBanksODee(fixture.homeTeam) ? "font-bold" : ""}>
                            {fixture.homeTeam}
                          </span>
                          <span className="text-gray-400">vs</span>
                          <span className={isBanksODee(fixture.awayTeam) ? "font-bold" : ""}>
                            {fixture.awayTeam}
                          </span>
                        </div>
                        
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{fixture.venue}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {fixture.ticketsAvailable ? (
                          <Link to={`/tickets/${fixture.id}`}>
                            <Button size="sm" variant="outline" className="flex items-center space-x-1 text-sm border-team-blue text-team-blue hover:bg-team-blue hover:text-white">
                              <Ticket className="w-4 h-4" />
                              <span>Tickets</span>
                            </Button>
                          </Link>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-500">Tickets soon</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link to="/fixtures">
                  <Button variant="outline" className="border-team-blue text-team-blue hover:bg-team-blue hover:text-white">
                    View All Fixtures
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Results */}
          <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="bg-team-blue text-white py-4 px-6">
              <CardTitle className="flex items-center text-xl">
                <Clock className="w-5 h-5 mr-2" />
                Recent Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentResults.map((result) => (
                  <motion.div 
                    key={result.id}
                    className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center mb-1">
                          <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                          <span className="text-gray-500">{formatDate(result.date)}</span>
                        </div>
                        
                        <div className="text-xs bg-gray-100 rounded-full px-2 py-1 inline-block mb-2">
                          {result.competition}
                        </div>
                        
                        <div className="flex items-center">
                          <span className={`${isBanksODee(result.homeTeam) ? "font-bold" : ""} mr-2`}>
                            {result.homeTeam}
                          </span>
                          <span className={`px-2 py-0.5 rounded ${getResultClass(result.homeTeam, result.homeScore, result.awayScore)}`}>
                            {result.homeScore}
                          </span>
                          <span className="mx-1">-</span>
                          <span className={`px-2 py-0.5 rounded ${getResultClass(result.awayTeam, result.awayScore, result.homeScore)}`}>
                            {result.awayScore}
                          </span>
                          <span className={`${isBanksODee(result.awayTeam) ? "font-bold" : ""} ml-2`}>
                            {result.awayTeam}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        {result.hasMatchReport && (
                          <Link to={`/news/match-report/${result.id}`}>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-xs text-team-blue hover:bg-team-lightBlue/20"
                            >
                              Match Report
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link to="/results">
                  <Button variant="outline" className="border-team-blue text-team-blue hover:bg-team-blue hover:text-white">
                    View All Results
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MatchCenter;

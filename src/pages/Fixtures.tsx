
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  competition: string;
  isCompleted: boolean;
  venue: string;
}

// Mock data for demonstration - this would be fetched from an API
const mockMatches: Match[] = [
  // August
  {
    id: 101,
    homeTeam: "Banks o' Dee",
    awayTeam: "Brora Rangers",
    homeScore: 2,
    awayScore: 2,
    date: "2023-08-05",
    time: "15:00",
    competition: "Highland League",
    isCompleted: true,
    venue: "Spain Park"
  },
  {
    id: 102,
    homeTeam: "Rothes",
    awayTeam: "Banks o' Dee",
    homeScore: 0,
    awayScore: 3,
    date: "2023-08-12",
    time: "15:00",
    competition: "Highland League",
    isCompleted: true,
    venue: "Mackessack Park"
  },
  {
    id: 103,
    homeTeam: "Banks o' Dee",
    awayTeam: "Keith",
    homeScore: 4,
    awayScore: 1,
    date: "2023-08-19",
    time: "15:00",
    competition: "Highland League",
    isCompleted: true,
    venue: "Spain Park"
  },
  {
    id: 104,
    homeTeam: "Turriff United",
    awayTeam: "Banks o' Dee",
    homeScore: 1,
    awayScore: 2,
    date: "2023-08-26",
    time: "15:00",
    competition: "Highland League",
    isCompleted: true,
    venue: "The Haughs"
  },
  // September
  {
    id: 1,
    homeTeam: "Banks o' Dee",
    awayTeam: "Formartine United",
    homeScore: 3,
    awayScore: 1,
    date: "2023-09-23",
    time: "15:00",
    competition: "Highland League",
    isCompleted: true,
    venue: "Spain Park"
  },
  {
    id: 2,
    homeTeam: "Huntly",
    awayTeam: "Banks o' Dee",
    homeScore: 0,
    awayScore: 2,
    date: "2023-09-16",
    time: "15:00",
    competition: "Highland League",
    isCompleted: true,
    venue: "Christie Park"
  },
  {
    id: 3,
    homeTeam: "Banks o' Dee",
    awayTeam: "Deveronvale",
    homeScore: 4,
    awayScore: 0,
    date: "2023-09-09",
    time: "15:00",
    competition: "Highland League Cup",
    isCompleted: true,
    venue: "Spain Park"
  },
  {
    id: 4,
    homeTeam: "Banks o' Dee",
    awayTeam: "Buckie Thistle",
    date: "2023-09-30",
    time: "15:00",
    competition: "Highland League",
    isCompleted: false,
    venue: "Spain Park"
  },
  // October
  {
    id: 5,
    homeTeam: "Fraserburgh",
    awayTeam: "Banks o' Dee",
    date: "2023-10-07",
    time: "15:00",
    competition: "Highland League",
    isCompleted: false,
    venue: "Bellslea Park"
  },
  {
    id: 6,
    homeTeam: "Banks o' Dee",
    awayTeam: "Lossiemouth",
    date: "2023-10-14",
    time: "15:00",
    competition: "Highland League Cup",
    isCompleted: false,
    venue: "Spain Park"
  },
  {
    id: 7,
    homeTeam: "Nairn County",
    awayTeam: "Banks o' Dee",
    date: "2023-10-21",
    time: "15:00",
    competition: "Highland League",
    isCompleted: false,
    venue: "Station Park"
  },
  {
    id: 8,
    homeTeam: "Banks o' Dee",
    awayTeam: "Wick Academy",
    date: "2023-10-28",
    time: "15:00",
    competition: "Highland League",
    isCompleted: false,
    venue: "Spain Park"
  },
  // November
  {
    id: 9,
    homeTeam: "Clachnacuddin",
    awayTeam: "Banks o' Dee",
    date: "2023-11-04",
    time: "15:00",
    competition: "Highland League",
    isCompleted: false,
    venue: "Grant Street Park"
  },
  {
    id: 10,
    homeTeam: "Banks o' Dee",
    awayTeam: "Strathspey Thistle",
    date: "2023-11-11",
    time: "15:00",
    competition: "Highland League",
    isCompleted: false,
    venue: "Spain Park"
  }
];

const competitions = ["All Competitions", "Highland League", "Highland League Cup", "Aberdeenshire Cup", "Aberdeenshire Shield", "Scottish Cup"];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const groupMatchesByMonth = (matches: Match[]) => {
  const grouped = matches.reduce<Record<string, Match[]>>((acc, match) => {
    const date = new Date(match.date);
    const monthYear = date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    
    acc[monthYear].push(match);
    return acc;
  }, {});
  
  // Sort matches within each month
  Object.keys(grouped).forEach(month => {
    grouped[month].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });
  
  return grouped;
};

const Fixtures = () => {
  const [selectedCompetition, setSelectedCompetition] = useState("All Competitions");
  const [showPast, setShowPast] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);
  
  const filteredMatches = mockMatches.filter(match => {
    const competitionMatch = selectedCompetition === "All Competitions" || match.competition === selectedCompetition;
    const timeframeMatch = (showPast && match.isCompleted) || (showUpcoming && !match.isCompleted);
    return competitionMatch && timeframeMatch;
  });
  
  const groupedMatches = groupMatchesByMonth(filteredMatches);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-team-blue mb-4">Fixtures & Results</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              View all upcoming matches and past results for Banks o' Dee FC.
            </p>
          </motion.div>
          
          {/* Filters */}
          <div className="mb-10 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-team-blue" />
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${showPast ? 'bg-team-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setShowPast(!showPast)}
                  >
                    Past Results
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${showUpcoming ? 'bg-team-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setShowUpcoming(!showUpcoming)}
                  >
                    Upcoming Fixtures
                  </button>
                </div>
              </div>
              
              <select
                value={selectedCompetition}
                onChange={(e) => setSelectedCompetition(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-team-blue focus:border-transparent"
              >
                {competitions.map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Fixtures By Month */}
          <div className="space-y-10">
            {Object.keys(groupedMatches).length > 0 ? (
              Object.entries(groupedMatches).map(([month, matches]) => (
                <motion.div
                  key={month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-team-blue mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {month}
                  </h2>
                  
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <Card 
                        key={match.id}
                        className={`overflow-hidden border-team-gray hover:shadow-md transition-shadow ${match.isCompleted ? 'bg-white' : 'bg-white'}`}
                      >
                        <CardContent className="p-0">
                          <div className={`text-xs font-medium p-2 flex justify-between items-center ${match.isCompleted ? 'bg-team-lightBlue text-team-blue' : 'bg-team-blue text-white'}`}>
                            <span>{match.competition}</span>
                            <span>{formatDate(match.date)} • {match.time}</span>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 text-right pr-3">
                                <p className={`font-semibold ${match.homeTeam === "Banks o' Dee" ? "text-team-blue" : ""}`}>
                                  {match.homeTeam}
                                </p>
                              </div>
                              
                              {match.isCompleted ? (
                                <div className="flex items-center justify-center space-x-2 font-bold">
                                  <span className="w-8 h-8 flex items-center justify-center bg-team-gray rounded">{match.homeScore}</span>
                                  <span className="text-xs">-</span>
                                  <span className="w-8 h-8 flex items-center justify-center bg-team-gray rounded">{match.awayScore}</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center font-bold text-sm">
                                  <span>VS</span>
                                </div>
                              )}
                              
                              <div className="flex-1 text-left pl-3">
                                <p className={`font-semibold ${match.awayTeam === "Banks o' Dee" ? "text-team-blue" : ""}`}>
                                  {match.awayTeam}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500 text-center">
                              {match.venue}
                            </div>
                            
                            {!match.isCompleted && (
                              <div className="mt-3 flex justify-center">
                                <a 
                                  href="/tickets" 
                                  className="text-xs bg-team-blue text-white px-3 py-1 rounded hover:bg-team-navy transition-colors"
                                >
                                  Get Tickets
                                </a>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No fixtures found matching your criteria.</p>
                <button 
                  className="mt-4 text-team-blue hover:underline"
                  onClick={() => {
                    setSelectedCompetition("All Competitions");
                    setShowPast(true);
                    setShowUpcoming(true);
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Fixtures;

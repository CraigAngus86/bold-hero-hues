
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock } from 'lucide-react';
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
  // Past matches
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
  // Upcoming matches
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
  }
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const FixturesSection = () => {
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);

  // In a real app, this would fetch from an API
  useEffect(() => {
    // Get recent matches (last 3)
    const recent = mockMatches
      .filter(match => match.isCompleted)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
    
    // Get upcoming matches (next 3)
    const upcoming = mockMatches
      .filter(match => !match.isCompleted)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
    
    setRecentMatches(recent);
    setUpcomingMatches(upcoming);
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-team-blue mb-4 md:mb-0">Fixtures & Results</h2>
          <a 
            href="/fixtures" 
            className="px-5 py-2 bg-team-blue text-white rounded-md hover:bg-team-navy transition-colors text-sm font-medium"
          >
            View All Fixtures
          </a>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Results */}
          <div>
            <h3 className="text-xl font-semibold text-team-darkGray mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-team-blue" />
              Recent Results
            </h3>
            <div className="space-y-4">
              {recentMatches.map((match) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden border-team-gray hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="bg-team-lightBlue text-team-blue text-xs font-medium p-2">
                        {match.competition} • {formatDate(match.date)}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 text-right pr-3">
                            <p className={`font-semibold ${match.homeTeam === "Banks o' Dee" ? "text-team-blue" : ""}`}>
                              {match.homeTeam}
                            </p>
                          </div>
                          <div className="flex items-center justify-center space-x-2 font-bold">
                            <span className="w-8 h-8 flex items-center justify-center bg-team-gray rounded">{match.homeScore}</span>
                            <span className="text-xs">-</span>
                            <span className="w-8 h-8 flex items-center justify-center bg-team-gray rounded">{match.awayScore}</span>
                          </div>
                          <div className="flex-1 text-left pl-3">
                            <p className={`font-semibold ${match.awayTeam === "Banks o' Dee" ? "text-team-blue" : ""}`}>
                              {match.awayTeam}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 text-center">
                          {match.venue}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Upcoming Fixtures */}
          <div>
            <h3 className="text-xl font-semibold text-team-darkGray mb-4 flex items-center">
              <CalendarDays className="w-5 h-5 mr-2 text-team-blue" />
              Upcoming Fixtures
            </h3>
            <div className="space-y-4">
              {upcomingMatches.map((match) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden border-team-gray hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="bg-team-blue text-white text-xs font-medium p-2">
                        {match.competition} • {formatDate(match.date)} • {match.time}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 text-right pr-3">
                            <p className={`font-semibold ${match.homeTeam === "Banks o' Dee" ? "text-team-blue" : ""}`}>
                              {match.homeTeam}
                            </p>
                          </div>
                          <div className="flex items-center justify-center font-bold text-sm">
                            <span>VS</span>
                          </div>
                          <div className="flex-1 text-left pl-3">
                            <p className={`font-semibold ${match.awayTeam === "Banks o' Dee" ? "text-team-blue" : ""}`}>
                              {match.awayTeam}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 text-center">
                          {match.venue}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FixturesSection;

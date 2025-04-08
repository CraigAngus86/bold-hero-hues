
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { formatDate } from '@/utils/date';

const MatchCenter: React.FC = () => {
  // Mock data
  const upcomingMatches = [
    {
      id: '1',
      homeTeam: "Banks o' Dee",
      awayTeam: "Formartine United",
      date: "2025-05-15",
      time: "15:00",
      venue: "Spain Park",
      competition: "Highland League",
      ticketLink: "/tickets/match-1"
    },
    {
      id: '2',
      homeTeam: "Buckie Thistle",
      awayTeam: "Banks o' Dee",
      date: "2025-05-22",
      time: "19:45",
      venue: "Victoria Park",
      competition: "Highland League",
      ticketLink: "/tickets/match-2"
    },
    {
      id: '3',
      homeTeam: "Banks o' Dee",
      awayTeam: "Brechin City",
      date: "2025-05-29",
      time: "15:00",
      venue: "Spain Park",
      competition: "Highland League Cup",
      ticketLink: "/tickets/match-3"
    }
  ];
  
  const recentResults = [
    {
      id: 'result-1',
      homeTeam: "Banks o' Dee",
      awayTeam: "Keith FC",
      homeScore: 3,
      awayScore: 1,
      date: "2025-05-01",
      competition: "Highland League"
    },
    {
      id: 'result-2',
      homeTeam: "Fraserburgh",
      awayTeam: "Banks o' Dee",
      homeScore: 1,
      awayScore: 2,
      date: "2025-04-24",
      competition: "Highland League"
    },
    {
      id: 'result-3',
      homeTeam: "Banks o' Dee",
      awayTeam: "Huntly",
      homeScore: 2,
      awayScore: 2,
      date: "2025-04-17",
      competition: "Highland League"
    }
  ];

  return (
    <section className="py-16 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-team-blue mb-4">Match Center</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with our upcoming fixtures and recent results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Matches */}
          <div>
            <h3 className="text-xl font-bold text-team-blue mb-6 border-b border-gray-200 pb-2">Upcoming Fixtures</h3>
            
            <div className="space-y-4">
              {upcomingMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  className="card-premium bg-white shadow-card rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                        {match.competition}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-right flex-1">
                        <p className="font-bold text-lg">{match.homeTeam}</p>
                        <p className="text-xs text-gray-500">
                          {match.venue === "Spain Park" ? "HOME" : ""}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center mx-4">
                        <span className="text-xl font-bold px-3 py-1">VS</span>
                      </div>
                      
                      <div className="text-left flex-1">
                        <p className="font-bold text-lg">{match.awayTeam}</p>
                        <p className="text-xs text-gray-500">
                          {match.venue !== "Spain Park" ? "AWAY" : ""}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(match.date)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{match.time}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{match.venue}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <a 
                        href={match.ticketLink}
                        className="flex items-center justify-center w-full bg-team-blue text-white py-2 rounded hover:bg-opacity-90 transition-colors btn-hover-effect"
                      >
                        <Ticket className="h-4 w-4 mr-2" />
                        Get Tickets
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <div className="text-center mt-6">
                <a 
                  href="/fixtures" 
                  className="inline-flex items-center text-team-blue font-medium hover:underline text-animated-underline"
                >
                  View All Fixtures
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Recent Results */}
          <div>
            <h3 className="text-xl font-bold text-team-blue mb-6 border-b border-gray-200 pb-2">Recent Results</h3>
            
            <div className="space-y-4">
              {recentResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  className="card-premium bg-white shadow-card rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                        {result.competition}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(result.date)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-right flex-1">
                        <p className={`font-bold text-lg ${result.homeTeam === "Banks o' Dee" ? "text-team-blue" : ""}`}>
                          {result.homeTeam}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center mx-4">
                        <div className="bg-gray-800 text-white px-4 py-2 rounded font-bold">
                          {result.homeScore} - {result.awayScore}
                        </div>
                        <span className="text-xs text-gray-500 mt-1">FULL TIME</span>
                      </div>
                      
                      <div className="text-left flex-1">
                        <p className={`font-bold text-lg ${result.awayTeam === "Banks o' Dee" ? "text-team-blue" : ""}`}>
                          {result.awayTeam}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <a 
                        href={`/match-report/${result.id}`}
                        className="flex items-center justify-center w-full bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200 transition-colors"
                      >
                        Match Report
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <div className="text-center mt-6">
                <a 
                  href="/results" 
                  className="inline-flex items-center text-team-blue font-medium hover:underline text-animated-underline"
                >
                  View All Results
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MatchCenter;

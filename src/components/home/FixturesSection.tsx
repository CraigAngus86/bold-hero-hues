
import React from 'react';
import { Link } from 'react-router-dom';

// Define consistent types for our data
interface ResultItem {
  date: string;
  competition: string;
  venue: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

interface FixtureItem {
  date: string;
  time: string;
  competition: string;
  venue: string;
  homeTeam: string;
  awayTeam: string;
}

interface LeagueTableItem {
  position: number;
  team: string;
  played: number;
  points: number;
  isBanksODee?: boolean;
}

interface FixturesSectionProps {
  results: ResultItem[];
  fixtures: FixtureItem[];
  leagueTable: LeagueTableItem[];
}

const FixturesSection: React.FC<FixturesSectionProps> = ({ 
  results, 
  fixtures, 
  leagueTable 
}) => {
  // Function to determine result status color
  const getResultColor = (homeTeam: string, homeScore: number, awayScore: number) => {
    const isBanksHome = homeTeam.includes('Banks o\' Dee');
    const isBanksAway = !isBanksHome;
    
    if ((isBanksHome && homeScore > awayScore) || (isBanksAway && awayScore > homeScore)) {
      return 'bg-green-100 text-green-800'; // Win
    } else if (homeScore === awayScore) {
      return 'bg-yellow-100 text-yellow-800'; // Draw
    } else {
      return 'bg-red-100 text-red-800'; // Loss
    }
  };

  // Truncate team names if too long
  const formatTeamName = (name: string) => {
    return name.length > 20 ? `${name.substring(0, 18)}...` : name;
  };

  return (
    <div className="w-full py-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-navy-800">Results, Fixtures & League Table</h2>
          <Link to="/tickets" className="bg-navy-700 text-white px-4 py-2 rounded-md hover:bg-navy-800 transition">
            Buy Tickets
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Results Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
            <div className="bg-navy-800 text-white p-4 text-center">
              <h3 className="text-xl font-semibold flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Recent Results
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {results.slice(0, 4).map((result, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div className="text-sm text-gray-600 mb-2">
                    {result.date} | {result.venue} | {result.competition}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex-1 font-medium">
                      {formatTeamName(result.homeTeam)}
                    </div>
                    
                    <div className="flex items-center justify-center mx-2 space-x-2">
                      <span className={`px-3 py-1 rounded-md font-bold ${getResultColor(result.homeTeam, result.homeScore, result.awayScore)}`}>
                        {result.homeScore}
                      </span>
                      <span className="font-medium">-</span>
                      <span className={`px-3 py-1 rounded-md font-bold ${getResultColor(result.homeTeam, result.homeScore, result.awayScore)}`}>
                        {result.awayScore}
                      </span>
                    </div>
                    
                    <div className="flex-1 text-right font-medium">
                      {formatTeamName(result.awayTeam)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Upcoming Fixtures Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
            <div className="bg-navy-800 text-white p-4 text-center">
              <h3 className="text-xl font-semibold flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Upcoming Fixtures
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {fixtures.slice(0, 4).map((fixture, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div className="text-sm text-gray-600 mb-2">
                    {fixture.date} | {fixture.time} | {fixture.venue} | {fixture.competition}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex-1 font-medium">
                      {formatTeamName(fixture.homeTeam)}
                    </div>
                    
                    <div className="flex items-center justify-center mx-2">
                      <span className="px-3 py-1 rounded-md bg-blue-100 text-blue-800 font-medium">
                        VS
                      </span>
                    </div>
                    
                    <div className="flex-1 text-right font-medium">
                      {formatTeamName(fixture.awayTeam)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Highland League Table Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
            <div className="bg-navy-800 text-white p-4 text-center">
              <h3 className="text-xl font-semibold flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                </svg>
                Highland League
              </h3>
            </div>
            <div className="p-4">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2 px-1 w-10">Pos</th>
                    <th className="py-2 px-1">Team</th>
                    <th className="py-2 px-1 text-center w-10">P</th>
                    <th className="py-2 px-1 text-center w-10">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {leagueTable.slice(0, 6).map((item) => (
                    <tr 
                      key={item.position} 
                      className={`border-b last:border-b-0 ${item.isBanksODee ? 'bg-blue-50' : ''}`}
                    >
                      <td className="py-2 px-1 text-center">{item.position}</td>
                      <td className="py-2 px-1 font-medium">
                        {item.isBanksODee ? (
                          <div className="flex items-center">
                            <span className="mr-1">▶</span>
                            {item.team}
                          </div>
                        ) : item.team}
                      </td>
                      <td className="py-2 px-1 text-center">{item.played}</td>
                      <td className="py-2 px-1 text-center font-bold">{item.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="mt-4 text-center">
                <Link to="/league-table" className="text-navy-700 hover:text-navy-900 font-medium">
                  View Full Table
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixturesSection;

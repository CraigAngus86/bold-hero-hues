
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Trophy, Calendar, TrendingUp, Shield, Info } from 'lucide-react';

interface TeamStats {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[];
  lastResult?: {
    opponent: string;
    result: 'W' | 'D' | 'L';
    score: string;
  };
}

// Full mock data for the league table
const mockLeagueData: TeamStats[] = [
  {
    position: 1,
    team: "Buckie Thistle",
    played: 10,
    won: 8,
    drawn: 1,
    lost: 1,
    goalsFor: 24,
    goalsAgainst: 8,
    goalDifference: 16,
    points: 25,
    form: ["W", "W", "W", "D", "W"],
    lastResult: {
      opponent: "Formartine United",
      result: "W",
      score: "3-1"
    }
  },
  {
    position: 2,
    team: "Brechin City",
    played: 10,
    won: 8,
    drawn: 0,
    lost: 2,
    goalsFor: 20,
    goalsAgainst: 7,
    goalDifference: 13,
    points: 24,
    form: ["W", "W", "W", "L", "W"],
    lastResult: {
      opponent: "Huntly",
      result: "W",
      score: "2-0"
    }
  },
  {
    position: 3,
    team: "Banks o' Dee",
    played: 10,
    won: 7,
    drawn: 2,
    lost: 1,
    goalsFor: 22,
    goalsAgainst: 10,
    goalDifference: 12,
    points: 23,
    form: ["W", "D", "W", "W", "D"],
    lastResult: {
      opponent: "Formartine United",
      result: "W",
      score: "3-1"
    }
  },
  {
    position: 4,
    team: "Fraserburgh",
    played: 10,
    won: 7,
    drawn: 1,
    lost: 2,
    goalsFor: 21,
    goalsAgainst: 11,
    goalDifference: 10,
    points: 22,
    form: ["L", "W", "W", "W", "W"],
    lastResult: {
      opponent: "Wick Academy",
      result: "W",
      score: "2-0"
    }
  },
  {
    position: 5,
    team: "Formartine United",
    played: 10,
    won: 6,
    drawn: 1,
    lost: 3,
    goalsFor: 18,
    goalsAgainst: 12,
    goalDifference: 6,
    points: 19,
    form: ["W", "W", "L", "W", "L"],
    lastResult: {
      opponent: "Buckie Thistle",
      result: "L",
      score: "1-3"
    }
  },
  {
    position: 6,
    team: "Huntly",
    played: 10,
    won: 5,
    drawn: 2,
    lost: 3,
    goalsFor: 15,
    goalsAgainst: 10,
    goalDifference: 5,
    points: 17,
    form: ["D", "W", "L", "W", "D"],
    lastResult: {
      opponent: "Brechin City",
      result: "L",
      score: "0-2"
    }
  },
  {
    position: 7,
    team: "Rothes",
    played: 10,
    won: 5,
    drawn: 1,
    lost: 4,
    goalsFor: 14,
    goalsAgainst: 12,
    goalDifference: 2,
    points: 16,
    form: ["W", "L", "W", "D", "L"],
    lastResult: {
      opponent: "Nairn County",
      result: "L",
      score: "1-2"
    }
  },
  {
    position: 8,
    team: "Nairn County",
    played: 10,
    won: 4,
    drawn: 3,
    lost: 3,
    goalsFor: 16,
    goalsAgainst: 15,
    goalDifference: 1,
    points: 15,
    form: ["D", "D", "W", "L", "W"],
    lastResult: {
      opponent: "Rothes",
      result: "W",
      score: "2-1"
    }
  },
  {
    position: 9,
    team: "Keith",
    played: 10,
    won: 4,
    drawn: 2,
    lost: 4,
    goalsFor: 13,
    goalsAgainst: 16,
    goalDifference: -3,
    points: 14,
    form: ["W", "L", "D", "W", "L"],
    lastResult: {
      opponent: "Lossiemouth",
      result: "L",
      score: "1-2"
    }
  },
  {
    position: 10,
    team: "Wick Academy",
    played: 10,
    won: 4,
    drawn: 1,
    lost: 5,
    goalsFor: 12,
    goalsAgainst: 13,
    goalDifference: -1,
    points: 13,
    form: ["L", "W", "W", "L", "L"],
    lastResult: {
      opponent: "Fraserburgh",
      result: "L",
      score: "0-2"
    }
  },
  {
    position: 11,
    team: "Lossiemouth",
    played: 10,
    won: 3,
    drawn: 2,
    lost: 5,
    goalsFor: 10,
    goalsAgainst: 15,
    goalDifference: -5,
    points: 11,
    form: ["D", "L", "L", "D", "W"],
    lastResult: {
      opponent: "Keith",
      result: "W",
      score: "2-1"
    }
  },
  {
    position: 12,
    team: "Turriff United",
    played: 10,
    won: 2,
    drawn: 3,
    lost: 5,
    goalsFor: 9,
    goalsAgainst: 14,
    goalDifference: -5,
    points: 9,
    form: ["L", "D", "L", "D", "D"],
    lastResult: {
      opponent: "Deveronvale",
      result: "D",
      score: "1-1"
    }
  },
  {
    position: 13,
    team: "Deveronvale",
    played: 10,
    won: 2,
    drawn: 2,
    lost: 6,
    goalsFor: 8,
    goalsAgainst: 17,
    goalDifference: -9,
    points: 8,
    form: ["L", "W", "L", "L", "D"],
    lastResult: {
      opponent: "Turriff United",
      result: "D",
      score: "1-1"
    }
  },
  {
    position: 14,
    team: "Clachnacuddin",
    played: 10,
    won: 1,
    drawn: 3,
    lost: 6,
    goalsFor: 7,
    goalsAgainst: 19,
    goalDifference: -12,
    points: 6,
    form: ["L", "D", "L", "L", "D"],
    lastResult: {
      opponent: "Strathspey Thistle",
      result: "D",
      score: "1-1"
    }
  },
  {
    position: 15,
    team: "Forres Mechanics",
    played: 10,
    won: 1,
    drawn: 2,
    lost: 7,
    goalsFor: 6,
    goalsAgainst: 18,
    goalDifference: -12,
    points: 5,
    form: ["L", "L", "D", "L", "L"],
    lastResult: {
      opponent: "Brora Rangers",
      result: "L",
      score: "0-3"
    }
  },
  {
    position: 16,
    team: "Strathspey Thistle",
    played: 10,
    won: 0,
    drawn: 4,
    lost: 6,
    goalsFor: 5,
    goalsAgainst: 20,
    goalDifference: -15,
    points: 4,
    form: ["D", "L", "L", "L", "D"],
    lastResult: {
      opponent: "Clachnacuddin",
      result: "D",
      score: "1-1"
    }
  },
  {
    position: 17,
    team: "Brora Rangers",
    played: 10,
    won: 3,
    drawn: 3,
    lost: 4,
    goalsFor: 13,
    goalsAgainst: 12,
    goalDifference: 1,
    points: 12,
    form: ["W", "D", "L", "L", "W"],
    lastResult: {
      opponent: "Forres Mechanics",
      result: "W",
      score: "3-0"
    }
  }
];

// Form indicator component
const FormIndicator = ({ result }: { result: string }) => {
  const getColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-green-500';
      case 'D': return 'bg-yellow-500';
      case 'L': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };
  
  return (
    <span className={`${getColor(result)} text-white text-xs font-bold w-5 h-5 inline-flex items-center justify-center rounded-full`}>
      {result}
    </span>
  );
};

const positionIndicator = (position: number) => {
  if (position <= 3) return "text-team-blue font-bold";
  return "";
};

const LeagueTablePage = () => {
  const [leagueData, setLeagueData] = useState<TeamStats[]>([]);
  
  // In a real app, this would fetch from an API
  useEffect(() => {
    // Sort by position
    const sortedData = [...mockLeagueData].sort((a, b) => a.position - b.position);
    setLeagueData(sortedData);
  }, []);
  
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
            <h1 className="text-4xl md:text-5xl font-bold text-team-blue mb-4">Highland League Table</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Current standings for the 2023-24 Scottish Highland Football League.
            </p>
          </motion.div>
          
          {/* Table Key/Legend */}
          <div className="mb-6 flex flex-wrap gap-3 justify-center">
            <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm text-xs">
              <div className="w-3 h-3 bg-team-blue rounded-full mr-1"></div>
              <span>Title Contenders</span>
            </div>
            <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm text-xs">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              <span>Win</span>
            </div>
            <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm text-xs">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
              <span>Draw</span>
            </div>
            <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm text-xs">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
              <span>Loss</span>
            </div>
          </div>
          
          {/* League Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div className="bg-white shadow-sm rounded-lg p-4 flex items-center">
              <Trophy className="w-10 h-10 text-team-blue mr-4" />
              <div>
                <p className="text-xs text-gray-500">Current Leaders</p>
                <p className="font-bold text-lg">{leagueData[0]?.team || "Buckie Thistle"}</p>
              </div>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-4 flex items-center">
              <Calendar className="w-10 h-10 text-team-blue mr-4" />
              <div>
                <p className="text-xs text-gray-500">Season</p>
                <p className="font-bold text-lg">2023-24</p>
              </div>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-4 flex items-center">
              <TrendingUp className="w-10 h-10 text-team-blue mr-4" />
              <div>
                <p className="text-xs text-gray-500">Our Position</p>
                <p className="font-bold text-lg">
                  {leagueData.find(t => t.team === "Banks o' Dee")?.position || 3}
                  <span className="text-xs text-gray-500 ml-1">/ 17</span>
                </p>
              </div>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-4 flex items-center">
              <Shield className="w-10 h-10 text-team-blue mr-4" />
              <div>
                <p className="text-xs text-gray-500">Our Form</p>
                <div className="flex items-center space-x-1 mt-1">
                  {leagueData.find(t => t.team === "Banks o' Dee")?.form.map((result, idx) => (
                    <FormIndicator key={idx} result={result} />
                  )) || Array(5).fill("").map((_, idx) => (
                    <FormIndicator key={idx} result={idx % 2 === 0 ? "W" : "D"} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Main League Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md overflow-hidden mb-10"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-team-blue text-white">
                  <TableRow>
                    <TableHead className="text-white w-12">Pos</TableHead>
                    <TableHead className="text-white text-left">Team</TableHead>
                    <TableHead className="text-white text-center w-12">P</TableHead>
                    <TableHead className="text-white text-center w-12">W</TableHead>
                    <TableHead className="text-white text-center w-12">D</TableHead>
                    <TableHead className="text-white text-center w-12">L</TableHead>
                    <TableHead className="text-white text-center w-12">GF</TableHead>
                    <TableHead className="text-white text-center w-12">GA</TableHead>
                    <TableHead className="text-white text-center w-12">GD</TableHead>
                    <TableHead className="text-white text-center w-12">Pts</TableHead>
                    <TableHead className="text-white text-center">Last 5</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leagueData.map((team) => (
                    <TableRow 
                      key={team.position}
                      className={team.team === "Banks o' Dee" ? "bg-team-lightBlue/30" : ""}
                    >
                      <TableCell className={`font-medium text-center ${positionIndicator(team.position)}`}>
                        {team.position}
                      </TableCell>
                      <TableCell className="font-medium">
                        {team.team}
                      </TableCell>
                      <TableCell className="text-center">{team.played}</TableCell>
                      <TableCell className="text-center">{team.won}</TableCell>
                      <TableCell className="text-center">{team.drawn}</TableCell>
                      <TableCell className="text-center">{team.lost}</TableCell>
                      <TableCell className="text-center">{team.goalsFor}</TableCell>
                      <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                      <TableCell className="text-center">{team.goalDifference}</TableCell>
                      <TableCell className="text-center font-bold">{team.points}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-1">
                          {team.form.map((result, idx) => (
                            <FormIndicator key={idx} result={result} />
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
          
          {/* League Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center mb-4">
              <Info className="w-5 h-5 text-team-blue mr-2" />
              <h2 className="text-xl font-bold text-team-blue">About the Highland League</h2>
            </div>
            <p className="text-gray-600 mb-4">
              The Scottish Highland Football League is a senior football league in Scotland, 
              catering for teams in the northern parts of the country. The league currently 
              consists of 17 teams and sits at level 5 in the Scottish football league system, 
              below the SPFL League Two.
            </p>
            <p className="text-gray-600 mb-4">
              Since the 2014–15 season, the Highland League champions have played against the 
              Lowland League champions for a chance to play against the bottom club in League Two, 
              with the winner earning a place in the SPFL.
            </p>
            <div className="mt-6">
              <h3 className="font-bold text-gray-700 mb-2">Key Dates</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-team-blue rounded-full mr-2 mt-2"></span>
                  <span>Season started: July 29, 2023</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-team-blue rounded-full mr-2 mt-2"></span>
                  <span>Projected end date: April 27, 2024</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-team-blue rounded-full mr-2 mt-2"></span>
                  <span>Play-off dates: May 2024</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LeagueTablePage;

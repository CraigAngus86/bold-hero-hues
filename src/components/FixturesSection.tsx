
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

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

// Mock data for the league table
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
    form: ["W", "W", "W", "D", "W"]
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
    form: ["W", "W", "W", "L", "W"]
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
    form: ["W", "D", "W", "W", "D"]
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
    form: ["L", "W", "W", "W", "W"]
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
    form: ["W", "W", "L", "W", "L"]
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
    form: ["D", "W", "L", "W", "D"]
  }
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

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

const FixturesSection = () => {
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [leagueData, setLeagueData] = useState<TeamStats[]>([]);
  
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
    setLeagueData(mockLeagueData);
  }, []);

  return (
    <section className="py-10 bg-team-gray">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-team-blue mb-8 text-center">Fixtures, Results & Table</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Results Card */}
          <Card className="overflow-hidden border-team-gray hover:shadow-md transition-shadow bg-white">
            <div className="bg-team-blue text-white font-medium p-3 flex items-center justify-center">
              <Clock className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">Recent Results</h3>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                {recentMatches.map((match) => (
                  <div key={match.id} className="p-2 border-b border-gray-100 last:border-0">
                    <div className="text-xs text-team-blue font-medium mb-1">
                      {match.competition} • {formatDate(match.date)}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${match.homeTeam === "Banks o' Dee" ? "text-team-blue" : ""}`}>
                        {match.homeTeam}
                      </span>
                      <div className="flex items-center justify-center space-x-1 font-bold">
                        <span className="w-6 h-6 flex items-center justify-center bg-team-lightBlue rounded-sm">{match.homeScore}</span>
                        <span className="text-xs">-</span>
                        <span className="w-6 h-6 flex items-center justify-center bg-team-lightBlue rounded-sm">{match.awayScore}</span>
                      </div>
                      <span className={`font-medium ${match.awayTeam === "Banks o' Dee" ? "text-team-blue" : ""}`}>
                        {match.awayTeam}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-center">
                <a 
                  href="/fixtures" 
                  className="inline-block px-4 py-2 bg-team-lightBlue text-team-blue text-sm font-medium rounded hover:bg-team-blue hover:text-white transition-colors"
                >
                  All Results
                </a>
              </div>
            </CardContent>
          </Card>
          
          {/* Upcoming Fixtures Card */}
          <Card className="overflow-hidden border-team-gray hover:shadow-md transition-shadow bg-white">
            <div className="bg-team-blue text-white font-medium p-3 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">Upcoming Fixtures</h3>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="p-2 border-b border-gray-100 last:border-0">
                    <div className="text-xs text-team-blue font-medium mb-1">
                      {match.competition} • {formatDate(match.date)} • {match.time}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${match.homeTeam === "Banks o' Dee" ? "text-team-blue" : ""}`}>
                        {match.homeTeam}
                      </span>
                      <span className="font-bold text-xs">VS</span>
                      <span className={`font-medium ${match.awayTeam === "Banks o' Dee" ? "text-team-blue" : ""}`}>
                        {match.awayTeam}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 text-center">
                      {match.venue}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-center">
                <a 
                  href="/fixtures" 
                  className="inline-block px-4 py-2 bg-team-lightBlue text-team-blue text-sm font-medium rounded hover:bg-team-blue hover:text-white transition-colors"
                >
                  All Fixtures
                </a>
              </div>
            </CardContent>
          </Card>
          
          {/* League Table Card */}
          <Card className="overflow-hidden border-team-gray hover:shadow-md transition-shadow bg-white">
            <div className="bg-team-blue text-white font-medium p-3 flex items-center justify-center">
              <Trophy className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">Highland League</h3>
            </div>
            <CardContent className="p-4">
              <div className="text-xs">
                <Table>
                  <TableHeader className="bg-team-lightBlue">
                    <TableRow>
                      <TableHead className="py-2 text-team-blue">Pos</TableHead>
                      <TableHead className="text-team-blue text-left">Team</TableHead>
                      <TableHead className="text-team-blue text-center">P</TableHead>
                      <TableHead className="text-team-blue text-center">Pts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leagueData.map((team) => (
                      <TableRow 
                        key={team.position}
                        className={team.team === "Banks o' Dee" ? "bg-team-lightBlue/30" : ""}
                      >
                        <TableCell className="py-1 font-medium text-center">{team.position}</TableCell>
                        <TableCell className="py-1 font-medium">{team.team}</TableCell>
                        <TableCell className="py-1 text-center">{team.played}</TableCell>
                        <TableCell className="py-1 text-center font-bold">{team.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-3 text-center">
                <a 
                  href="/table" 
                  className="inline-block px-4 py-2 bg-team-lightBlue text-team-blue text-sm font-medium rounded hover:bg-team-blue hover:text-white transition-colors"
                >
                  Full Table
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FixturesSection;

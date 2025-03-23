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
  logo: string;
}

const mockMatches: Match[] = [
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
    logo: "https://placehold.co/40x40/team-white/team-blue?text=BT"
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
    logo: "https://placehold.co/40x40/team-white/team-blue?text=BC"
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
    logo: "/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png"
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
    logo: "https://placehold.co/40x40/team-white/team-blue?text=FR"
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
    logo: "https://placehold.co/40x40/team-white/team-blue?text=FU"
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
    logo: "https://placehold.co/40x40/team-white/team-blue?text=HU"
  }
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

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
  
  useEffect(() => {
    const recent = mockMatches
      .filter(match => match.isCompleted)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
    
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
        <h2 className="text-3xl font-bold text-[#00105a] mb-8 text-center">Fixtures, Results & Table</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="overflow-hidden border-team-gray hover:shadow-md transition-shadow bg-white flex flex-col h-full">
            <div className="bg-[#00105a] text-white font-medium p-3 flex items-center justify-center">
              <Clock className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">Recent Results</h3>
            </div>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="space-y-4 flex-1">
                {recentMatches.map((match) => (
                  <div key={match.id} className="p-3 border-b border-gray-100 last:border-0">
                    <div className="text-xs text-[#00105a] font-medium mb-2">
                      {match.competition} • {formatDate(match.date)}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium w-[40%] text-right ${match.homeTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
                        {match.homeTeam}
                      </span>
                      <div className="flex items-center justify-center space-x-2 font-bold w-[20%]">
                        <span className="w-8 h-8 flex items-center justify-center bg-team-lightBlue rounded-sm">{match.homeScore}</span>
                        <span className="text-xs">-</span>
                        <span className="w-8 h-8 flex items-center justify-center bg-team-lightBlue rounded-sm">{match.awayScore}</span>
                      </div>
                      <span className={`font-medium w-[40%] text-left ${match.awayTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
                        {match.awayTeam}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      {match.venue}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a 
                  href="/fixtures" 
                  className="inline-block px-4 py-2 bg-team-lightBlue text-[#00105a] text-sm font-medium rounded hover:bg-[#00105a] hover:text-white transition-colors w-full"
                >
                  All Results
                </a>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-team-gray hover:shadow-md transition-shadow bg-white flex flex-col h-full">
            <div className="bg-[#00105a] text-white font-medium p-3 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">Upcoming Fixtures</h3>
            </div>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="space-y-4 flex-1">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="p-3 border-b border-gray-100 last:border-0">
                    <div className="text-xs text-[#00105a] font-medium mb-2">
                      {match.competition} • {formatDate(match.date)} • {match.time}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium w-[40%] text-right ${match.homeTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
                        {match.homeTeam}
                      </span>
                      <span className="font-bold text-xs w-[20%] text-center">VS</span>
                      <span className={`font-medium w-[40%] text-left ${match.awayTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
                        {match.awayTeam}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      {match.venue}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a 
                  href="/fixtures" 
                  className="inline-block px-4 py-2 bg-team-lightBlue text-[#00105a] text-sm font-medium rounded hover:bg-[#00105a] hover:text-white transition-colors w-full"
                >
                  All Fixtures
                </a>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-team-gray hover:shadow-md transition-shadow bg-white flex flex-col h-full">
            <div className="bg-[#00105a] text-white font-medium p-3 flex items-center justify-center">
              <Trophy className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">Highland League</h3>
            </div>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="text-xs flex-1">
                <Table>
                  <TableHeader className="bg-team-lightBlue">
                    <TableRow>
                      <TableHead className="py-2 text-[#00105a]">Pos</TableHead>
                      <TableHead className="text-[#00105a] text-left">Team</TableHead>
                      <TableHead className="text-[#00105a] text-center">P</TableHead>
                      <TableHead className="text-[#00105a] text-center">Pts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leagueData.map((team) => (
                      <TableRow 
                        key={team.position}
                        className={team.team === "Banks o' Dee" ? "bg-team-lightBlue/30" : ""}
                      >
                        <TableCell className="py-2 font-medium text-center">{team.position}</TableCell>
                        <TableCell className="py-2 font-medium">
                          <div className="flex items-center space-x-2">
                            <img 
                              src={team.logo} 
                              alt={`${team.team} logo`}
                              className="w-6 h-6 object-contain"
                            />
                            <span>{team.team}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-center">{team.played}</TableCell>
                        <TableCell className="py-2 text-center font-bold">{team.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 text-center">
                <a 
                  href="/table" 
                  className="inline-block px-4 py-2 bg-team-lightBlue text-[#00105a] text-sm font-medium rounded hover:bg-[#00105a] hover:text-white transition-colors w-full"
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


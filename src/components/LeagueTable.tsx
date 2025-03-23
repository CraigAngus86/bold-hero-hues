
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

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

const LeagueTable = () => {
  const [leagueData, setLeagueData] = useState<TeamStats[]>([]);
  
  // In a real app, this would fetch from an API
  useEffect(() => {
    setLeagueData(mockLeagueData);
  }, []);
  
  return (
    <section className="py-12 bg-team-gray">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-team-blue mb-4 md:mb-0">Highland League Table</h2>
          <a 
            href="/table" 
            className="px-5 py-2 bg-team-blue text-white rounded-md hover:bg-team-navy transition-colors text-sm font-medium"
          >
            View Full Table
          </a>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
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
                  <TableHead className="text-white text-center">Form</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leagueData.map((team) => (
                  <TableRow 
                    key={team.position}
                    className={team.team === "Banks o' Dee" ? "bg-team-lightBlue/30" : ""}
                  >
                    <TableCell className="font-medium text-center">{team.position}</TableCell>
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
      </div>
    </section>
  );
};

export default LeagueTable;

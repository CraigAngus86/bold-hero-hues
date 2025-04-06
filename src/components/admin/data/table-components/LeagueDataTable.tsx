
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TeamStats } from '@/types';

interface LeagueDataTableProps {
  leagueTable: TeamStats[];
}

const LeagueDataTable: React.FC<LeagueDataTableProps> = ({ leagueTable }) => {
  if (!leagueTable || leagueTable.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-muted-foreground">No league data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-10 text-center">Pos</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">P</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">D</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-center">GF</TableHead>
            <TableHead className="text-center">GA</TableHead>
            <TableHead className="text-center">GD</TableHead>
            <TableHead className="text-center">Pts</TableHead>
            <TableHead className="text-center">Form</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leagueTable.map((team) => (
            <TableRow key={team.id || team.team}>
              <TableCell className="font-medium text-center">{team.position}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {team.logo && (
                    <img
                      src={team.logo}
                      alt={`${team.team} logo`}
                      className="h-6 w-6 object-contain"
                    />
                  )}
                  <span>{team.team}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">{team.played}</TableCell>
              <TableCell className="text-center">{team.won}</TableCell>
              <TableCell className="text-center">{team.drawn}</TableCell>
              <TableCell className="text-center">{team.lost}</TableCell>
              <TableCell className="text-center">{team.goalsFor}</TableCell>
              <TableCell className="text-center">{team.goalsAgainst}</TableCell>
              <TableCell className="text-center">
                {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
              </TableCell>
              <TableCell className="text-center font-semibold">{team.points}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-1">
                  {team.form?.map((result, idx) => {
                    let bg = "bg-gray-200";
                    if (result === "W") bg = "bg-green-500 text-white";
                    if (result === "L") bg = "bg-red-500 text-white";
                    if (result === "D") bg = "bg-yellow-500 text-white";
                    
                    return (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className={`h-5 min-w-5 p-0 flex items-center justify-center ${bg}`}
                      >
                        {result}
                      </Badge>
                    );
                  })}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeagueDataTable;

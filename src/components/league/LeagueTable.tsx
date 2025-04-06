
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TeamStats } from '@/types/fixtures';

interface LeagueTableProps {
  teams: TeamStats[];
  simplified?: boolean;
}

export const LeagueTable: React.FC<LeagueTableProps> = ({ teams, simplified = false }) => {
  if (!teams || teams.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No league table data available
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">Pos</TableHead>
            <TableHead>Team</TableHead>
            {!simplified && (
              <>
                <TableHead className="text-center">P</TableHead>
                <TableHead className="text-center">W</TableHead>
                <TableHead className="text-center">D</TableHead>
                <TableHead className="text-center">L</TableHead>
                <TableHead className="text-center">GF</TableHead>
                <TableHead className="text-center">GA</TableHead>
              </>
            )}
            <TableHead className="text-center">GD</TableHead>
            <TableHead className="text-center">Pts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={String(team.id)} className={team.team === "Banks o' Dee" ? "bg-blue-50" : undefined}>
              <TableCell className="font-medium">{team.position}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {team.logo && (
                    <img 
                      src={team.logo} 
                      alt={`${team.team} logo`} 
                      className="w-5 h-5 mr-2 object-contain"
                    />
                  )}
                  {team.team}
                </div>
              </TableCell>
              {!simplified && (
                <>
                  <TableCell className="text-center">{team.played}</TableCell>
                  <TableCell className="text-center">{team.won}</TableCell>
                  <TableCell className="text-center">{team.drawn}</TableCell>
                  <TableCell className="text-center">{team.lost}</TableCell>
                  <TableCell className="text-center">{team.goalsFor}</TableCell>
                  <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                </>
              )}
              <TableCell className="text-center">{team.goalDifference}</TableCell>
              <TableCell className="text-center font-bold">{team.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeagueTable;

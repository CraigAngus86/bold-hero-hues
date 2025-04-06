
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TeamStats } from '@/components/league/types';

interface LeagueDataTableProps {
  leagueTable: TeamStats[];
}

const LeagueDataTable: React.FC<LeagueDataTableProps> = ({ leagueTable }) => {
  // Helper function to determine if a team is in a promotion position
  const isPromotionPosition = (position: number) => position <= 1;
  
  // Helper function to determine if a team is in a relegation position
  const isRelegationPosition = (position: number, totalTeams: number) => 
    position >= totalTeams - 1;
  
  // Helper function to format form data
  const renderFormBadges = (form: string[] | undefined) => {
    if (!form || form.length === 0) return <span className="text-gray-400">-</span>;
    
    return (
      <div className="flex gap-1">
        {form.map((result, index) => (
          <Badge 
            key={`form-${index}`}
            variant={
              result === 'W' ? 'success' : 
              result === 'D' ? 'warning' : 
              'destructive'
            } 
            className="h-6 w-6 flex items-center justify-center p-0 rounded-full"
          >
            {result}
          </Badge>
        ))}
      </div>
    );
  };
  
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12 text-center">Pos</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">P</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">D</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-center">GF</TableHead>
            <TableHead className="text-center">GA</TableHead>
            <TableHead className="text-center">GD</TableHead>
            <TableHead className="text-center">Pts</TableHead>
            <TableHead>Form</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leagueTable.map((team) => (
            <TableRow 
              key={team.id || team.team}
              className={
                team.team === "Banks o' Dee" ? "bg-team-blue/10" : 
                isPromotionPosition(team.position) ? "bg-green-50" :
                isRelegationPosition(team.position, leagueTable.length) ? "bg-red-50" :
                ""
              }
            >
              <TableCell className="text-center font-semibold">
                {team.position}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {team.logo && (
                    <img 
                      src={team.logo} 
                      alt={`${team.team} logo`}
                      className="h-5 w-5 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <span className={team.team === "Banks o' Dee" ? "font-bold" : ""}>
                    {team.team}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">{team.played}</TableCell>
              <TableCell className="text-center">{team.won}</TableCell>
              <TableCell className="text-center">{team.drawn}</TableCell>
              <TableCell className="text-center">{team.lost}</TableCell>
              <TableCell className="text-center">{team.goalsFor}</TableCell>
              <TableCell className="text-center">{team.goalsAgainst}</TableCell>
              <TableCell className="text-center font-medium">
                {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
              </TableCell>
              <TableCell className="text-center font-bold">{team.points}</TableCell>
              <TableCell>{renderFormBadges(team.form)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeagueDataTable;

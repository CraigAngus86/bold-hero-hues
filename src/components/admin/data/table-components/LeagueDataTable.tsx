
import React from 'react';
import { TeamStats } from '@/components/league/types';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface LeagueDataTableProps {
  leagueTable: TeamStats[];
}

const LeagueDataTable = ({ leagueTable }: LeagueDataTableProps) => {
  // Function to determine position badge based on position
  const getPositionBadge = (position: number) => {
    if (position === 1) {
      return (
        <Badge variant="success" className="w-6 h-6 rounded-full flex items-center justify-center p-0">
          {position}
        </Badge>
      );
    } else if (position >= 2 && position <= 3) {
      return (
        <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center p-0">
          {position}
        </Badge>
      );
    } else if (position >= 14) {
      return (
        <Badge variant="destructive" className="w-6 h-6 rounded-full flex items-center justify-center p-0">
          {position}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center p-0">
          {position}
        </Badge>
      );
    }
  };

  // Function to render form icons
  const renderForm = (form: string[]) => {
    if (!form || form.length === 0) return null;
    
    return (
      <div className="flex gap-1">
        {form.map((result, index) => {
          let bgColor = "bg-gray-200";
          if (result === "W") bgColor = "bg-green-500";
          else if (result === "D") bgColor = "bg-amber-400";
          else if (result === "L") bgColor = "bg-red-500";
          
          return (
            <div 
              key={index} 
              className={`${bgColor} text-white w-5 h-5 flex items-center justify-center text-xs font-bold rounded-sm`}
            >
              {result}
            </div>
          );
        })}
      </div>
    );
  };

  // Check if team is Banks o' Dee for highlighting
  const isTeamBanksODee = (teamName: string) => {
    return teamName.toLowerCase().includes('banks o\' dee');
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Pos</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">P</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">D</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-center">GF</TableHead>
            <TableHead className="text-center">GA</TableHead>
            <TableHead className="text-center">GD</TableHead>
            <TableHead className="text-center">Pts</TableHead>
            <TableHead className="text-center hidden md:table-cell">Form</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leagueTable.map((team) => (
            <TableRow 
              key={team.id} 
              className={isTeamBanksODee(team.team) ? 'bg-blue-50 hover:bg-blue-100' : ''}
            >
              <TableCell className="text-center">
                {getPositionBadge(team.position)}
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {team.logo && (
                    <img 
                      src={team.logo} 
                      alt={`${team.team} logo`} 
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <span className={isTeamBanksODee(team.team) ? 'font-bold text-team-blue' : ''}>
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
              <TableCell className="text-center">
                {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
              </TableCell>
              <TableCell className="text-center font-bold">{team.points}</TableCell>
              <TableCell className="text-center hidden md:table-cell">
                {renderForm(team.form || [])}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeagueDataTable;

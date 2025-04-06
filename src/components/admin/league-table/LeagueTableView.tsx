
import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/badge";
import { TeamStats } from '@/components/league/types';
import FormIndicator from '@/components/league/FormIndicator';

interface LeagueTableViewProps {
  leagueData: TeamStats[];
  isLoading: boolean;
  highlightTeam?: string;
}

const LeagueTableView: React.FC<LeagueTableViewProps> = ({
  leagueData,
  isLoading,
  highlightTeam
}) => {
  // Define promotion and relegation positions
  const isPromotion = (position: number) => position <= 1;
  const isRelegation = (position: number, total: number) => position >= total - 1;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-team-blue"></div>
      </div>
    );
  }
  
  if (!leagueData || leagueData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No league table data available.</p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-16">Pos</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="w-14 text-center">P</TableHead>
            <TableHead className="w-14 text-center">W</TableHead>
            <TableHead className="w-14 text-center">D</TableHead>
            <TableHead className="w-14 text-center">L</TableHead>
            <TableHead className="w-14 text-center">GF</TableHead>
            <TableHead className="w-14 text-center">GA</TableHead>
            <TableHead className="w-14 text-center">GD</TableHead>
            <TableHead className="w-14 text-center">Pts</TableHead>
            <TableHead className="w-28">Form</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leagueData.map((team, index) => {
            const isHighlighted = team.team === highlightTeam;
            const isPromotionTeam = isPromotion(team.position);
            const isRelegationTeam = isRelegation(team.position, leagueData.length);
            
            return (
              <TableRow 
                key={index} 
                className={isHighlighted ? 'bg-blue-50' : ''}
              >
                <TableCell className={`font-medium ${isPromotionTeam ? 'text-green-600' : isRelegationTeam ? 'text-red-600' : ''}`}>
                  {team.position}
                  {isPromotionTeam && (
                    <Badge variant="outline" className="ml-1.5 bg-green-50 text-green-700 border-green-200 text-xs">P</Badge>
                  )}
                  {isRelegationTeam && (
                    <Badge variant="outline" className="ml-1.5 bg-red-50 text-red-700 border-red-200 text-xs">R</Badge>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {team.logo && (
                      <img 
                        src={team.logo} 
                        alt={`${team.team} logo`} 
                        className="h-5 w-5 object-contain mr-2"
                      />
                    )}
                    {isHighlighted ? <strong>{team.team}</strong> : team.team}
                  </div>
                </TableCell>
                <TableCell className="text-center">{team.played}</TableCell>
                <TableCell className="text-center">{team.won}</TableCell>
                <TableCell className="text-center">{team.drawn}</TableCell>
                <TableCell className="text-center">{team.lost}</TableCell>
                <TableCell className="text-center">{team.goalsFor}</TableCell>
                <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                <TableCell className="text-center">{team.goalDifference}</TableCell>
                <TableCell className="text-center font-semibold">{team.points}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {team.form && team.form.map((result, i) => (
                      <FormIndicator key={i} result={result} />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeagueTableView;


import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamStats } from '@/components/league/types';

interface LeagueTableViewProps {
  leagueData: TeamStats[];
  isLoading: boolean;
  highlightTeam?: string;
}

const LeagueTableView: React.FC<LeagueTableViewProps> = ({ 
  leagueData,
  isLoading,
  highlightTeam = "Banks o' Dee"
}) => {
  // Helper function to render form badges
  const renderForm = (form?: string[]) => {
    if (!form || !form.length) {
      return <span className="text-gray-400">No form data</span>;
    }
    
    return (
      <div className="flex gap-1">
        {form.map((result, i) => (
          <Badge 
            key={i}
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
  
  // Function to determine row styling based on position
  const getRowClasses = (team: TeamStats, index: number) => {
    const isHighlighted = team.team === highlightTeam;
    const isPromotion = team.position === 1;
    const isRelegation = index === leagueData.length - 1;
    
    if (isHighlighted) return "bg-team-blue/10 font-medium";
    if (isPromotion) return "bg-green-50";
    if (isRelegation) return "bg-red-50";
    return "";
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Pos</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-center">P</TableHead>
              <TableHead className="text-center">W</TableHead>
              <TableHead className="text-center">D</TableHead>
              <TableHead className="text-center">L</TableHead>
              <TableHead className="text-center">F</TableHead>
              <TableHead className="text-center">A</TableHead>
              <TableHead className="text-center">GD</TableHead>
              <TableHead className="text-center">Pts</TableHead>
              <TableHead>Form</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 12 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-5 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-5 w-5 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-5 w-5 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-5 w-5 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-5 w-5 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-5 w-5 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-5 w-5 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-5 w-5 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  
  // Empty state
  if (leagueData.length === 0) {
    return (
      <div className="rounded-md border p-6 text-center">
        <p className="text-gray-500">No league data available.</p>
      </div>
    );
  }
  
  // Render table with data
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12 text-center">Pos</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">P</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">D</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-center">F</TableHead>
            <TableHead className="text-center">A</TableHead>
            <TableHead className="text-center">GD</TableHead>
            <TableHead className="text-center">Pts</TableHead>
            <TableHead>Form</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leagueData.map((team, index) => (
            <TableRow 
              key={team.id || team.team} 
              className={getRowClasses(team, index)}
            >
              <TableCell className="text-center font-semibold">{team.position}</TableCell>
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
                  <span className={team.team === highlightTeam ? "font-bold" : ""}>
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
              <TableCell>{renderForm(team.form)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-2 text-xs text-gray-500 border-t">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-50 border"></div>
          <span>Promotion position</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-50 border"></div>
          <span>Relegation position</span>
        </div>
      </div>
    </div>
  );
};

export default LeagueTableView;

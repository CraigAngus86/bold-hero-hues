
import React from 'react';
import { TeamStats } from '@/components/league/types';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface LeagueTableViewProps {
  leagueTable: TeamStats[];
}

const LeagueTableView: React.FC<LeagueTableViewProps> = ({ leagueTable }) => {
  // Function to determine position badge based on position
  const getPositionBadge = (position: number, teamCount: number) => {
    if (position === 1) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="success" className="w-6 h-6 rounded-full flex items-center justify-center p-0">
                {position}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Champion</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (position <= 2) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center p-0">
                {position}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Promotion Position</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (position <= 4) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center p-0 border-blue-500 bg-blue-50">
                {position}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Potential Promotion</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (position >= teamCount - 3 && teamCount > 8) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="destructive" className="w-6 h-6 rounded-full flex items-center justify-center p-0">
                {position}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Relegation Zone</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={`${bgColor} text-white w-5 h-5 flex items-center justify-center text-xs font-bold rounded-sm`}
                  >
                    {result}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {result === 'W' ? 'Win' : result === 'D' ? 'Draw' : 'Loss'} 
                    {form.length - index > 1 ? ` - ${form.length - index} game${form.length - index !== 2 ? 's' : ''} ago` : ' - Last game'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    );
  };

  // Function to determine row background based on position
  const getRowBackground = (position: number, teamName: string, teamCount: number) => {
    if (teamName === "Banks o' Dee") {
      return 'bg-blue-50 hover:bg-blue-100';
    } else if (position === 1) {
      return 'bg-green-50 hover:bg-green-100';
    } else if (position <= 2) {
      return 'bg-blue-50/50 hover:bg-blue-100/50';
    } else if (position >= teamCount - 3 && teamCount > 8) {
      return 'bg-red-50/50 hover:bg-red-100/50';
    }
    return '';
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
              className={getRowBackground(team.position, team.team, leagueTable.length)}
            >
              <TableCell className="text-center">
                {getPositionBadge(team.position, leagueTable.length)}
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {team.logo ? (
                    <img 
                      src={team.logo} 
                      alt={`${team.team} logo`} 
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        // Fallback for invalid images
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite loop
                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M8 14s1.5 2 4 2 4-2 4-2'%3E%3C/path%3E%3Cline x1='9' y1='9' x2='9.01' y2='9'%3E%3C/line%3E%3Cline x1='15' y1='9' x2='15.01' y2='9'%3E%3C/line%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500">
                      {team.team.charAt(0)}
                    </div>
                  )}
                  <span className={team.team === "Banks o' Dee" ? 'font-bold text-team-blue' : ''}>
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

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="flex items-center gap-1">
          <Badge variant="success" className="w-5 h-5 rounded-full flex items-center justify-center p-0">1</Badge>
          <span className="text-xs text-gray-500">Champion</span>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="w-5 h-5 rounded-full flex items-center justify-center p-0">2</Badge>
          <span className="text-xs text-gray-500">Promotion Position</span>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="destructive" className="w-5 h-5 rounded-full flex items-center justify-center p-0">16</Badge>
          <span className="text-xs text-gray-500">Relegation Zone</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="bg-blue-50 w-4 h-4 rounded"></div>
          <span className="text-xs text-gray-500">Banks o' Dee</span>
        </div>
      </div>
    </div>
  );
};

export default LeagueTableView;

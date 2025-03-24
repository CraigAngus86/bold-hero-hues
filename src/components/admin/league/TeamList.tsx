
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileImage } from "lucide-react";
import { TeamStats } from '@/components/league/types';

interface TeamListProps {
  teams: TeamStats[];
  isLoading: boolean;
  onEditTeam: (team: TeamStats) => void;
}

const TeamList: React.FC<TeamListProps> = ({ teams, isLoading, onEditTeam }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-team-blue"></div>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-auto max-h-[600px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Pos</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Logo</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.length > 0 ? teams.map((team) => (
            <TableRow key={team.id || team.position} className={team.team === "Banks o' Dee" ? "bg-team-lightBlue/30" : ""}>
              <TableCell>{team.position}</TableCell>
              <TableCell className="font-medium">{team.team}</TableCell>
              <TableCell>
                {team.logo ? (
                  <img 
                    src={team.logo} 
                    alt={`${team.team} logo`} 
                    className="h-8 w-8 object-contain" 
                  />
                ) : (
                  <Badge variant="outline">No Logo</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEditTeam(team)}
                >
                  <FileImage className="h-4 w-4 mr-1" />
                  Update Logo
                </Button>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
                No teams found. Refresh data from the scraper control panel.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamList;

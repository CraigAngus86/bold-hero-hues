
import React, { useState, useEffect } from 'react';
import { leagueService } from '@/services/leagueService';
import LogoEditorDialog from '../league/LogoEditorDialog';
import { TeamStats } from '@/types/fixtures';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Edit, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const LeagueTableDashboard = () => {
  const [leagueTable, setLeagueTable] = useState<TeamStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Add team state
  const [selectedTeam, setSelectedTeam] = useState<TeamStats | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const fetchLeagueTable = async () => {
    setIsLoading(true);
    try {
      const data = await leagueService.getLeagueTableData();
      setLeagueTable(data);
    } catch (error) {
      console.error("Failed to fetch league table:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagueTable();
  }, []);
  
  // Add the logo edit function
  const handleEditLogo = (team: TeamStats) => {
    setSelectedTeam(team);
    setIsEditorOpen(true);
  };
  
  // The refresh function should take no arguments
  const handleRefreshData = async () => {
    // Implement refresh logic here
    try {
      // Call refreshLeagueData with no args
      const success = await leagueService.refreshLeagueData();
      if (success) {
        await fetchLeagueTable();
        toast.success('League table refreshed successfully');
      }
    } catch (error) {
      toast.error('Failed to refresh league table');
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Highland League Table</CardTitle>
          <CardDescription>
            Current standings of the Highland League teams.
          </CardDescription>
          <Button 
            variant="outline" 
            className="ml-auto" 
            onClick={handleRefreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Pos</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Played</TableHead>
                <TableHead>Won</TableHead>
                <TableHead>Drawn</TableHead>
                <TableHead>Lost</TableHead>
                <TableHead>GF</TableHead>
                <TableHead>GA</TableHead>
                <TableHead>GD</TableHead>
                <TableHead>Points</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-4">
                    Loading data...
                  </TableCell>
                </TableRow>
              ) : (
                leagueTable.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{team.position}</TableCell>
                    <TableCell>{team.team}</TableCell>
                    <TableCell>{team.played}</TableCell>
                    <TableCell>{team.won}</TableCell>
                    <TableCell>{team.drawn}</TableCell>
                    <TableCell>{team.lost}</TableCell>
                    <TableCell>{team.goalsFor}</TableCell>
                    <TableCell>{team.goalsAgainst}</TableCell>
                    <TableCell>{team.goalDifference}</TableCell>
                    <TableCell>{team.points}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditLogo(team)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Logo
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedTeam && (
        <LogoEditorDialog
          team={selectedTeam}
          isOpen={isEditorOpen}
          onOpenChange={setIsEditorOpen}
          onSuccess={fetchLeagueTable}
        />
      )}
    </div>
  );
};

export default LeagueTableDashboard;

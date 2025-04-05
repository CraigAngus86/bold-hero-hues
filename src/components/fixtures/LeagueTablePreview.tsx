
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { TeamStats } from '../league/types';

interface LeagueTablePreviewProps {
  leagueData: TeamStats[] | null;
}

const LeagueTablePreview = ({ leagueData }: LeagueTablePreviewProps) => {
  const navigate = useNavigate();
  
  // Handle empty or null data with sensible defaults
  const getPreviewTeams = () => {
    if (!leagueData || leagueData.length === 0) return [];
    
    // Find Banks o' Dee position
    const banksODeeIndex = leagueData.findIndex(team => 
      team.team.toLowerCase().includes("banks o' dee") || 
      team.team.toLowerCase().includes("banks o dee")
    );
    
    if (banksODeeIndex === -1) {
      // If Banks o' Dee is not in the data, just return top 6
      return leagueData.slice(0, 6);
    } else {
      // Make sure we include Banks o' Dee and other teams to total 6
      const result = [...leagueData.slice(0, 5)]; // Get top 5 teams
      
      // If Banks o' Dee is already in top 5, add the 6th team
      if (banksODeeIndex < 5) {
        result.push(leagueData[5]);
        return result;
      }
      
      // Otherwise, add Banks o' Dee as the 6th team
      result.push(leagueData[banksODeeIndex]);
      return result;
    }
  };
  
  const handleNavigateToTable = () => {
    navigate('/table');
    window.scrollTo(0, 0);
  };
  
  const previewTeams = getPreviewTeams();
  
  return (
    <Card className="overflow-hidden border-team-gray hover:shadow-md transition-shadow bg-white flex flex-col h-full">
      <div className="bg-[#00105a] text-white font-medium p-3 flex items-center justify-center">
        <Trophy className="w-4 h-4 mr-2" />
        <h3 className="text-lg font-semibold">Highland League</h3>
      </div>
      <CardContent className="p-3 flex-1 flex flex-col">
        <div className="text-xs flex-1">
          <Table>
            <TableHeader className="bg-team-lightBlue">
              <TableRow>
                <TableHead className="h-9 py-1.5 text-[#00105a]">Pos</TableHead>
                <TableHead className="h-9 py-1.5 text-[#00105a] text-left">Team</TableHead>
                <TableHead className="h-9 py-1.5 text-[#00105a] text-center">P</TableHead>
                <TableHead className="h-9 py-1.5 text-[#00105a] text-center">Pts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewTeams.length > 0 ? (
                previewTeams.map((team) => (
                  <TableRow 
                    key={team.position}
                    className={team.team.toLowerCase().includes("banks o") ? "bg-team-lightBlue/30" : ""}
                  >
                    <TableCell className="py-1.5 font-medium text-center">{team.position}</TableCell>
                    <TableCell className="py-1.5 font-medium">
                      <div className="flex items-center space-x-1">
                        {team.team.toLowerCase().includes("banks o") ? (
                          <img 
                            src="/lovable-uploads/banks-o-dee-logo.png" 
                            alt="Banks o' Dee logo"
                            className="w-4 h-4 object-contain"
                          />
                        ) : (
                          <img 
                            src={team.logo || "https://placehold.co/40x40/team-white/team-blue?text=Logo"} 
                            alt={`${team.team} logo`}
                            className="w-4 h-4 object-contain"
                          />
                        )}
                        <span className="text-xs truncate max-w-[90px]">{team.team}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-1.5 text-center text-xs">{team.played}</TableCell>
                    <TableCell className="py-1.5 text-center text-xs font-bold">{team.points}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-2 text-gray-500">
                    No league data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-3 text-center">
          <button 
            onClick={handleNavigateToTable}
            className="inline-block px-3 py-2 bg-[#00105a] text-white text-xs font-medium rounded hover:bg-[#c5e7ff] hover:text-[#00105a] transition-colors w-full"
          >
            Full Table
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeagueTablePreview;

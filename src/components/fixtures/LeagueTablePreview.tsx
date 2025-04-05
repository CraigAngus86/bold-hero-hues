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
  
  // Get exactly 6 teams to display
  const getPreviewTeams = () => {
    if (!leagueData || leagueData.length === 0) return [];
    
    // Find Banks o' Dee position
    const banksODeeIndex = leagueData.findIndex(team => 
      team.team.toLowerCase().includes("banks o' dee") || 
      team.team.toLowerCase().includes("banks o dee")
    );
    
    // If we have 6 or fewer teams, show all of them
    if (leagueData.length <= 6) return leagueData;
    
    // If Banks o' Dee is not in the data or outside top 6, return top 5 + Banks
    if (banksODeeIndex === -1 || banksODeeIndex >= 6) {
      const result = [...leagueData.slice(0, 5)];
      if (banksODeeIndex !== -1) {
        result.push(leagueData[banksODeeIndex]);
      } else {
        result.push(leagueData[5]);
      }
      return result;
    }
    
    // Otherwise Banks o' Dee is in top 6, so just return top 6
    return leagueData.slice(0, 6);
  };
  
  const handleNavigateToTable = () => {
    navigate('/table');
    window.scrollTo(0, 0);
  };
  
  const previewTeams = getPreviewTeams();
  
  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow bg-white flex flex-col h-full rounded-lg">
      <div className="bg-team-blue text-white font-semibold py-3 px-4 flex items-center justify-center">
        <Trophy className="w-4 h-4 mr-2" />
        <h3 className="text-lg">Highland League</h3>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="text-xs flex-1">
          <Table>
            <TableHeader className="bg-team-lightBlue/50">
              <TableRow>
                <TableHead className="h-8 py-1.5 text-team-blue font-semibold w-12">Pos</TableHead>
                <TableHead className="h-8 py-1.5 text-team-blue font-semibold text-left">Team</TableHead>
                <TableHead className="h-8 py-1.5 text-team-blue font-semibold text-center w-12">P</TableHead>
                <TableHead className="h-8 py-1.5 text-team-blue font-semibold text-center w-12">Pts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewTeams.length > 0 ? (
                previewTeams.map((team) => (
                  <TableRow 
                    key={team.position}
                    className={team.team.toLowerCase().includes("banks o") ? "bg-team-lightBlue/20" : ""}
                  >
                    <TableCell className="py-1.5 font-medium text-center">{team.position}</TableCell>
                    <TableCell className="py-1.5">
                      <div className="flex items-center space-x-1.5">
                        {team.team.toLowerCase().includes("banks o") ? (
                          <img 
                            src="/lovable-uploads/banks-o-dee-logo.png" 
                            alt="Banks o' Dee logo"
                            className="w-4 h-4 object-contain"
                          />
                        ) : (
                          <span className="w-4 h-4 flex-shrink-0"></span>
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
        <div className="mt-4 text-center">
          <button 
            onClick={handleNavigateToTable}
            className="inline-block px-4 py-2 bg-team-blue text-white text-sm font-medium rounded hover:bg-team-navy transition-colors w-full"
          >
            View Full Table
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeagueTablePreview;

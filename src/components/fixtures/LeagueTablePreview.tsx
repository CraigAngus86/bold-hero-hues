
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { TeamStats } from '../league/types';

interface LeagueTablePreviewProps {
  leagueData: TeamStats[];
}

const LeagueTablePreview = ({ leagueData }: LeagueTablePreviewProps) => {
  // Take the top 8 teams for the preview
  const previewTeams = leagueData.slice(0, 8);
  
  return (
    <Card className="overflow-hidden border-team-gray hover:shadow-md transition-shadow bg-white flex flex-col h-full">
      <div className="bg-[#00105a] text-white font-medium p-3 flex items-center justify-center">
        <Trophy className="w-5 h-5 mr-2" />
        <h3 className="text-lg font-semibold">Highland League</h3>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="text-xs flex-1">
          <Table>
            <TableHeader className="bg-team-lightBlue">
              <TableRow>
                <TableHead className="h-10 py-2 text-[#00105a]">Pos</TableHead>
                <TableHead className="h-10 py-2 text-[#00105a] text-left">Team</TableHead>
                <TableHead className="h-10 py-2 text-[#00105a] text-center">P</TableHead>
                <TableHead className="h-10 py-2 text-[#00105a] text-center">Pts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewTeams.map((team) => (
                <TableRow 
                  key={team.position}
                  className={team.team === "Banks o' Dee" ? "bg-team-lightBlue/30" : ""}
                >
                  <TableCell className="py-2 font-medium text-center">{team.position}</TableCell>
                  <TableCell className="py-2 font-medium">
                    <div className="flex items-center space-x-2">
                      {team.team === "Banks o' Dee" ? (
                        <img 
                          src="/lovable-uploads/banks-o-dee-logo.png" 
                          alt="Banks o' Dee logo"
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <img 
                          src={team.logo || "https://placehold.co/40x40/team-white/team-blue?text=Logo"} 
                          alt={`${team.team} logo`}
                          className="w-6 h-6 object-contain"
                        />
                      )}
                      <span>{team.team}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 text-center">{team.played}</TableCell>
                  <TableCell className="py-2 text-center font-bold">{team.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-center">
          <Link 
            to="/table" 
            className="inline-block px-4 py-2 bg-[#00105a] text-white text-sm font-medium rounded hover:bg-[#c5e7ff] hover:text-[#00105a] transition-colors w-full"
          >
            Full Table
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeagueTablePreview;

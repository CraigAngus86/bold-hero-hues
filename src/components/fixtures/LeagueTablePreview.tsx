
import { Card, CardContent } from '@/components/ui/card';
import { Table } from 'lucide-react';
import { TeamStats } from '@/components/league/types';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface LeagueTablePreviewProps {
  leagueData: TeamStats[] | null;
}

const LeagueTablePreview = ({ leagueData }: LeagueTablePreviewProps) => {
  const isBanksODee = (team: string) => {
    return team?.toLowerCase().includes('banks') && team?.toLowerCase().includes('dee');
  };
  
  // Only show top 5 teams
  const displayTeams = leagueData?.slice(0, 5) || [];
  
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-white flex flex-col h-full rounded-lg">
      <div className="bg-team-blue text-white font-bold py-4 px-4 flex items-center justify-center border-b-4 border-team-lightBlue">
        <Table className="w-5 h-5 mr-2" />
        <h3 className="text-xl">League Table</h3>
      </div>
      
      <CardContent className="p-5 flex-1">
        {displayTeams.length > 0 ? (
          <div className="space-y-1">
            {/* Table header */}
            <div className="grid grid-cols-12 text-xs font-bold text-gray-500 border-b border-gray-200 pb-2 mb-2">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Team</div>
              <div className="col-span-2 text-center">P</div>
              <div className="col-span-2 text-center">GD</div>
              <div className="col-span-2 text-center">PTS</div>
            </div>
            
            {/* Table rows */}
            {displayTeams.map((team, index) => (
              <div 
                key={team.id} 
                className={`grid grid-cols-12 text-sm py-2 ${index < displayTeams.length - 1 ? 'border-b border-gray-100' : ''} items-center`}
              >
                <div className="col-span-1 font-medium">{team.position}</div>
                <div className="col-span-5 font-medium truncate">
                  <span className={isBanksODee(team.name) ? 'text-team-blue font-bold' : ''}>
                    {team.name}
                  </span>
                </div>
                <div className="col-span-2 text-center">{team.played}</div>
                <div className="col-span-2 text-center">{team.goalDifference}</div>
                <div className="col-span-2 text-center font-bold">{team.points}</div>
              </div>
            ))}
            
            {/* Empty rows for visual balance if fewer than 5 teams */}
            {displayTeams.length < 5 && Array.from({ length: 5 - displayTeams.length }).map((_, index) => (
              <div key={`empty-${index}`} className="grid grid-cols-12 text-sm py-3 border-b border-gray-100 last:border-0"></div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-gray-500 font-medium">No league data available</p>
          </div>
        )}
        
        <div className="mt-4 text-center">
          <Button asChild variant="outline" className="text-team-blue border-team-blue hover:bg-team-blue hover:text-white">
            <Link to="/table">View Full Table</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeagueTablePreview;

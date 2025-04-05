
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Match } from './types';

interface RecentResultsProps {
  matches: Match[];
}

const RecentResults = ({ matches }: RecentResultsProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const isBanksODee = (team: string) => {
    return team.toLowerCase().includes('banks') && team.toLowerCase().includes('dee');
  };
  
  return (
    <Card className="overflow-hidden border-team-gray hover:shadow-md transition-shadow bg-white flex flex-col h-full">
      <div className="bg-[#00105a] text-white font-medium p-3 flex items-center justify-center">
        <Clock className="w-4 h-4 mr-2" />
        <h3 className="text-lg font-semibold">Recent Results</h3>
      </div>
      <CardContent className="p-3 flex-1">
        {matches.length > 0 ? (
          <div className="space-y-3">
            {matches.map(match => (
              <div key={match.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                <div className="text-xs text-gray-500 mb-1.5">
                  {formatDate(match.date)} • {match.competition}
                </div>
                
                <div className="flex items-center">
                  <div className="flex-1 text-right pr-2 text-sm">
                    <span className={`font-medium ${isBanksODee(match.homeTeam) ? 'text-team-blue' : ''}`}>
                      {match.homeTeam}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 font-bold text-sm">
                    <span className="bg-team-lightBlue text-team-blue px-2 py-1 rounded-sm min-w-[24px] text-center">
                      {match.homeScore}
                    </span>
                    <span className="text-xs">-</span>
                    <span className="bg-team-lightBlue text-team-blue px-2 py-1 rounded-sm min-w-[24px] text-center">
                      {match.awayScore}
                    </span>
                  </div>
                  
                  <div className="flex-1 pl-2 text-sm">
                    <span className={`font-medium ${isBanksODee(match.awayTeam) ? 'text-team-blue' : ''}`}>
                      {match.awayTeam}
                    </span>
                  </div>
                </div>
                
                {match.hasMatchPhotos && (
                  <div className="mt-1.5 text-center">
                    <Link 
                      to={`/match/${match.id}/photos`} 
                      className="text-xs text-team-blue hover:underline"
                    >
                      View match photos
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500 text-sm">No recent results</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentResults;

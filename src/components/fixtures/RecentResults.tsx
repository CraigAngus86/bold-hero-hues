
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Match, formatDate } from './types';

interface RecentResultsProps {
  matches: Match[];
}

const RecentResults = ({ matches }: RecentResultsProps) => {
  const isBanksODee = (team: string) => {
    return team.toLowerCase().includes('banks') && team.toLowerCase().includes('dee');
  };
  
  const getResultClass = (match: Match) => {
    if (!match.homeScore || !match.awayScore) return '';
    
    const bankIsHome = isBanksODee(match.homeTeam);
    const bankIsAway = isBanksODee(match.awayTeam);
    
    if (!bankIsHome && !bankIsAway) return '';
    
    const bankScore = bankIsHome ? match.homeScore : match.awayScore;
    const opponentScore = bankIsHome ? match.awayScore : match.homeScore;
    
    if (bankScore > opponentScore) return 'text-green-600';
    if (bankScore < opponentScore) return 'text-red-600';
    return 'text-amber-600';
  };
  
  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow bg-white flex flex-col h-full rounded-lg">
      <div className="bg-team-blue text-white font-semibold py-3 px-4 flex items-center justify-center">
        <Clock className="w-4 h-4 mr-2" />
        <h3 className="text-lg">Recent Results</h3>
      </div>
      <CardContent className="p-4 flex-1">
        {matches.length > 0 ? (
          <div className="space-y-3">
            {matches.map(match => (
              <div key={match.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0 min-h-[90px] flex flex-col justify-between">
                <div className="text-xs text-gray-600 mb-1.5 font-medium">
                  {formatDate(match.date)} • {match.competition}
                </div>
                
                <div className="flex items-center">
                  <div className="flex-1 text-right pr-2 text-sm">
                    <span className={`font-medium truncate inline-block max-w-28 ${isBanksODee(match.homeTeam) ? 'text-team-blue font-semibold' : ''}`}>
                      {match.homeTeam}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 font-bold text-sm">
                    <span className={`bg-team-lightBlue px-2 py-1 rounded-sm min-w-[24px] text-center ${getResultClass(match)}`}>
                      {match.homeScore}
                    </span>
                    <span className="text-xs">-</span>
                    <span className={`bg-team-lightBlue px-2 py-1 rounded-sm min-w-[24px] text-center ${getResultClass(match)}`}>
                      {match.awayScore}
                    </span>
                  </div>
                  
                  <div className="flex-1 pl-2 text-sm">
                    <span className={`font-medium truncate inline-block max-w-28 ${isBanksODee(match.awayTeam) ? 'text-team-blue font-semibold' : ''}`}>
                      {match.awayTeam}
                    </span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mt-1.5 text-center">
                  {match.venue}
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

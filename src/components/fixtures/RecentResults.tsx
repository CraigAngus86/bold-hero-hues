
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Match } from './types';
import { formatDate } from '@/utils/date';

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
    
    if (bankScore > opponentScore) return 'text-green-600 font-bold';
    if (bankScore < opponentScore) return 'text-red-600';
    return 'text-amber-600';
  };
  
  // Display max 4 matches to maintain consistent height
  const displayMatches = matches.slice(0, 4);
  
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-white flex flex-col h-full rounded-lg">
      <div className="bg-team-blue text-white font-bold py-4 px-4 flex items-center justify-center border-b-4 border-team-lightBlue">
        <Clock className="w-5 h-5 mr-2" />
        <h3 className="text-xl">Recent Results</h3>
      </div>
      <CardContent className="p-5 flex-1">
        {displayMatches.length > 0 ? (
          <div className="space-y-4">
            {displayMatches.map(match => (
              <div key={match.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="text-sm text-gray-600 mb-2 font-medium">
                  {formatDate(match.date)} • {match.competition}
                </div>
                
                <div className="flex items-center">
                  <div className="flex-1 text-right pr-3">
                    <span className={`font-medium text-base truncate inline-block max-w-28 ${isBanksODee(match.homeTeam) ? 'text-team-blue font-bold' : ''}`}>
                      {match.homeTeam}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-3 font-bold text-base">
                    <span className={`bg-team-lightBlue px-3 py-1.5 rounded-md min-w-[32px] text-center ${getResultClass(match)}`}>
                      {match.homeScore}
                    </span>
                    <span className="text-sm text-gray-400">-</span>
                    <span className={`bg-team-lightBlue px-3 py-1.5 rounded-md min-w-[32px] text-center ${getResultClass(match)}`}>
                      {match.awayScore}
                    </span>
                  </div>
                  
                  <div className="flex-1 pl-3">
                    <span className={`font-medium text-base truncate inline-block max-w-28 ${isBanksODee(match.awayTeam) ? 'text-team-blue font-bold' : ''}`}>
                      {match.awayTeam}
                    </span>
                  </div>
                </div>
                
                {match.hasMatchPhotos && (
                  <div className="mt-2 text-center">
                    <Link 
                      to={`/match/${match.id}/photos`} 
                      className="text-sm text-team-blue hover:underline font-medium"
                    >
                      View match photos
                    </Link>
                  </div>
                )}
              </div>
            ))}
            
            {/* Add empty placeholder divs if fewer than 4 matches */}
            {displayMatches.length < 4 && Array.from({ length: 4 - displayMatches.length }).map((_, index) => (
              <div key={`empty-${index}`} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0 h-[80px]"></div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[320px]">
            <p className="text-gray-500 font-medium">No recent results</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentResults;

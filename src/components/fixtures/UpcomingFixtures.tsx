
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Match } from './types';
import { formatDate } from '@/utils/date';

interface UpcomingFixturesProps {
  matches: Match[];
}

const UpcomingFixtures = ({ matches }: UpcomingFixturesProps) => {
  const isBanksODee = (team: string) => {
    return team.toLowerCase().includes('banks') && team.toLowerCase().includes('dee');
  };
  
  // Display max 4 matches
  const displayMatches = matches.slice(0, 4);
  
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-white flex flex-col h-full rounded-lg">
      <div className="bg-team-blue text-white font-bold py-4 px-4 flex items-center justify-center border-b-4 border-team-lightBlue">
        <Calendar className="w-5 h-5 mr-2" />
        <h3 className="text-xl">Upcoming Fixtures</h3>
      </div>
      <CardContent className="p-5 flex-1">
        {displayMatches.length > 0 ? (
          <div className="space-y-4">
            {displayMatches.map(match => (
              <div key={match.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="text-sm text-gray-600 mb-2 font-medium">
                  {formatDate(match.date)} • {match.time}
                </div>
                <p className="text-xs text-team-blue font-medium mb-2">{match.competition}</p>
                
                <div className="flex items-center">
                  <div className="flex-1 text-right pr-3 text-base">
                    <span className={`font-medium truncate inline-block max-w-28 ${isBanksODee(match.homeTeam) ? 'text-team-blue font-bold' : ''}`}>
                      {match.homeTeam}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center px-3">
                    <span className="bg-team-lightBlue text-team-blue font-bold px-3 py-1.5 rounded-md">
                      VS
                    </span>
                  </div>
                  
                  <div className="flex-1 pl-3 text-base">
                    <span className={`font-medium truncate inline-block max-w-28 ${isBanksODee(match.awayTeam) ? 'text-team-blue font-bold' : ''}`}>
                      {match.awayTeam}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-2 text-center">{match.venue}</p>
              </div>
            ))}
            
            {/* Add empty placeholder divs if fewer than 4 matches */}
            {displayMatches.length < 4 && Array.from({ length: 4 - displayMatches.length }).map((_, index) => (
              <div key={`empty-${index}`} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0 h-[80px]"></div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[320px]">
            <p className="text-gray-500 font-medium">No upcoming fixtures</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingFixtures;

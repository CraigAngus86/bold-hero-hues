
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Match } from './types';
import { formatShortDate } from '@/utils/date';

interface UpcomingFixturesProps {
  matches: Match[];
}

const UpcomingFixtures = ({ matches }: UpcomingFixturesProps) => {
  const isBanksODee = (team: string) => {
    return team.toLowerCase().includes('banks') && team.toLowerCase().includes('dee');
  };
  
  // Display max 4 matches to maintain consistent height with league table
  const displayMatches = matches.slice(0, 4);
  
  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow bg-white flex flex-col h-full rounded-lg">
      <div className="bg-team-blue text-white font-semibold py-3 px-4 flex items-center justify-center">
        <Calendar className="w-4 h-4 mr-2" />
        <h3 className="text-lg">Upcoming Fixtures</h3>
      </div>
      <CardContent className="p-4 flex-1">
        {displayMatches.length > 0 ? (
          <div className="space-y-3">
            {displayMatches.map(match => (
              <div key={match.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                <div className="text-xs text-gray-600 mb-1.5 font-medium">
                  {formatDate(match.date)} | {match.time} | {match.venue}
                </div>
                
                <div className="flex items-center">
                  <div className="flex-1 text-right pr-2 text-sm">
                    <span className={`font-medium truncate inline-block max-w-28 ${isBanksODee(match.homeTeam) ? 'text-team-blue font-semibold' : ''}`}>
                      {match.homeTeam}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center px-3">
                    <span className="bg-team-lightBlue text-team-blue text-xs font-semibold px-2 py-1 rounded-sm">
                      VS
                    </span>
                  </div>
                  
                  <div className="flex-1 pl-2 text-sm">
                    <span className={`font-medium truncate inline-block max-w-28 ${isBanksODee(match.awayTeam) ? 'text-team-blue font-semibold' : ''}`}>
                      {match.awayTeam}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add empty placeholder divs if we have fewer than 4 matches */}
            {displayMatches.length < 4 && Array.from({ length: 4 - displayMatches.length }).map((_, index) => (
              <div key={`empty-${index}`} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0 h-[60px]"></div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[248px]">
            <p className="text-gray-500 text-sm">No upcoming fixtures</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingFixtures;

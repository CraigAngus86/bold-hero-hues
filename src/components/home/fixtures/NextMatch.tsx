
import React from 'react';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Fixture } from '@/types/fixtures';

interface NextMatchProps {
  match: Fixture | null;
  formatMatchDate: (dateStr: string) => string;
  isBanksODee: (team: string) => boolean;
}

const NextMatch: React.FC<NextMatchProps> = ({ match, formatMatchDate, isBanksODee }) => {
  if (!match) {
    return (
      <Card className="border-team-lightBlue shadow-sm hover:shadow-md transition-shadow h-full">
        <CardContent className="p-8 flex flex-col justify-center items-center h-full">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">No Upcoming Matches</h3>
            <p className="text-gray-500">Check back later for the next scheduled match.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const isHome = isBanksODee(match.home_team);
  const opponent = isHome ? match.away_team : match.home_team;
  
  return (
    <Card className="border-team-lightBlue shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="p-6">
        <div className="bg-team-blue text-white px-4 py-2 -mx-6 -mt-6 mb-6">
          <h3 className="text-lg font-semibold">Next Match</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{formatMatchDate(match.date)}</span>
            <Clock className="w-4 h-4 ml-2" />
            <span>{match.time}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{match.venue}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex-1 text-right pr-3">
              <div className={`text-xl font-bold ${isHome ? 'text-team-blue' : ''}`}>
                {match.home_team}
              </div>
              <div className="text-xs text-gray-500">
                {isHome ? 'HOME' : ''}
              </div>
            </div>
            
            <div className="flex-shrink-0 px-3">
              <div className="text-xl font-bold">VS</div>
            </div>
            
            <div className="flex-1 pl-3">
              <div className={`text-xl font-bold ${!isHome ? 'text-team-blue' : ''}`}>
                {match.away_team}
              </div>
              <div className="text-xs text-gray-500">
                {!isHome ? 'AWAY' : ''}
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1 font-medium">
              Competition:
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded text-sm">
              {match.competition}
            </div>
          </div>
          
          {match.ticket_link && (
            <div className="pt-2">
              <Button asChild variant="default" className="w-full bg-team-blue hover:bg-team-navy flex items-center justify-center gap-2">
                <a href={match.ticket_link} target="_blank" rel="noopener noreferrer">
                  <Ticket className="w-4 h-4" />
                  Buy Tickets
                </a>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NextMatch;

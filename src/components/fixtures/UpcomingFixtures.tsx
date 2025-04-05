
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Calendar, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Match } from './types';

interface UpcomingFixturesProps {
  matches: Match[];
}

const UpcomingFixtures = ({ matches }: UpcomingFixturesProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };
  
  const isBanksODee = (team: string) => {
    return team.toLowerCase().includes('banks') && team.toLowerCase().includes('dee');
  };
  
  return (
    <Card className="overflow-hidden border-team-gray hover:shadow-md transition-shadow bg-white flex flex-col h-full">
      <div className="bg-[#00105a] text-white font-medium p-3 flex items-center justify-center">
        <Calendar className="w-4 h-4 mr-2" />
        <h3 className="text-lg font-semibold">Upcoming Matches</h3>
      </div>
      <CardContent className="p-3 flex-1">
        {matches.length > 0 ? (
          <div className="space-y-3">
            {matches.map(match => (
              <div key={match.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                <div className="text-xs text-gray-500 mb-1.5">
                  {formatDate(match.date)} • {match.time} • {match.competition}
                </div>
                
                <div className="flex items-center">
                  <div className="flex-1 text-right pr-2 text-sm">
                    <span className={`font-medium ${isBanksODee(match.homeTeam) ? 'text-team-blue' : ''}`}>
                      {match.homeTeam}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center px-3">
                    <span className="bg-team-lightBlue text-team-blue text-xs font-semibold px-2 py-1 rounded-sm">
                      VS
                    </span>
                  </div>
                  
                  <div className="flex-1 pl-2 text-sm">
                    <span className={`font-medium ${isBanksODee(match.awayTeam) ? 'text-team-blue' : ''}`}>
                      {match.awayTeam}
                    </span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mt-1 text-center">
                  {match.venue}
                </div>
                
                {match.ticketLink && (
                  <div className="mt-2 text-center">
                    <Button asChild variant="outline" size="sm" className="text-xs h-7 px-3">
                      <a 
                        href={match.ticketLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center"
                      >
                        <Ticket className="w-3 h-3 mr-1" /> Buy Tickets
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500 text-sm">No upcoming fixtures</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingFixtures;


import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fixture } from '@/types/fixtures';

interface NextMatchProps {
  match: Fixture | null;
  formatMatchDate: (dateStr: string) => string;
  isBanksODee: (team: string) => boolean;
}

const NextMatch: React.FC<NextMatchProps> = ({ match, formatMatchDate, isBanksODee }) => {
  if (!match) {
    return (
      <Card className="overflow-hidden h-full border-team-lightBlue shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="bg-team-blue text-white p-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Next Match
          </h3>
        </CardHeader>
        <CardContent className="p-6 flex items-center justify-center h-64">
          <p className="text-gray-500">No upcoming matches scheduled</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-full border-team-lightBlue shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="bg-team-blue text-white p-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Next Match
        </h3>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-3">
          <Badge className="bg-team-lightBlue text-team-blue font-medium">
            {match.competition}
          </Badge>
          <span className="text-sm text-gray-500 ml-3">
            {formatMatchDate(match.date)} • {match.time}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-6 mb-8">
          <div className="flex-1 text-right pr-3">
            <div className={`font-bold text-xl ${isBanksODee(match.homeTeam) ? 'text-team-blue' : 'text-gray-800'}`}>
              {match.homeTeam}
            </div>
          </div>
          
          <div className="flex items-center justify-center text-lg font-bold bg-team-lightBlue text-team-blue px-3 py-2 rounded-md">
            VS
          </div>
          
          <div className="flex-1 pl-3">
            <div className={`font-bold text-xl ${isBanksODee(match.awayTeam) ? 'text-team-blue' : 'text-gray-800'}`}>
              {match.awayTeam}
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 text-center mb-6">
          {match.venue}
        </div>
        
        {match.ticketLink && (
          <div className="text-center">
            <Button asChild className="bg-team-blue hover:bg-team-navy">
              <a href={match.ticketLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                <Ticket className="w-4 h-4 mr-2" /> Buy Tickets
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NextMatch;

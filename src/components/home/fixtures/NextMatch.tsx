
import React from 'react';
import { Fixture } from '@/types/fixtures';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NextMatchProps {
  match: Fixture | null;
  formatMatchDate: (date: string) => string;
  isBanksODee: (team: string) => boolean;
}

const NextMatch: React.FC<NextMatchProps> = ({ match, formatMatchDate, isBanksODee }) => {
  if (!match) {
    return (
      <Card className="h-full bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-center text-team-blue">Next Match</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full py-8">
          <p className="text-gray-500">No upcoming matches scheduled</p>
        </CardContent>
      </Card>
    );
  }

  const matchDate = new Date(`${match.date}T${match.time}`);
  const now = new Date();
  const difference = matchDate.getTime() - now.getTime();

  // Calculate countdown
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

  // Only show countdown if match is in the future
  const showCountdown = difference > 0;

  return (
    <Card className="h-full bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 overflow-hidden">
      <CardHeader className="pb-2 bg-team-blue/10">
        <CardTitle className="text-lg font-bold text-center text-team-blue">Next Match</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Competition badge */}
        <div className="text-center mb-3">
          <span className="bg-team-blue/10 text-team-blue text-xs font-medium px-3 py-1 rounded-full">
            {match.competition}
          </span>
        </div>
        
        {/* Date */}
        <div className="text-center mb-3">
          <p className="text-sm font-medium text-gray-700">{formatMatchDate(match.date)}</p>
        </div>

        {/* Teams */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-center flex-1">
            <div className={cn(
              "font-bold",
              isBanksODee(match.home_team) ? "text-team-blue" : "text-gray-800"
            )}>
              {match.home_team}
            </div>
            {isBanksODee(match.home_team) && (
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1 rounded">HOME</span>
            )}
          </div>
          
          <div className="mx-3 text-center">
            <span className="inline-block bg-gray-100 px-3 py-1 rounded text-gray-600 text-sm font-medium">
              VS
            </span>
          </div>
          
          <div className="text-center flex-1">
            <div className={cn(
              "font-bold",
              isBanksODee(match.away_team) ? "text-team-blue" : "text-gray-800"
            )}>
              {match.away_team}
            </div>
            {isBanksODee(match.away_team) && (
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1 rounded">AWAY</span>
            )}
          </div>
        </div>
        
        {/* Countdown */}
        {showCountdown && (
          <div className="flex justify-center gap-2 mb-4">
            <div className="bg-team-blue text-white text-center px-2 py-1 rounded-md w-16">
              <span className="block text-lg font-bold">{days}</span>
              <span className="text-xs uppercase">days</span>
            </div>
            <div className="bg-team-blue text-white text-center px-2 py-1 rounded-md w-16">
              <span className="block text-lg font-bold">{hours}</span>
              <span className="text-xs uppercase">hrs</span>
            </div>
            <div className="bg-team-blue text-white text-center px-2 py-1 rounded-md w-16">
              <span className="block text-lg font-bold">{minutes}</span>
              <span className="text-xs uppercase">min</span>
            </div>
          </div>
        )}
        
        {/* Match details */}
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            <span>{match.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{match.venue}</span>
          </div>
        </div>
        
        {/* Ticket button */}
        {match.ticket_link && (
          <Button asChild className="w-full bg-team-accent hover:bg-amber-500 text-team-blue">
            <Link to={match.ticket_link}>
              <Ticket className="w-4 h-4 mr-2" />
              Buy Tickets
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default NextMatch;

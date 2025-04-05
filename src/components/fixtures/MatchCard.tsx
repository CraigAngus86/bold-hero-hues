
import { Trophy, MapPin, Calendar, Clock, Users } from 'lucide-react';
import { Match, formatDate } from './types';

interface MatchCardProps {
  match: Match;
}

const MatchCard = ({ match }: MatchCardProps) => {
  const isBanksODee = (team: string) => {
    return team.toLowerCase().includes('banks') || team.toLowerCase().includes('dee');
  };
  
  const isHomeWin = match.isCompleted && match.homeScore !== undefined && match.awayScore !== undefined && match.homeScore > match.awayScore;
  const isAwayWin = match.isCompleted && match.homeScore !== undefined && match.awayScore !== undefined && match.homeScore < match.awayScore;
  const isDraw = match.isCompleted && match.homeScore !== undefined && match.awayScore !== undefined && match.homeScore === match.awayScore;
  
  const banksIsHome = isBanksODee(match.homeTeam);
  const banksIsAway = isBanksODee(match.awayTeam);
  
  const banksWon = (banksIsHome && isHomeWin) || (banksIsAway && isAwayWin);
  const banksLost = (banksIsHome && isAwayWin) || (banksIsAway && isHomeWin);
  
  const resultClass = match.isCompleted
    ? banksWon
      ? 'bg-green-100 border-green-300'
      : banksLost
        ? 'bg-red-50 border-red-200'
        : isDraw
          ? 'bg-yellow-50 border-yellow-200'
          : 'bg-white border-gray-200'
    : 'bg-white border-gray-200';
  
  return (
    <div className={`rounded-lg ${resultClass} border p-4 shadow-sm transition-all hover:shadow-md`}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm mb-3">
        <div className="flex items-center space-x-1.5 text-gray-600">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(match.date)}</span>
        </div>
        
        <div className="flex items-center space-x-1.5">
          <Trophy className="h-3.5 w-3.5 text-team-blue" />
          <span className="font-medium text-gray-700">{match.competition}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 text-right pr-3">
          <div className={`font-medium text-lg ${banksIsHome ? 'text-team-blue font-semibold' : 'text-gray-800'}`}>
            {match.homeTeam}
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          {match.isCompleted ? (
            <div className="bg-white rounded-md border border-gray-300 shadow-sm px-3 py-1 min-w-[70px] text-center">
              <span className={`text-xl font-bold ${banksWon ? 'text-green-600' : banksLost ? 'text-red-500' : 'text-gray-700'}`}>
                {match.homeScore} - {match.awayScore}
              </span>
            </div>
          ) : (
            <div className="rounded-md bg-blue-50 border border-blue-200 px-3 py-1 min-w-[70px] text-center">
              <span className="font-medium text-blue-800">
                {match.time}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 pl-3">
          <div className={`font-medium text-lg ${banksIsAway ? 'text-team-blue font-semibold' : 'text-gray-800'}`}>
            {match.awayTeam}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <MapPin className="h-3 w-3" />
          <span>{match.venue}</span>
        </div>
        
        {!match.isCompleted && (
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Kick-off: {match.time}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;

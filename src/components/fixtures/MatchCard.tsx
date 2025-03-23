
import { Card, CardContent } from '@/components/ui/card';
import { Match, formatDate } from './types';

interface MatchCardProps {
  match: Match;
}

// Generate placeholder logos for teams
const getTeamLogo = (teamName: string) => {
  // This would ideally be replaced with actual team logos
  const initials = teamName
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
  
  // For Banks o' Dee we use the official logo
  if (teamName === "Banks o' Dee") {
    return "/lovable-uploads/8f2cd33f-1e08-494a-9aaa-65792ee9418a.png";
  }
  
  return `https://placehold.co/100x100/team-blue/white?text=${initials}`;
};

const MatchCard = ({ match }: MatchCardProps) => {
  return (
    <Card 
      key={match.id}
      className={`overflow-hidden border-team-gray hover:shadow-md transition-shadow ${match.isCompleted ? 'bg-white' : 'bg-white'}`}
    >
      <CardContent className="p-0">
        <div className={`text-xs font-medium p-2 flex justify-between items-center ${match.isCompleted ? 'bg-team-lightBlue text-team-blue' : 'bg-team-blue text-white'}`}>
          <span>{match.competition}</span>
          <span>{formatDate(match.date)} • {match.time}</span>
        </div>
        <div className="p-2 relative">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center flex-1">
              <div className="w-10 h-10 flex-shrink-0 mr-1 flex items-center justify-center">
                <img 
                  src={getTeamLogo(match.homeTeam)} 
                  alt={`${match.homeTeam} logo`} 
                  className={`max-w-full max-h-full object-contain ${match.homeTeam === "Banks o' Dee" ? "w-10" : ""}`}
                />
              </div>
              <div className="flex-1 text-right">
                <p className={`font-semibold ${match.homeTeam === "Banks o' Dee" ? "text-team-blue" : ""}`}>
                  {match.homeTeam}
                </p>
              </div>
            </div>
            
            {match.isCompleted ? (
              <div className="flex items-center justify-center space-x-2 font-bold mx-1">
                <span className="w-7 h-7 flex items-center justify-center bg-team-gray rounded">{match.homeScore}</span>
                <span className="text-xs">-</span>
                <span className="w-7 h-7 flex items-center justify-center bg-team-gray rounded">{match.awayScore}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center font-bold text-sm mx-1">
                <span>VS</span>
              </div>
            )}
            
            <div className="flex items-center flex-1">
              <div className="flex-1 text-left">
                <p className={`font-semibold ${match.awayTeam === "Banks o' Dee" ? "text-team-blue" : ""}`}>
                  {match.awayTeam}
                </p>
              </div>
              <div className="w-10 h-10 flex-shrink-0 ml-1 flex items-center justify-center">
                <img 
                  src={getTeamLogo(match.awayTeam)} 
                  alt={`${match.awayTeam} logo`} 
                  className={`max-w-full max-h-full object-contain ${match.awayTeam === "Banks o' Dee" ? "w-10" : ""}`}
                />
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-center mt-0.5 mb-1">
            {match.venue}
          </div>
          
          {!match.isCompleted && (
            <div className="flex justify-center">
              <a 
                href="/tickets" 
                className="text-xs bg-team-blue text-white px-3 py-1 rounded hover:bg-team-navy transition-colors text-center"
              >
                Get Tickets
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;

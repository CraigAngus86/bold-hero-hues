
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Match, formatDate } from './types';

interface RecentResultsProps {
  matches: Match[];
}

const RecentResults = ({ matches }: RecentResultsProps) => {
  // Generate placeholder logos for teams
  const getTeamLogo = (teamName: string) => {
    // This would ideally be replaced with actual team logos
    const initials = teamName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
    
    // For Banks o' Dee we have an updated logo
    if (teamName === "Banks o' Dee") {
      return "/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png";
    }
    
    return `https://placehold.co/60x60/team-blue/white?text=${initials}`;
  };

  return (
    <Card className="overflow-hidden border-team-gray hover:shadow-md transition-shadow bg-white flex flex-col h-full">
      <div className="bg-[#00105a] text-white font-medium p-3 flex items-center justify-center">
        <Clock className="w-5 h-5 mr-2" />
        <h3 className="text-2xl font-semibold">Recent Results</h3>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          {matches.map((match) => (
            <div key={match.id} className="p-2 border-b border-gray-100 last:border-0">
              <div className="text-xs text-[#00105a] font-medium mb-0.5">
                {match.competition} • {formatDate(match.date)}
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center w-[30%] justify-end space-x-1">
                  <div className="w-5 h-5 flex-shrink-0 mr-1">
                    <img 
                      src={getTeamLogo(match.homeTeam)} 
                      alt={`${match.homeTeam} logo`} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className={`font-medium text-right ${match.homeTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
                    {match.homeTeam}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-3 font-bold w-[40%]">
                  <span className="w-7 h-7 flex items-center justify-center bg-team-lightBlue rounded-sm">{match.homeScore}</span>
                  <span className="text-xs">-</span>
                  <span className="w-7 h-7 flex items-center justify-center bg-team-lightBlue rounded-sm">{match.awayScore}</span>
                </div>
                <div className="flex items-center w-[30%] justify-start space-x-1">
                  <span className={`font-medium text-left ${match.awayTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
                    {match.awayTeam}
                  </span>
                  <div className="w-5 h-5 flex-shrink-0 ml-1">
                    <img 
                      src={getTeamLogo(match.awayTeam)} 
                      alt={`${match.awayTeam} logo`} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 text-center mt-0">
                {match.venue}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link 
            to="/fixtures" 
            className="inline-block px-4 py-2 bg-team-lightBlue text-[#00105a] text-sm font-medium rounded hover:bg-[#00105a] hover:text-white transition-colors w-full text-center"
          >
            All Results
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentResults;

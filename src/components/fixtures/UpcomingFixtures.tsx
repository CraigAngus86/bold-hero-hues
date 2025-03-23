
import { Link } from 'react-router-dom';
import { CalendarDays, Ticket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Match, formatDate } from './types';

interface UpcomingFixturesProps {
  matches: Match[];
}

const UpcomingFixtures = ({ matches }: UpcomingFixturesProps) => {
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
        <CalendarDays className="w-5 h-5 mr-2" />
        <h3 className="text-2xl font-semibold">Upcoming Fixtures</h3>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          {matches.map((match) => (
            <div key={match.id} className="p-2 border-b border-gray-100 last:border-0">
              <div className="text-xs text-[#00105a] font-medium mb-0.5">
                {match.competition} • {formatDate(match.date)} • {match.time}
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center w-[42%] justify-end space-x-1">
                  <div className="w-5 h-5 flex-shrink-0 mr-1">
                    <img 
                      src={getTeamLogo(match.homeTeam)} 
                      alt={`${match.homeTeam} logo`} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className={`font-medium ${match.homeTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
                    {match.homeTeam}
                  </span>
                </div>
                <span className="font-bold text-xs w-[16%] text-center">VS</span>
                <div className="flex items-center w-[42%] justify-start space-x-1">
                  <span className={`font-medium ${match.awayTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
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
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link 
            to="/fixtures" 
            className="inline-flex items-center justify-center px-4 py-2 bg-team-lightBlue text-[#00105a] text-sm font-medium rounded hover:bg-[#00105a] hover:text-white transition-colors text-center"
          >
            All Fixtures
          </Link>
          <Link 
            to="/tickets" 
            className="inline-flex items-center justify-center px-4 py-2 bg-white text-[#00105a] border border-[#00105a] text-sm font-medium rounded hover:bg-[#00105a] hover:text-white transition-colors"
          >
            <Ticket className="w-4 h-4 mr-2" /> Buy Tickets
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingFixtures;

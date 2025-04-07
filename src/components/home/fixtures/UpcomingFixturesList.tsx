
import React from 'react';
import { Fixture } from '@/types/fixtures';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface UpcomingFixturesListProps {
  fixtures: Fixture[];
  formatMatchDate: (date: string) => string;
  isBanksODee: (team: string) => boolean;
}

const UpcomingFixturesList: React.FC<UpcomingFixturesListProps> = ({ 
  fixtures, 
  formatMatchDate,
  isBanksODee
}) => {
  if (fixtures.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-3">
        <h3 className="text-sm font-bold mb-2">More Fixtures</h3>
        
        <div className="space-y-2">
          {fixtures.map((fixture) => (
            <div 
              key={fixture.id}
              className="p-2 bg-gray-50 rounded-md text-sm hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">{formatMatchDate(fixture.date)}</span>
                <span className="text-xs bg-team-blue/10 text-team-blue px-1.5 py-0.5 rounded-full">
                  {fixture.competition}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={cn(
                  "text-xs font-medium",
                  isBanksODee(fixture.home_team) ? "text-team-blue" : "text-gray-800"
                )}>
                  {fixture.home_team}
                </span>
                
                <span className="mx-1 text-xs bg-gray-100 px-2 rounded">vs</span>
                
                <span className={cn(
                  "text-xs font-medium",
                  isBanksODee(fixture.away_team) ? "text-team-blue" : "text-gray-800"
                )}>
                  {fixture.away_team}
                </span>
              </div>
              
              <div className="mt-1 flex justify-between items-center text-xs">
                <div className="flex items-center text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{fixture.time}</span>
                </div>
                
                {fixture.ticket_link && (
                  <Link 
                    to={fixture.ticket_link} 
                    className="text-team-blue hover:underline flex items-center"
                  >
                    <Ticket className="h-3 w-3 mr-0.5" />
                    Tickets
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 text-center">
          <Link 
            to="/fixtures" 
            className="text-xs text-team-blue hover:underline"
          >
            View All Fixtures
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpcomingFixturesList;

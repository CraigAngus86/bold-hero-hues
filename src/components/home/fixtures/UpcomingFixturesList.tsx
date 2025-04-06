
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Fixture } from '@/types/fixtures';

interface UpcomingFixturesProps {
  fixtures: Fixture[];
  formatMatchDate: (dateStr: string) => string;
  isBanksODee: (team: string) => boolean;
}

const UpcomingFixturesList: React.FC<UpcomingFixturesProps> = ({ 
  fixtures, 
  formatMatchDate, 
  isBanksODee 
}) => {
  if (fixtures.length === 0) {
    return null;
  }
  
  return (
    <Card className="border-team-lightBlue shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-team-blue text-white p-4">
        <h3 className="text-lg font-semibold">Upcoming Fixtures</h3>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {fixtures.map(fixture => (
            <div key={fixture.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
              <div className="text-xs text-gray-500 mb-2">
                {formatMatchDate(fixture.date)} • {fixture.time} • {fixture.competition}
              </div>
              <div className="flex items-center">
                <div className="flex-1 text-right pr-3">
                  <span className={`font-medium ${isBanksODee(fixture.homeTeam) ? 'text-team-blue' : ''}`}>
                    {fixture.homeTeam}
                  </span>
                </div>
                
                <div className="flex items-center justify-center px-3">
                  <span className="bg-team-lightBlue text-team-blue text-xs font-semibold px-2 py-1 rounded-sm">
                    VS
                  </span>
                </div>
                
                <div className="flex-1 pl-3">
                  <span className={`font-medium ${isBanksODee(fixture.awayTeam) ? 'text-team-blue' : ''}`}>
                    {fixture.awayTeam}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingFixturesList;

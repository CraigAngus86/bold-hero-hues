
import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Fixture } from '@/types/fixtures';

interface RecentResultsProps {
  results: Fixture[];
  formatMatchDate: (dateStr: string) => string;
  isBanksODee: (team: string) => boolean;
}

const RecentResultsList: React.FC<RecentResultsProps> = ({ 
  results, 
  formatMatchDate, 
  isBanksODee 
}) => {
  return (
    <Card className="border-team-lightBlue shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-team-blue text-white p-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Recent Results
        </h3>
      </CardHeader>
      <CardContent className="p-4">
        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map(result => (
              <div key={result.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                <div className="text-xs text-gray-500 mb-2">
                  {formatMatchDate(result.date)} • {result.competition}
                </div>
                <div className="flex items-center">
                  <div className="flex-1 text-right pr-3">
                    <span className={`font-medium ${isBanksODee(result.home_team) ? 'text-team-blue' : ''}`}>
                      {result.home_team}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-3 font-bold">
                    <span className="bg-team-lightBlue text-team-blue px-2 py-1 rounded-sm min-w-[24px] text-center">{result.home_score}</span>
                    <span className="text-xs">-</span>
                    <span className="bg-team-lightBlue text-team-blue px-2 py-1 rounded-sm min-w-[24px] text-center">{result.away_score}</span>
                  </div>
                  
                  <div className="flex-1 pl-3">
                    <span className={`font-medium ${isBanksODee(result.away_team) ? 'text-team-blue' : ''}`}>
                      {result.away_team}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-24">
            <p className="text-gray-500">No recent results</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentResultsList;

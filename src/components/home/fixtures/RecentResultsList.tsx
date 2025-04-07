
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Fixture } from '@/types/fixtures';
import { cn } from '@/lib/utils';

interface RecentResultsListProps {
  results: Fixture[];
  formatMatchDate: (date: string) => string;
  isBanksODee: (team: string) => boolean;
}

const RecentResultsList: React.FC<RecentResultsListProps> = ({ 
  results, 
  formatMatchDate,
  isBanksODee
}) => {
  if (results.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Recent Results</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-gray-500">No recent results available</p>
        </CardContent>
      </Card>
    );
  }

  const getResultStyle = (
    homeTeam: string, 
    awayTeam: string, 
    homeScore?: number | null, 
    awayScore?: number | null
  ) => {
    if (homeScore === undefined || awayScore === undefined || homeScore === null || awayScore === null) 
      return "";
    
    const isHomeWin = homeScore > awayScore;
    const isAwayWin = awayScore > homeScore;
    const isDraw = homeScore === awayScore;
    
    if (isBanksODee(homeTeam)) {
      if (isHomeWin) return "bg-green-100 text-green-800";
      if (isAwayWin) return "bg-red-100 text-red-800";
      if (isDraw) return "bg-amber-100 text-amber-800";
    } else if (isBanksODee(awayTeam)) {
      if (isAwayWin) return "bg-green-100 text-green-800";
      if (isHomeWin) return "bg-red-100 text-red-800";
      if (isDraw) return "bg-amber-100 text-amber-800";
    }
    
    return "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex justify-between items-center">
          Recent Results
          <Link to="/results" className="text-sm text-blue-600 hover:underline flex items-center">
            View All <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-3">
        <div className="space-y-3">
          {results.map((result) => (
            <div 
              key={result.id}
              className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500">{formatMatchDate(result.date)}</span>
                <span className="text-xs font-medium bg-team-blue/10 text-team-blue px-2 py-0.5 rounded-full">
                  {result.competition}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-right w-5/12">
                  <span className={cn(
                    "font-semibold",
                    isBanksODee(result.home_team) ? "text-team-blue" : "text-gray-800"
                  )}>
                    {result.home_team}
                  </span>
                </div>
                
                <div className="mx-2 px-3 py-1 rounded-md text-center w-2/12">
                  <span className={cn(
                    "font-bold",
                    getResultStyle(result.home_team, result.away_team, result.home_score, result.away_score)
                  )}>
                    {result.home_score} - {result.away_score}
                  </span>
                </div>
                
                <div className="text-sm w-5/12">
                  <span className={cn(
                    "font-semibold",
                    isBanksODee(result.away_team) ? "text-team-blue" : "text-gray-800"
                  )}>
                    {result.away_team}
                  </span>
                </div>
              </div>
              
              <div className="mt-2 text-right">
                <Link 
                  to={`/fixtures/${result.id}`} 
                  className="text-xs text-team-blue hover:underline"
                >
                  Match Report
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentResultsList;

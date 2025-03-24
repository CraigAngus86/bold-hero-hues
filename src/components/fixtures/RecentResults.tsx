
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Match, formatDate } from './types';

interface RecentResultsProps {
  matches: Match[];
}

const RecentResults = ({ matches }: RecentResultsProps) => {
  return (
    <Card className="overflow-hidden border-team-gray hover:shadow-md transition-shadow bg-white flex flex-col h-full">
      <div className="bg-[#00105a] text-white font-medium p-2 flex items-center justify-center">
        <Clock className="w-4 h-4 mr-2" />
        <h3 className="text-lg font-semibold">Recent Results</h3>
      </div>
      <CardContent className="p-2 flex-1 flex flex-col">
        <div className="space-y-0.5 flex-1">
          {matches.map((match) => (
            <div key={match.id} className="p-1 border-b border-gray-100 last:border-0">
              <div className="text-xs text-[#00105a] font-medium text-center">
                {match.competition} • {formatDate(match.date)}
              </div>
              <div className="flex items-center justify-between text-sm my-0.5">
                <div className="flex items-center w-[40%] justify-end pr-2">
                  <span className={`font-medium text-right ${match.homeTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
                    {match.homeTeam}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-3 font-bold w-[20%]">
                  <span className="w-6 h-6 flex items-center justify-center bg-[#c5e7ff] rounded-sm">{match.homeScore}</span>
                  <span className="text-xs">-</span>
                  <span className="w-6 h-6 flex items-center justify-center bg-[#c5e7ff] rounded-sm">{match.awayScore}</span>
                </div>
                <div className="flex items-center w-[40%] justify-start pl-2">
                  <span className={`font-medium text-left ${match.awayTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
                    {match.awayTeam}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-center">
          <Link 
            to="/fixtures" 
            className="inline-block px-3 py-1.5 bg-[#00105a] text-white text-xs font-medium rounded hover:bg-[#c5e7ff] hover:text-[#00105a] transition-colors w-full text-center"
          >
            All Results
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentResults;

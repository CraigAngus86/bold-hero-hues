
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
      <div className="bg-[#00105a] text-white font-medium p-3 flex items-center justify-center">
        <Clock className="w-5 h-5 mr-2" />
        <h3 className="text-lg font-semibold">Recent Results</h3>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {matches.map((match) => (
            <div key={match.id} className="p-3 border-b border-gray-100 last:border-0">
              <div className="text-xs text-[#00105a] font-medium mb-2">
                {match.competition} • {formatDate(match.date)}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={`font-medium w-[30%] text-right px-1 ${match.homeTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
                  {match.homeTeam}
                </span>
                <div className="flex items-center justify-center space-x-3 font-bold w-[40%]">
                  <span className="w-8 h-8 flex items-center justify-center bg-team-lightBlue rounded-sm">{match.homeScore}</span>
                  <span className="text-xs">-</span>
                  <span className="w-8 h-8 flex items-center justify-center bg-team-lightBlue rounded-sm">{match.awayScore}</span>
                </div>
                <span className={`font-medium w-[30%] text-left px-1 ${match.awayTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
                  {match.awayTeam}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                {match.venue}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link 
            to="/fixtures" 
            className="inline-block px-4 py-2 bg-team-lightBlue text-[#00105a] text-sm font-medium rounded hover:bg-[#00105a] hover:text-white transition-colors w-full"
          >
            All Results
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentResults;

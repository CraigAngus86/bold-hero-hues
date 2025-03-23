
import { Link } from 'react-router-dom';
import { CalendarDays, Ticket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Match, formatDate } from './types';

interface UpcomingFixturesProps {
  matches: Match[];
}

const UpcomingFixtures = ({ matches }: UpcomingFixturesProps) => {
  return (
    <Card className="overflow-hidden border-team-gray hover:shadow-md transition-shadow bg-white flex flex-col h-full">
      <div className="bg-[#00105a] text-white font-medium p-3 flex items-center justify-center">
        <CalendarDays className="w-5 h-5 mr-2" />
        <h3 className="text-2xl font-semibold">Upcoming Fixtures</h3>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {matches.map((match) => (
            <div key={match.id} className="p-3 border-b border-gray-100 last:border-0">
              <div className="text-xs text-[#00105a] font-medium mb-2">
                {match.competition} • {formatDate(match.date)} • {match.time}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={`font-medium w-[42%] text-right ${match.homeTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
                  {match.homeTeam}
                </span>
                <span className="font-bold text-xs w-[16%] text-center">VS</span>
                <span className={`font-medium w-[42%] text-left ${match.awayTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
                  {match.awayTeam}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
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
            className="inline-flex items-center justify-center px-4 py-2 bg-[#00105a] text-white text-sm font-medium rounded hover:bg-[#c5e7ff] hover:text-[#00105a] transition-colors"
          >
            <Ticket className="w-4 h-4 mr-2" /> Buy Tickets
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingFixtures;

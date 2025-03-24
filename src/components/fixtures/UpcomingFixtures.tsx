
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
      <div className="bg-[#00105a] text-white font-medium p-2 flex items-center justify-center">
        <CalendarDays className="w-4 h-4 mr-2" />
        <h3 className="text-lg font-semibold">Upcoming Fixtures</h3>
      </div>
      <CardContent className="p-2 flex-1 flex flex-col">
        <div className="space-y-0.5 flex-1">
          {matches.map((match) => (
            <div key={match.id} className="p-1 border-b border-gray-100 last:border-0">
              <div className="text-xs text-[#00105a] font-medium">
                {match.competition} • {formatDate(match.date)} • {match.time}
              </div>
              <div className="flex items-center justify-between text-sm my-0.5">
                <div className="flex items-center w-[40%] justify-end pr-2">
                  <span className={`font-medium ${match.homeTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
                    {match.homeTeam}
                  </span>
                </div>
                <div className="flex items-center justify-center w-[20%]">
                  <span className="font-bold text-xs w-6 h-6 flex items-center justify-center bg-[#c5e7ff] rounded-sm">VS</span>
                </div>
                <div className="flex items-center w-[40%] justify-start pl-2">
                  <span className={`font-medium ${match.awayTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
                    {match.awayTeam}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                {match.venue}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1">
          <Link 
            to="/fixtures" 
            className="inline-flex items-center justify-center px-3 py-1.5 bg-[#00105a] text-white text-xs font-medium rounded hover:bg-[#c5e7ff] hover:text-[#00105a] transition-colors text-center"
          >
            All Fixtures
          </Link>
          <Link 
            to="/tickets" 
            className="inline-flex items-center justify-center px-3 py-1.5 bg-white text-[#00105a] border border-[#00105a] text-xs font-medium rounded hover:bg-[#c5e7ff] hover:text-[#00105a] transition-colors"
          >
            <Ticket className="w-3 h-3 mr-1" /> Tickets
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingFixtures;

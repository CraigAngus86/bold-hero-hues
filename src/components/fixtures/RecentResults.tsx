
import { Link } from 'react-router-dom';
import { Clock, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Match, formatDate } from './types';
import { supabase } from '@/integrations/supabase/client';

interface RecentResultsProps {
  matches: Match[];
}

// Helper function to generate the photo gallery path for a match
const getMatchPhotoPath = (match: Match) => {
  const matchDate = new Date(match.date);
  const formattedDate = `${matchDate.getFullYear()}-${String(matchDate.getMonth() + 1).padStart(2, '0')}-${String(matchDate.getDate()).padStart(2, '0')}`;
  const awayTeam = match.awayTeam.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `/admin?tab=images&folder=highland-league-matches/${awayTeam}-${formattedDate}`;
};

const RecentResults = ({ matches }: RecentResultsProps) => {
  return (
    <Card className="overflow-hidden border-team-gray hover:shadow-md transition-shadow bg-white flex flex-col h-full">
      <div className="bg-[#00105a] text-white font-medium p-3 flex items-center justify-center">
        <Clock className="w-4 h-4 mr-2" />
        <h3 className="text-lg font-semibold">Recent Results</h3>
      </div>
      <CardContent className="p-3 flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          {matches.map((match) => (
            <div key={match.id} className="py-2 border-b border-gray-100 last:border-0">
              <div className="text-xs text-[#00105a] font-medium text-center mb-1.5">
                {match.competition} • {formatDate(match.date)}
              </div>
              <div className="flex items-center justify-between text-sm my-1.5">
                <div className="flex items-center w-[40%] justify-end pr-2">
                  <span className={`font-medium text-right ${match.homeTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
                    {match.homeTeam}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-3 font-bold w-[20%]">
                  <span className="w-7 h-7 flex items-center justify-center bg-[#c5e7ff] rounded-sm">{match.homeScore}</span>
                  <span className="text-xs">-</span>
                  <span className="w-7 h-7 flex items-center justify-center bg-[#c5e7ff] rounded-sm">{match.awayScore}</span>
                </div>
                <div className="flex items-center w-[40%] justify-start pl-2">
                  <span className={`font-medium text-left ${match.awayTeam === "Banks o' Dee" ? "text-[#00105a]" : ""}`}>
                    {match.awayTeam}
                  </span>
                </div>
              </div>
              
              {/* Photo Gallery Link - only show if hasMatchPhotos is true */}
              {'hasMatchPhotos' in match && match.hasMatchPhotos && (
                <div className="mt-1 text-center">
                  <Link 
                    to={getMatchPhotoPath(match)} 
                    className="inline-flex items-center justify-center text-xs text-team-blue hover:underline"
                  >
                    <Camera className="w-3 h-3 mr-1" />
                    Match Photos
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 text-center">
          <Link 
            to="/fixtures" 
            className="inline-block px-3 py-2 bg-[#00105a] text-white text-xs font-medium rounded hover:bg-[#c5e7ff] hover:text-[#00105a] transition-colors w-full text-center"
          >
            All Results
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentResults;

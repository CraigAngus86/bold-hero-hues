
import { Calendar, Clock, Ticket } from 'lucide-react';
import { Match } from './types';
import { formatDate } from './utils';

interface MatchDetailProps {
  match: Match;
}

const MatchDetail = ({ match }: MatchDetailProps) => {
  return (
    <div className="bg-team-lightBlue/20 p-4 rounded-lg mb-6">
      <h3 className="font-bold text-lg mb-2">{match.homeTeam} vs {match.awayTeam}</h3>
      <div className="flex flex-col sm:flex-row sm:justify-between text-gray-700">
        <div className="flex items-center mb-2 sm:mb-0">
          <Calendar className="w-4 h-4 mr-2 text-team-blue" />
          <span>{formatDate(match.date)}</span>
        </div>
        <div className="flex items-center mb-2 sm:mb-0">
          <Clock className="w-4 h-4 mr-2 text-team-blue" />
          <span>{match.time}</span>
        </div>
        <div className="flex items-center">
          <Ticket className="w-4 h-4 mr-2 text-team-blue" />
          <span>{match.competition}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;

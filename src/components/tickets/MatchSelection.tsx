
import { useState } from 'react';
import { Calendar, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Match } from './types';
import { formatDate } from './utils';

interface MatchSelectionProps {
  upcomingMatches: Match[];
  selectedMatch: Match | null;
  onMatchSelect: (match: Match) => void;
}

const MatchSelection = ({ upcomingMatches, selectedMatch, onMatchSelect }: MatchSelectionProps) => {
  return (
    <div className="md:col-span-1">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-team-blue mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Upcoming Home Matches
        </h2>
        
        <div className="space-y-4">
          {upcomingMatches.map((match) => (
            <button
              key={match.id}
              onClick={() => onMatchSelect(match)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedMatch?.id === match.id 
                  ? 'border-team-blue bg-team-lightBlue/20' 
                  : 'border-gray-200 hover:border-team-blue/50 hover:bg-gray-50'
              }`}
            >
              <p className="text-xs font-medium text-team-blue">{match.competition}</p>
              <p className="font-bold mb-1">{match.homeTeam} vs {match.awayTeam}</p>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{formatDate(match.date)}</span>
                <span>{match.time}</span>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-team-blue mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                Tickets can also be purchased on match day at the Spain Park ticket office, 
                which opens 1.5 hours before kick-off.
              </p>
              <p>
                For group bookings or further information, please contact the club directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSelection;

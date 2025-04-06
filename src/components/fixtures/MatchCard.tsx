
import React from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Match } from './types';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  highlightTeam?: string;
  showTicketButton?: boolean;
  showPhotos?: boolean;
}

// Helper to format the date
const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'EEE, d MMM yyyy');
  } catch (error) {
    return dateString;
  }
};

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  highlightTeam = "Banks o' Dee",
  showTicketButton = true,
  showPhotos = false,
}) => {
  const isHighlightedHome = match.homeTeam.includes(highlightTeam);
  const isHighlightedAway = match.awayTeam.includes(highlightTeam);
  
  // Score or vs display
  const scoreDisplay = match.isCompleted 
    ? `${match.homeScore} - ${match.awayScore}`
    : 'vs';
  
  // Determine result class for highlighted team if completed
  let resultClass = '';
  if (match.isCompleted && (isHighlightedHome || isHighlightedAway)) {
    if (match.homeScore === match.awayScore) {
      resultClass = 'border-yellow-300';
    } else if ((isHighlightedHome && match.homeScore > match.awayScore) || 
               (isHighlightedAway && match.awayScore > match.homeScore)) {
      resultClass = 'border-green-300';
    } else {
      resultClass = 'border-red-300';
    }
  }
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${resultClass} overflow-hidden`}>
      {/* Competition & Date Banner */}
      <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-b">
        <Badge variant="outline" className="text-xs font-medium">
          {match.competition}
        </Badge>
        <span className="text-xs text-gray-500">{formatDate(match.date)}</span>
      </div>
      
      {/* Teams & Score */}
      <div className="p-4">
        {/* Teams */}
        <div className="flex items-center justify-between mb-4">
          <div className={`text-right flex-1 ${isHighlightedHome ? 'font-bold' : ''}`}>
            {match.homeTeam}
          </div>
          
          <div className="mx-4 text-center">
            <span className={`inline-block px-3 py-1 ${match.isCompleted ? 'font-bold text-lg' : 'text-sm text-gray-500'}`}>
              {scoreDisplay}
            </span>
            {match.time && !match.isCompleted && (
              <div className="text-xs text-gray-400 mt-1">{match.time}</div>
            )}
          </div>
          
          <div className={`text-left flex-1 ${isHighlightedAway ? 'font-bold' : ''}`}>
            {match.awayTeam}
          </div>
        </div>
        
        {/* Venue */}
        <div className="text-xs text-gray-500 text-center">
          {match.venue}
        </div>
      </div>
      
      {/* Actions */}
      {(showTicketButton && match.ticketLink && !match.isCompleted) || 
       (showPhotos && match.hasMatchPhotos) ? (
        <div className="px-4 py-2 bg-gray-50 border-t flex justify-center">
          {showTicketButton && match.ticketLink && !match.isCompleted && (
            <a 
              href={match.ticketLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center mr-4"
            >
              Buy Tickets <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          )}
          
          {showPhotos && match.hasMatchPhotos && (
            <Link 
              to={`/media/match/${match.id}`}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              View Photos
            </Link>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default MatchCard;

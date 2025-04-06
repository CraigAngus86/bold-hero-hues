
import React from 'react';
import { Match } from '@/types/fixtures';
import MatchCard from './MatchCard';

interface UpcomingMatchesCarouselProps {
  matches: Match[];
}

const UpcomingMatchesCarousel: React.FC<UpcomingMatchesCarouselProps> = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return <p className="text-gray-500 text-center py-8">No upcoming matches scheduled</p>;
  }
  
  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} showTicketButton={true} />
      ))}
    </div>
  );
};

export default UpcomingMatchesCarousel;

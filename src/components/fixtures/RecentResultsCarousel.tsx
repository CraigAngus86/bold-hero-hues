
import React from 'react';
import { Match } from '@/types/fixtures';
import MatchCard from './MatchCard';

interface RecentResultsCarouselProps {
  matches: Match[];
}

const RecentResultsCarousel: React.FC<RecentResultsCarouselProps> = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return <p className="text-gray-500 text-center py-8">No recent match results</p>;
  }
  
  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <MatchCard key={match.id} match={{...match, isCompleted: true}} showTicketButton={false} />
      ))}
    </div>
  );
};

export default RecentResultsCarousel;


import { useState } from 'react';
import PlayerCard from './PlayerCard';
import PositionFilter from './team/PositionFilter';
import { motion } from 'framer-motion';
import { PlayerPosition } from '@/components/player/PlayerCardDialog';
import { Player } from '@/services/teamService';

// Animation variants for staggered animation
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface TeamGridProps {
  players: Player[];
  title?: string;
  showFilter?: boolean;
}

const TeamGrid = ({ players, title = "First Team", showFilter = true }: TeamGridProps) => {
  const [selectedPosition, setSelectedPosition] = useState<PlayerPosition | 'all'>('all');
  
  const filteredPlayers = selectedPosition === 'all'
    ? players
    : players.filter(player => player.position === selectedPosition);
  
  const positionCounts = {
    goalkeeper: players.filter(p => p.position === 'goalkeeper').length,
    defender: players.filter(p => p.position === 'defender').length,
    midfielder: players.filter(p => p.position === 'midfielder').length,
    forward: players.filter(p => p.position === 'forward').length
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {title && (
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
      )}
      
      {showFilter && (
        <PositionFilter 
          selectedPosition={selectedPosition}
          onPositionChange={setSelectedPosition}
          positionCounts={positionCounts}
        />
      )}
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredPlayers.map((player) => (
          <motion.div key={player.id} variants={item}>
            <PlayerCard player={player} />
          </motion.div>
        ))}
        
        {filteredPlayers.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <p className="text-gray-500">No players found for the selected position.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TeamGrid;


import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { players } from '@/data/players';
import PositionFilter from './team/PositionFilter';
import PlayerList from './team/PlayerList';

const positions = ["All", "Goalkeeper", "Defender", "Midfielder", "Forward"];

const TeamGrid = () => {
  const [selectedPosition, setSelectedPosition] = useState("All");
  
  const filteredPlayers = selectedPosition === "All" 
    ? players 
    : players.filter(player => player.position === selectedPosition);
  
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white"
    >
      <div className="flex items-center mb-8">
        <Award className="w-6 h-6 text-[#00105a] mr-3" />
        <h2 className="text-3xl font-bold text-[#00105a]">Player Squad</h2>
      </div>
      
      <PositionFilter 
        positions={positions}
        selectedPosition={selectedPosition}
        onPositionChange={setSelectedPosition}
      />
      
      <PlayerList players={filteredPlayers} />
    </motion.section>
  );
};

export default TeamGrid;

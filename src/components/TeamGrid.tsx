
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ChevronDown, ChevronUp } from 'lucide-react';
import { players } from '@/data/players';
import PositionFilter from './team/PositionFilter';
import PlayerList from './team/PlayerList';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const positions = ["All", "Goalkeeper", "Defender", "Midfielder", "Forward"];

const TeamGrid = () => {
  const [selectedPosition, setSelectedPosition] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  
  const filteredPlayers = selectedPosition === "All" 
    ? players 
    : players.filter(player => player.position === selectedPosition);
  
  const visiblePlayers = isOpen ? filteredPlayers : filteredPlayers.slice(0, 4);
  
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white"
    >
      <div className="flex items-center justify-center mb-8">
        <Award className="w-6 h-6 text-[#00105a] mr-3" />
        <h2 className="text-2xl font-semibold text-[#00105a]">Player Squad</h2>
      </div>
      
      <PositionFilter 
        positions={positions}
        selectedPosition={selectedPosition}
        onPositionChange={setSelectedPosition}
      />
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <PlayerList players={visiblePlayers} />
        
        {filteredPlayers.length > 4 && (
          <div className="flex justify-center mt-6">
            <CollapsibleTrigger className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors border border-[#00105a]/20 flex items-center justify-center">
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-[#00105a]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#00105a]" />
              )}
            </CollapsibleTrigger>
          </div>
        )}
        
        {filteredPlayers.length > 4 && (
          <CollapsibleContent>
            <PlayerList players={filteredPlayers.slice(4)} />
          </CollapsibleContent>
        )}
      </Collapsible>
    </motion.section>
  );
};

export default TeamGrid;


import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ChevronDown, ChevronUp } from 'lucide-react';
import PositionFilter from './team/PositionFilter';
import PlayerList from './team/PlayerList';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useTeamStore } from '@/services/teamService';

const positions = ["All", "Goalkeeper", "Defender", "Midfielder", "Forward"];

const TeamGrid = () => {
  const [selectedPosition, setSelectedPosition] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const { getPlayersByPosition } = useTeamStore();
  
  const filteredPlayers = getPlayersByPosition(selectedPosition);
  
  // Show only first 12 players initially, then the rest in collapsible content
  const initialPlayers = filteredPlayers.slice(0, 12);
  const remainingPlayers = filteredPlayers.slice(12);
  
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
        <PlayerList players={initialPlayers} />
        
        {remainingPlayers.length > 0 && (
          <CollapsibleContent>
            <div className="mt-8">
              <PlayerList players={remainingPlayers} />
            </div>
          </CollapsibleContent>
        )}
        
        {remainingPlayers.length > 0 && (
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
      </Collapsible>
    </motion.section>
  );
};

export default TeamGrid;

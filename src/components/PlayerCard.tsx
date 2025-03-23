
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import PlayerCardFront from './player/PlayerCardFront';
import PlayerCardBack from './player/PlayerCardBack';
import { ChevronRight } from 'lucide-react';

interface PlayerCardProps {
  name: string;
  position: string;
  number: number;
  image: string;
  stats?: {
    appearances?: number;
    goals?: number;
    assists?: number;
    cleanSheets?: number;
  };
  biography?: string;
  onClick?: () => void;
}

const PlayerCard = (props: PlayerCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="w-full perspective"
    >
      <div 
        className={cn(
          "relative w-full rounded-lg overflow-hidden transition-all duration-700 preserve-3d cursor-pointer shadow-lg hover:shadow-xl h-64",
          isFlipped ? "rotate-y-180" : ""
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (props.onClick) {
            props.onClick();
          } else {
            toggleFlip();
          }
        }}
      >
        {/* Front Card */}
        <div className="absolute inset-0 backface-hidden">
          <div className="h-full flex flex-col">
            <div className="relative h-4/5 overflow-hidden bg-gradient-to-b from-[#00105a] to-[#00105a]/80">
              <img 
                src={props.image} 
                alt={props.name} 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-full object-cover object-top"
              />
            </div>
            
            <div className="bg-white p-3 flex-1 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-center text-[#00105a]">{props.name}</h3>
              <p className="text-center text-gray-500 font-medium text-sm">{props.position}</p>
            </div>
          </div>
          
          <div className="absolute bottom-12 right-4 bg-white/80 px-3 py-1.5 rounded-full text-xs font-medium text-[#00105a] animate-pulse flex items-center z-10">
            <span>View Profile</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
        
        {/* Back Card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white">
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold text-[#00105a]">{props.name}</h3>
                <p className="text-gray-500 text-sm">{props.position}</p>
              </div>
              <div className="w-12 h-12 overflow-hidden rounded-md">
                <img 
                  src={props.image} 
                  alt={props.name} 
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            
            <div className="mt-auto pt-2 text-center">
              <button className="bg-[#00105a] text-white px-4 py-2 rounded-md text-sm inline-flex items-center">
                View Profile
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerCard;

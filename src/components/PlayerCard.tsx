
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
}

const PlayerCard = ({
  name,
  position,
  number,
  image,
  stats,
  biography,
}: PlayerCardProps) => {
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
          "relative w-full rounded-lg overflow-hidden transition-all duration-700 preserve-3d cursor-pointer shadow-lg hover:shadow-xl h-[420px]",
          isFlipped ? "rotate-y-180" : ""
        )}
        onClick={toggleFlip}
      >
        {/* Front Card */}
        <div className="absolute inset-0 backface-hidden">
          <div className="h-full flex flex-col">
            <div className="relative h-80 overflow-hidden bg-gradient-to-b from-team-blue to-team-blue/80">
              <div className="absolute right-4 top-4 z-10">
                <span className="flex items-center justify-center w-12 h-12 bg-white rounded-full text-team-blue text-2xl font-bold">
                  {number}
                </span>
              </div>
              <img 
                src={image} 
                alt={name} 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-full object-cover object-top"
              />
            </div>
            
            <div className="bg-white p-4 flex-1 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-center text-gray-900">{name}</h3>
              <p className="text-center text-gray-500 font-medium">{position}</p>
            </div>
          </div>
        </div>
        
        {/* Back Card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white">
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                <p className="text-gray-500">{position} <span className="font-medium">#{number}</span></p>
              </div>
              <div>
                <span className="flex items-center justify-center w-12 h-12 bg-team-blue rounded-full text-white text-xl font-bold">
                  {number}
                </span>
              </div>
            </div>
            
            {stats && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {stats.appearances !== undefined && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-2xl font-bold text-team-blue">{stats.appearances}</p>
                    <p className="text-sm text-gray-500">Appearances</p>
                  </div>
                )}
                {stats.goals !== undefined && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-2xl font-bold text-team-blue">{stats.goals}</p>
                    <p className="text-sm text-gray-500">Goals</p>
                  </div>
                )}
                {stats.assists !== undefined && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-2xl font-bold text-team-blue">{stats.assists}</p>
                    <p className="text-sm text-gray-500">Assists</p>
                  </div>
                )}
                {stats.cleanSheets !== undefined && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-2xl font-bold text-team-blue">{stats.cleanSheets}</p>
                    <p className="text-sm text-gray-500">Clean Sheets</p>
                  </div>
                )}
              </div>
            )}
            
            {biography && (
              <div className="flex-1 overflow-y-auto text-gray-600 text-sm pr-2">
                <p>{biography}</p>
              </div>
            )}
            
            <div className="mt-auto pt-4 text-xs text-center text-gray-400">
              Click to flip card
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerCard;

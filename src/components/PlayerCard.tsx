
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Determine which stats to show based on position
  const showCleanSheets = position === "Goalkeeper";
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="w-full perspective"
        >
          <div 
            className={cn(
              "relative w-full rounded-lg overflow-hidden transition-all duration-700 preserve-3d cursor-pointer shadow-lg hover:shadow-xl h-[400px]",
              isFlipped ? "rotate-y-180" : ""
            )}
            onClick={toggleFlip}
          >
            {/* Front Card */}
            <div className="absolute inset-0 backface-hidden">
              <div className="h-full flex flex-col">
                <div className="relative h-72 overflow-hidden bg-gradient-to-b from-[#00105a] to-[#00105a]/80">
                  <img 
                    src={image} 
                    alt={name} 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-full object-cover object-top"
                  />
                  
                  {/* Click for more indicator */}
                  <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1.5 rounded-full text-xs font-medium text-[#00105a] animate-pulse flex items-center">
                    <span>Click for more</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
                
                <div className="bg-white p-4 flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-center text-[#00105a]">{name}</h3>
                  <p className="text-center text-gray-500 font-medium">{position}</p>
                </div>
              </div>
            </div>
            
            {/* Back Card */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white">
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-xl font-bold text-[#00105a]">{name}</h3>
                    <p className="text-gray-500">{position}</p>
                  </div>
                  <div className="w-14 h-14 overflow-hidden rounded-md">
                    <img 
                      src={image} 
                      alt={name} 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
                
                {stats && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {stats.appearances !== undefined && (
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-2xl font-bold text-[#00105a]">{stats.appearances}</p>
                        <p className="text-sm text-gray-500">Appearances</p>
                      </div>
                    )}
                    {showCleanSheets && stats.cleanSheets !== undefined && (
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-2xl font-bold text-[#00105a]">{stats.cleanSheets}</p>
                        <p className="text-sm text-gray-500">Clean Sheets</p>
                      </div>
                    )}
                    {!showCleanSheets && stats.goals !== undefined && (
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-2xl font-bold text-[#00105a]">{stats.goals}</p>
                        <p className="text-sm text-gray-500">Goals</p>
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
                  Click for more
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#00105a]">{name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="md:w-1/3">
            <div className="rounded-lg overflow-hidden">
              <img 
                src={image} 
                alt={name} 
                className="w-full h-auto aspect-square object-cover object-top"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#00105a]">Player Details</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="font-medium">{position}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Squad Number</p>
                  <p className="font-medium">#{number}</p>
                </div>
              </div>
            </div>
            
            {stats && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#00105a] mb-2">Season Stats</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {stats.appearances !== undefined && (
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-2xl font-bold text-[#00105a]">{stats.appearances}</p>
                      <p className="text-sm text-gray-500">Appearances</p>
                    </div>
                  )}
                  {stats.goals !== undefined && (
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-2xl font-bold text-[#00105a]">{stats.goals}</p>
                      <p className="text-sm text-gray-500">Goals</p>
                    </div>
                  )}
                  {stats.assists !== undefined && (
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-2xl font-bold text-[#00105a]">{stats.assists}</p>
                      <p className="text-sm text-gray-500">Assists</p>
                    </div>
                  )}
                  {stats.cleanSheets !== undefined && (
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-2xl font-bold text-[#00105a]">{stats.cleanSheets}</p>
                      <p className="text-sm text-gray-500">Clean Sheets</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {biography && (
              <div>
                <h3 className="text-lg font-semibold text-[#00105a] mb-2">Biography</h3>
                <p className="text-gray-600">{biography}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerCard;

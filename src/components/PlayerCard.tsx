
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { CircleArrowRight } from 'lucide-react';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const openDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (props.onClick) {
      props.onClick();
    } else {
      setIsDialogOpen(true);
    }
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="w-full perspective"
      >
        <div 
          className={cn(
            "relative w-full rounded-lg overflow-hidden transition-all duration-700 preserve-3d cursor-pointer shadow-lg hover:shadow-xl h-24",
            isFlipped ? "rotate-y-180" : ""
          )}
          onClick={toggleFlip}
          onDoubleClick={openDialog}
        >
          {/* Front Card */}
          <div className="absolute inset-0 backface-hidden">
            <div className="h-full flex">
              <div className="relative h-full w-1/2 overflow-hidden bg-[#00105a]">
                <img 
                  src={props.image} 
                  alt={props.name} 
                  className="h-full w-full object-cover object-center"
                />
              </div>
              
              <div className="bg-white px-3 py-2 flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#00105a] line-clamp-1">{props.name}</h3>
                    <p className="text-gray-500 font-medium text-xs line-clamp-1">{props.position}</p>
                  </div>
                  <button 
                    className="text-[#00105a] p-1.5 rounded-full hover:bg-gray-100 transition-colors border border-[#00105a]/20"
                    onClick={openDialog}
                    aria-label="View player details"
                  >
                    <CircleArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back Card */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white">
            <div className="flex h-full p-2">
              <div className="w-16 h-16 overflow-hidden rounded-md self-center mr-3">
                <img 
                  src={props.image} 
                  alt={props.name} 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#00105a]">{props.name}</h3>
                    <p className="text-gray-500 text-xs">{props.position}</p>
                  </div>
                  <button 
                    className="text-[#00105a] p-1.5 rounded-full hover:bg-gray-100 transition-colors border border-[#00105a]/20"
                    onClick={openDialog}
                    aria-label="View player details"
                  >
                    <CircleArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {!props.onClick && (
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#00105a]">{props.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="md:w-1/3">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={props.image} 
                  alt={props.name} 
                  className="w-full h-auto aspect-square object-cover object-center"
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#00105a]">Player Details</h3>
                <div className="bg-gray-50 p-3 rounded-md mt-2">
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="font-medium">{props.position}</p>
                </div>
                {props.number && (
                  <div className="bg-gray-50 p-3 rounded-md mt-2">
                    <p className="text-sm text-gray-500">Jersey Number</p>
                    <p className="font-medium">{props.number}</p>
                  </div>
                )}
              </div>
              
              {props.stats && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[#00105a] mb-2">Statistics</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {props.stats.appearances !== undefined && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Appearances</p>
                        <p className="font-medium">{props.stats.appearances}</p>
                      </div>
                    )}
                    {props.stats.goals !== undefined && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Goals</p>
                        <p className="font-medium">{props.stats.goals}</p>
                      </div>
                    )}
                    {props.stats.assists !== undefined && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Assists</p>
                        <p className="font-medium">{props.stats.assists}</p>
                      </div>
                    )}
                    {props.stats.cleanSheets !== undefined && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Clean Sheets</p>
                        <p className="font-medium">{props.stats.cleanSheets}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {props.biography && (
                <div>
                  <h3 className="text-lg font-semibold text-[#00105a] mb-2">Biography</h3>
                  <p className="text-gray-600">{props.biography}</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default PlayerCard;

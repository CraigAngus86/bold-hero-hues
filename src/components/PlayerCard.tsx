
import { useState } from 'react';
import { motion } from 'framer-motion';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import PlayerCardFront from './player/PlayerCardFront';
import PlayerCardBack from './player/PlayerCardBack';
import PlayerCardDialog from './player/PlayerCardDialog';

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

const PlayerCard = (props: PlayerCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  return (
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
          <PlayerCardFront 
            name={props.name} 
            position={props.position} 
            image={props.image} 
          />
          
          <PlayerCardBack
            name={props.name}
            position={props.position}
            image={props.image}
            stats={props.stats}
            biography={props.biography}
          />
        </div>
      </motion.div>
    </DialogTrigger>
  );
};

export default PlayerCard;

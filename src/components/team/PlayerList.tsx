
import PlayerCard from './PlayerCard';
import { motion } from 'framer-motion';

interface Player {
  id: number;
  name: string;
  position: string;
  imageUrl: string;
  number: number;
}

interface PlayerListProps {
  players: Player[];
}

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

const PlayerList = ({ players }: PlayerListProps) => {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {players.map((player) => (
        <motion.div key={player.id} variants={item}>
          <PlayerCard
            name={player.name}
            position={player.position}
            number={player.number}
            imageUrl={player.imageUrl}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PlayerList;

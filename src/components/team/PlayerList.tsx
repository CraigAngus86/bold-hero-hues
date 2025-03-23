
import { motion } from 'framer-motion';
import PlayerCard from '../PlayerCard';
import { Player } from '@/data/players';

interface PlayerListProps {
  players: Player[];
}

const PlayerList = ({ players }: PlayerListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {players.map((player) => (
        <motion.div
          key={player.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 * (player.id % 8) }}
        >
          <PlayerCard
            name={player.name}
            position={player.position}
            number={player.number}
            image={player.image}
            stats={player.stats}
            biography={player.biography}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default PlayerList;

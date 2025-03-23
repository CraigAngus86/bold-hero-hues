
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
        <PlayerCard
          key={player.id}
          name={player.name}
          position={player.position}
          number={player.number}
          image={player.image}
          stats={player.stats}
          biography={player.biography}
        />
      ))}
    </div>
  );
};

export default PlayerList;

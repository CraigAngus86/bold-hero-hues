
import { motion } from 'framer-motion';
import PlayerCard from '../PlayerCard';
import PlayerCardDialog from '../player/PlayerCardDialog';
import { Player } from '@/data/players';
import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';

interface PlayerListProps {
  players: Player[];
}

const PlayerList = ({ players }: PlayerListProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsDialogOpen(true);
  };

  return (
    <>
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
              onClick={() => handlePlayerClick(player)}
            />
          </motion.div>
        ))}
      </div>

      {selectedPlayer && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <PlayerCardDialog
            name={selectedPlayer.name}
            position={selectedPlayer.position}
            number={selectedPlayer.number}
            image={selectedPlayer.image}
            stats={selectedPlayer.stats}
            biography={selectedPlayer.biography}
          />
        </Dialog>
      )}
    </>
  );
};

export default PlayerList;

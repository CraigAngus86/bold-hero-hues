
import { Player } from './PlayerForm';
import PlayerCard from './PlayerCard';

interface PlayerListProps {
  players: Player[];
  selectedPosition: string | null;
  editingId: string | null;
  onEdit: (player: Player) => void;
  onDelete: (id: string) => void;
}

const PlayerList = ({ 
  players, 
  selectedPosition, 
  editingId, 
  onEdit, 
  onDelete 
}: PlayerListProps) => {
  const filteredPlayers = selectedPosition 
    ? players.filter(player => player.position === selectedPosition)
    : players;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPlayers.length === 0 ? (
        <div className="col-span-full text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No players found.</p>
        </div>
      ) : (
        filteredPlayers.map(player => (
          <PlayerCard 
            key={player.id} 
            player={player} 
            isEditing={editingId !== null}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default PlayerList;


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { TeamPlayersList } from './TeamPlayersList';
import PlayerForm, { Player } from './PlayerForm';
import { useTeam } from './contexts/TeamContext';
import { toast } from 'sonner';

const PlayersSection = () => {
  const { players, setPlayers } = useTeam();
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isEditingPlayer, setIsEditingPlayer] = useState<Player | null>(null);
  
  const [newPlayerData, setNewPlayerData] = useState<Omit<Player, 'id'>>({
    name: '',
    position: 'Midfielder',
    number: 0,
    age: 0,
    height: '',
    previousClubs: '',
    bio: '',
    image: ''
  });
  
  const handleAddPlayer = () => {
    setIsAddingPlayer(true);
    setIsEditingPlayer(null);
    setNewPlayerData({
      name: '',
      position: 'Midfielder',
      number: 0,
      age: 0,
      height: '',
      previousClubs: '',
      bio: '',
      image: ''
    });
  };
  
  const handleEditPlayer = (player: Player) => {
    setIsAddingPlayer(false);
    setIsEditingPlayer(player);
    setNewPlayerData({
      name: player.name,
      position: player.position,
      number: player.number,
      age: player.age,
      height: player.height,
      previousClubs: player.previousClubs,
      bio: player.bio,
      image: player.image
    });
  };
  
  const handlePlayerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPlayerData(prev => ({
      ...prev,
      [name]: name === 'number' || name === 'age' ? parseInt(value) || 0 : value
    }));
  };
  
  const handlePlayerSelectChange = (value: string) => {
    setNewPlayerData(prev => ({
      ...prev,
      position: value
    }));
  };
  
  const handleSavePlayer = () => {
    if (isEditingPlayer) {
      // Update existing player
      setPlayers(players.map(player => 
        player.id === isEditingPlayer.id 
          ? { ...player, ...newPlayerData } 
          : player
      ));
      toast.success(`Player ${newPlayerData.name} updated successfully`);
    } else {
      // Add new player
      const newPlayer: Player = {
        id: Date.now().toString(),
        ...newPlayerData
      };
      setPlayers([...players, newPlayer]);
      toast.success(`Player ${newPlayerData.name} added successfully`);
    }
    
    setIsAddingPlayer(false);
    setIsEditingPlayer(null);
  };
  
  const handleDeletePlayer = (id: string) => {
    setPlayers(players.filter(player => player.id !== id));
    toast.success('Player removed successfully');
  };
  
  const handleCancelPlayerForm = () => {
    setIsAddingPlayer(false);
    setIsEditingPlayer(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Players</h3>
        
        {!isAddingPlayer && !isEditingPlayer && (
          <Button onClick={handleAddPlayer} className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Player
          </Button>
        )}
      </div>
      
      {(isAddingPlayer || isEditingPlayer) && (
        <PlayerForm 
          isEditing={!!isEditingPlayer}
          formData={newPlayerData}
          onInputChange={handlePlayerInputChange}
          onSelectChange={handlePlayerSelectChange}
          onSave={handleSavePlayer}
          onCancel={handleCancelPlayerForm}
        />
      )}
      
      <TeamPlayersList 
        players={players} 
        onEdit={handleEditPlayer} 
        onDelete={handleDeletePlayer} 
      />
    </>
  );
};

export default PlayersSection;


import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import PlayerForm, { Player } from './team/PlayerForm';
import PlayerFilter from './team/PlayerFilter';
import PlayerList from './team/PlayerList';

const TEAM_STORAGE_KEY = 'banks_o_dee_team';

const TeamManager = () => {
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem(TEAM_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    
    // If no saved data, try to import from players.ts
    try {
      const { players } = require('@/data/players');
      return players.map((p: any, index: number) => ({
        ...p,
        id: index.toString()
      }));
    } catch (e) {
      return [];
    }
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Player, 'id'>>({
    name: '',
    position: 'Midfielder',
    number: 1,
    age: 20,
    height: '5\'10"',
    previousClubs: '',
    bio: '',
    image: ''
  });
  
  useEffect(() => {
    saveToLocalStorage(players);
  }, [players]);
  
  const saveToLocalStorage = (data: Player[]) => {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(data));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value
    }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, position: value }));
  };
  
  const handleAddPlayer = () => {
    if (!formData.name || !formData.position) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newPlayer: Player = {
      ...formData,
      id: Date.now().toString()
    };
    
    const updatedPlayers = [...players, newPlayer];
    setPlayers(updatedPlayers);
    
    setFormData({
      name: '',
      position: 'Midfielder',
      number: Math.max(...players.map(p => p.number), 0) + 1,
      age: 20,
      height: '5\'10"',
      previousClubs: '',
      bio: '',
      image: ''
    });
    
    setIsAdding(false);
    toast.success('Player added successfully');
  };
  
  const handleStartEdit = (player: Player) => {
    setEditingId(player.id);
    setFormData({
      name: player.name,
      position: player.position,
      number: player.number,
      age: player.age,
      height: player.height,
      previousClubs: player.previousClubs,
      bio: player.bio,
      image: player.image || ''
    });
  };
  
  const handleSaveEdit = () => {
    if (!editingId) return;
    
    if (!formData.name || !formData.position) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const updatedPlayers = players.map(player => 
      player.id === editingId ? { ...formData, id: editingId } : player
    );
    
    setPlayers(updatedPlayers);
    setEditingId(null);
    toast.success('Player updated successfully');
  };
  
  const handleDelete = (id: string) => {
    const updatedPlayers = players.filter(player => player.id !== id);
    setPlayers(updatedPlayers);
    toast.success('Player deleted successfully');
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      name: '',
      position: 'Midfielder',
      number: Math.max(...players.map(p => p.number), 0) + 1,
      age: 20,
      height: '5\'10"',
      previousClubs: '',
      bio: '',
      image: ''
    });
  };
  
  const handleSave = () => {
    if (editingId) {
      handleSaveEdit();
    } else {
      handleAddPlayer();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Team Manager</CardTitle>
        <CardDescription>Add, edit, or delete players in the squad</CardDescription>
      </CardHeader>
      
      <CardContent>
        <PlayerFilter 
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
        />
        
        {(isAdding || editingId) && (
          <PlayerForm 
            isEditing={!!editingId}
            formData={formData}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onSave={handleSave}
            onCancel={handleCancelEdit}
          />
        )}
        
        <PlayerList 
          players={players}
          selectedPosition={selectedPosition}
          editingId={editingId}
          onEdit={handleStartEdit}
          onDelete={handleDelete}
        />
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-sm text-gray-500">
          Total players: {players.length}
        </p>
      </CardFooter>
    </Card>
  );
};

export default TeamManager;

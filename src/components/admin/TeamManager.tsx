
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, Save, X } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  age: number;
  height: string;
  previousClubs: string;
  bio: string;
  image?: string;
}

const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
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
  
  const handleSaveEdit = (id: string) => {
    if (!formData.name || !formData.position) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const updatedPlayers = players.map(player => 
      player.id === id ? { ...formData, id } : player
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
  
  const filteredPlayers = selectedPosition 
    ? players.filter(player => player.position === selectedPosition)
    : players;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Team Manager</CardTitle>
        <CardDescription>Add, edit, or delete players in the squad</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="position-filter">Filter by Position:</Label>
            <Select value={selectedPosition || ''} onValueChange={setSelectedPosition}>
              <SelectTrigger id="position-filter" className="w-40">
                <SelectValue placeholder="All Positions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Positions</SelectItem>
                {POSITIONS.map(pos => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {!isAdding && (
            <Button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Player</span>
            </Button>
          )}
        </div>
        
        {(isAdding || editingId) && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-medium mb-4">
              {editingId ? 'Edit Player' : 'Add Player'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Name*</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="position">Position*</Label>
                  <Select value={formData.position} onValueChange={handleSelectChange}>
                    <SelectTrigger id="position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITIONS.map(pos => (
                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="number">Jersey Number</Label>
                    <Input 
                      id="number" 
                      name="number" 
                      type="number" 
                      value={formData.number} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      name="age" 
                      type="number" 
                      value={formData.age} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input 
                    id="height" 
                    name="height" 
                    value={formData.height} 
                    onChange={handleInputChange} 
                    placeholder="5'10\""
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="previousClubs">Previous Clubs</Label>
                  <Input 
                    id="previousClubs" 
                    name="previousClubs" 
                    value={formData.previousClubs} 
                    onChange={handleInputChange} 
                    placeholder="Aberdeen, Cove Rangers"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio">Biography</Label>
                  <Input 
                    id="bio" 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input 
                    id="image" 
                    name="image" 
                    value={formData.image} 
                    onChange={handleInputChange} 
                    placeholder="https://example.com/image.jpg" 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              
              {editingId ? (
                <Button onClick={() => handleSaveEdit(editingId)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              ) : (
                <Button onClick={handleAddPlayer}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Player
                </Button>
              )}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlayers.length === 0 ? (
            <div className="col-span-full text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No players found.</p>
            </div>
          ) : (
            filteredPlayers.map(player => (
              <Card key={player.id} className={editingId === player.id ? 'border-blue-500' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-sm font-medium bg-team-blue text-white w-6 h-6 rounded-full flex items-center justify-center">
                          {player.number}
                        </span>
                        {player.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500">{player.position}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleStartEdit(player)}
                        disabled={!!editingId}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(player.id)}
                        disabled={!!editingId}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    {player.image ? (
                      <img 
                        src={player.image} 
                        alt={player.name}
                        className="w-16 h-16 object-cover rounded-full" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div className="text-sm">
                      <p><span className="font-medium">Age:</span> {player.age}</p>
                      <p><span className="font-medium">Height:</span> {player.height}</p>
                      {player.previousClubs && (
                        <p><span className="font-medium">Previous:</span> {player.previousClubs}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
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

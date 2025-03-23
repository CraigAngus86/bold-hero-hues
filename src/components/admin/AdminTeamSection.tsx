
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { TeamPlayersList } from '@/components/admin/team/TeamPlayersList';
import { ManagementList } from '@/components/admin/team/ManagementList';
import PlayerForm, { Player } from '@/components/admin/team/PlayerForm';
import StaffForm, { StaffMember } from '@/components/admin/team/StaffForm';
import { toast } from 'sonner';

// Import some initial mock data
import { players as initialPlayers } from '@/data/players';

// Convert to the format we need
const mockPlayers: Player[] = initialPlayers.map((player, index) => ({
  id: (index + 1).toString(),
  name: player.name,
  position: player.position,
  number: player.number || 0,
  age: player.age || 25,
  height: player.height || "5'10\"",
  previousClubs: player.previousClubs || "",
  bio: player.bio || "",
  image: player.image
}));

// Mock staff data
const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Josh Winton',
    role: 'Manager',
    bio: 'Experienced manager with a history of success in the Highland League. Joined Banks o\' Dee in 2022.',
    image: '/lovable-uploads/banks-o-dee-logo.png'
  },
  {
    id: '2',
    name: 'Craig Fraser',
    role: 'Assistant Manager',
    bio: 'Former player who transitioned to coaching. Working alongside the manager to develop team tactics and strategy.',
    image: '/lovable-uploads/banks-o-dee-logo.png'
  },
  {
    id: '3',
    name: 'Sarah McKenzie',
    role: 'Physiotherapist',
    bio: 'Qualified physiotherapist with experience working in sports medicine. Responsible for player rehabilitation and injury prevention.',
    image: '/lovable-uploads/banks-o-dee-logo.png'
  }
];

const AdminTeamSection = () => {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isEditingPlayer, setIsEditingPlayer] = useState<Player | null>(null);
  
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [isEditingStaff, setIsEditingStaff] = useState<StaffMember | null>(null);
  
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
  
  const [newStaffData, setNewStaffData] = useState<Omit<StaffMember, 'id'>>({
    name: '',
    role: '',
    bio: '',
    image: ''
  });
  
  // Player handlers
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
  
  // Staff handlers
  const handleAddStaff = () => {
    setIsAddingStaff(true);
    setIsEditingStaff(null);
    setNewStaffData({
      name: '',
      role: '',
      bio: '',
      image: ''
    });
  };
  
  const handleEditStaff = (member: StaffMember) => {
    setIsAddingStaff(false);
    setIsEditingStaff(member);
    setNewStaffData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: member.image
    });
  };
  
  const handleStaffInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewStaffData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveStaff = () => {
    if (isEditingStaff) {
      // Update existing staff member
      setStaff(staff.map(member => 
        member.id === isEditingStaff.id 
          ? { ...member, ...newStaffData } 
          : member
      ));
      toast.success(`Staff member ${newStaffData.name} updated successfully`);
    } else {
      // Add new staff member
      const newMember: StaffMember = {
        id: Date.now().toString(),
        ...newStaffData
      };
      setStaff([...staff, newMember]);
      toast.success(`Staff member ${newStaffData.name} added successfully`);
    }
    
    setIsAddingStaff(false);
    setIsEditingStaff(null);
  };
  
  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter(member => member.id !== id));
    toast.success('Staff member removed successfully');
  };
  
  const handleCancelPlayerForm = () => {
    setIsAddingPlayer(false);
    setIsEditingPlayer(null);
  };
  
  const handleCancelStaffForm = () => {
    setIsAddingStaff(false);
    setIsEditingStaff(null);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Team & Management</h2>
      
      <Tabs defaultValue="players" className="space-y-4">
        <TabsList>
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="staff">Management & Staff</TabsTrigger>
        </TabsList>
        
        <TabsContent value="players">
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
        </TabsContent>
        
        <TabsContent value="staff">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">Management & Staff</h3>
            
            {!isAddingStaff && !isEditingStaff && (
              <Button onClick={handleAddStaff} className="flex items-center">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            )}
          </div>
          
          {(isAddingStaff || isEditingStaff) && (
            <StaffForm
              isEditing={!!isEditingStaff}
              formData={newStaffData}
              onInputChange={handleStaffInputChange}
              onSave={handleSaveStaff}
              onCancel={handleCancelStaffForm}
            />
          )}
          
          <ManagementList 
            staff={staff}
            onEdit={handleEditStaff}
            onDelete={handleDeleteStaff}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTeamSection;

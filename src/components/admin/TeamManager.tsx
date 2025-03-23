
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock team data for demonstration
const initialPlayers = [
  {
    id: 1,
    name: "John Smith",
    position: "Goalkeeper",
    number: 1,
    bio: "Experienced goalkeeper with excellent reflexes",
    image: "/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png"
  },
  {
    id: 2,
    name: "Alex Johnson",
    position: "Defender",
    number: 5,
    bio: "Strong central defender, good at aerial battles",
    image: "/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png"
  }
];

interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  bio: string;
  image: string;
}

const positions = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

const TeamManager = () => {
  const { toast } = useToast();
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  
  const openNewDialog = () => {
    setCurrentPlayer({
      id: players.length > 0 ? Math.max(...players.map(item => item.id)) + 1 : 1,
      name: '',
      position: 'Midfielder',
      number: 0,
      bio: '',
      image: ''
    });
    setDialogOpen(true);
  };
  
  const openEditDialog = (player: Player) => {
    setCurrentPlayer(player);
    setDialogOpen(true);
  };
  
  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentPlayer(null);
  };
  
  const handleDelete = (id: number) => {
    const updatedPlayers = players.filter(item => item.id !== id);
    setPlayers(updatedPlayers);
    toast({
      title: "Player deleted",
      description: "The player has been successfully removed from the team.",
    });
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPlayer) return;
    
    if (players.some(item => item.id === currentPlayer.id)) {
      // Update existing
      setPlayers(players.map(item => item.id === currentPlayer.id ? currentPlayer : item));
      toast({
        title: "Player updated",
        description: "The player information has been successfully updated."
      });
    } else {
      // Add new
      setPlayers([...players, currentPlayer]);
      toast({
        title: "Player added",
        description: "A new player has been successfully added to the team."
      });
    }
    
    closeDialog();
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Team Players</h3>
        <Button onClick={openNewDialog} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Player
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Number</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell className="font-medium">{player.name}</TableCell>
              <TableCell>{player.position}</TableCell>
              <TableCell>{player.number}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(player)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(player.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentPlayer?.id && players.some(item => item.id === currentPlayer.id) ? 'Edit Player' : 'Add Player'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium">Name</label>
                <Input
                  id="name"
                  value={currentPlayer?.name || ''}
                  onChange={(e) => setCurrentPlayer(prev => prev ? {...prev, name: e.target.value} : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="position" className="text-right text-sm font-medium">Position</label>
                <Select 
                  value={currentPlayer?.position}
                  onValueChange={(value) => setCurrentPlayer(prev => prev ? {...prev, position: value} : null)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map(pos => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="number" className="text-right text-sm font-medium">Number</label>
                <Input
                  id="number"
                  type="number"
                  value={currentPlayer?.number || ''}
                  onChange={(e) => setCurrentPlayer(prev => prev ? {...prev, number: parseInt(e.target.value)} : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="image" className="text-right text-sm font-medium">Image URL</label>
                <Input
                  id="image"
                  value={currentPlayer?.image || ''}
                  onChange={(e) => setCurrentPlayer(prev => prev ? {...prev, image: e.target.value} : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <label htmlFor="bio" className="text-right text-sm font-medium">Biography</label>
                <Textarea
                  id="bio"
                  value={currentPlayer?.bio || ''}
                  onChange={(e) => setCurrentPlayer(prev => prev ? {...prev, bio: e.target.value} : null)}
                  className="col-span-3"
                  rows={3}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={closeDialog}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManager;

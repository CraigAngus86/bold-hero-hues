import React, { useState, useEffect } from 'react';
import { useSquadStore } from '@/services/squadService';
import { useTeamStore } from '@/services/teamService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, PenSquare, Trash, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Squad } from '@/types/squad';
import { TeamMember } from '@/types/team';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SquadDialogProps {
  squad: Squad | null;
  open: boolean;
  onClose: () => void;
  onSave: (squad: Omit<Squad, 'id'>) => void;
}

const SquadDialog: React.FC<SquadDialogProps> = ({ squad, open, onClose, onSave }) => {
  const [name, setName] = useState(squad?.name || '');
  const [description, setDescription] = useState(squad?.description || '');
  
  useEffect(() => {
    if (open) {
      setName(squad?.name || '');
      setDescription(squad?.description || '');
    }
  }, [open, squad]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Squad name is required');
      return;
    }
    
    onSave({
      name,
      description,
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{squad ? 'Edit Squad' : 'New Squad'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First Team, Reserves, etc."
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description for this squad"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">{squad ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface SortablePlayerItemProps {
  id: string;
  player: TeamMember;
  onRemove: (playerId: string) => void;
}

const SortablePlayerItem: React.FC<SortablePlayerItemProps> = ({ id, player, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <TableRow ref={setNodeRef} style={style} className="cursor-move">
      <TableCell className="font-medium" {...attributes} {...listeners}>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2">
            {player.image_url && (
              <img src={player.image_url} alt={player.name} className="w-full h-full object-cover" />
            )}
          </div>
          <span>{player.name}</span>
        </div>
      </TableCell>
      <TableCell>{player.position}</TableCell>
      <TableCell className="text-center">{player.jersey_number || '-'}</TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(player.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash size={16} />
        </Button>
      </TableCell>
    </TableRow>
  );
};

interface SquadPlayersProps {
  squad: Squad;
  onRefreshRequest: () => void;
}

const SquadPlayers: React.FC<SquadPlayersProps> = ({ squad, onRefreshRequest }) => {
  const { players, isLoading } = useTeamStore();
  const { getPlayersInSquad, assignPlayerToSquad, removePlayerFromSquad, updatePlayerOrder } = useSquadStore();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [assigningPlayer, setAssigningPlayer] = useState(false);
  
  const squadPlayers = getPlayersInSquad(squad.id);
  
  const handleAddPlayer = async () => {
    if (!selectedPlayerId) return;
    
    setAssigningPlayer(true);
    try {
      await assignPlayerToSquad(selectedPlayerId, squad.id);
      setSelectedPlayerId('');
      onRefreshRequest();
    } finally {
      setAssigningPlayer(false);
    }
  };
  
  const handleRemovePlayer = async (playerId: string) => {
    await removePlayerFromSquad(playerId, squad.id);
    onRefreshRequest();
  };
  
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = squadPlayers.findIndex(p => p.id === active.id);
      const newIndex = squadPlayers.findIndex(p => p.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = newIndex + 1;
        await updatePlayerOrder(active.id, squad.id, newOrder);
        onRefreshRequest();
      }
    }
  };
  
  const availablePlayers = players.filter(player => 
    player.member_type === 'player' && !squadPlayers.some(sp => sp.id === player.id)
  );
  
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  }));
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Players in {squad.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
          <div className="grid gap-2 flex-1">
            <label htmlFor="player" className="text-sm font-medium">Add Player</label>
            <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select player to add" />
              </SelectTrigger>
              <SelectContent>
                {availablePlayers.length === 0 ? (
                  <SelectItem value="no-players" disabled>No players available</SelectItem>
                ) : (
                  availablePlayers.map(player => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name} {player.jersey_number ? `(#${player.jersey_number})` : ''}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleAddPlayer} 
            disabled={!selectedPlayerId || assigningPlayer}
            className="md:mb-0"
          >
            {assigningPlayer ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <Plus size={16} className="mr-2" />
            )}
            Add to Squad
          </Button>
        </div>
        
        {squadPlayers.length > 0 ? (
          <div className="border rounded-md">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="text-center">Number</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <SortableContext
                    items={squadPlayers.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {squadPlayers.map((player) => (
                      <SortablePlayerItem
                        key={player.id}
                        id={player.id}
                        player={player}
                        onRemove={handleRemovePlayer}
                      />
                    ))}
                  </SortableContext>
                </TableBody>
              </Table>
            </DndContext>
          </div>
        ) : (
          <div className="text-center py-8 border rounded-md">
            <p className="text-gray-500">No players in this squad yet</p>
            <p className="text-gray-400 text-sm">Use the dropdown above to add players</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-gray-50/50 justify-between">
        <div>
          <p className="text-sm text-gray-500">{squadPlayers.length} players in squad</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRefreshRequest}>
          <RefreshCw size={14} className="mr-1" />
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
};

const SquadsManager: React.FC = () => {
  const { squads, loadSquads, addSquad, updateSquad, deleteSquad, isLoading } = useSquadStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);
  const [activeTab, setActiveTab] = useState('');
  
  useEffect(() => {
    loadSquads();
  }, [loadSquads]);
  
  useEffect(() => {
    if (squads.length > 0 && !activeTab) {
      setActiveTab(squads[0].id);
    }
  }, [squads, activeTab]);
  
  const handleAddSquad = () => {
    setSelectedSquad(null);
    setDialogOpen(true);
  };
  
  const handleEditSquad = (squad: Squad) => {
    setSelectedSquad(squad);
    setDialogOpen(true);
  };
  
  const handleSaveSquad = async (squadData: Omit<Squad, 'id'>) => {
    if (selectedSquad) {
      await updateSquad(selectedSquad.id, squadData);
    } else {
      const newSquad = await addSquad(squadData);
      if (newSquad) {
        setActiveTab(newSquad.id);
      }
    }
    setDialogOpen(false);
  };
  
  const handleDeleteSquad = async (id: string) => {
    if (confirm('Are you sure you want to delete this squad? This will remove all player associations.')) {
      await deleteSquad(id);
      if (activeTab === id) {
        setActiveTab(squads.length > 0 ? squads[0].id : '');
      }
    }
  };
  
  const refreshSquads = () => {
    loadSquads();
  };
  
  if (isLoading && squads.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Squad Management</h2>
          <p className="text-gray-500">Organize players into different teams and squads</p>
        </div>
        <Button onClick={handleAddSquad}>
          <Plus size={16} className="mr-2" />
          New Squad
        </Button>
      </div>
      
      {squads.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">No squads have been created yet</p>
            <Button onClick={handleAddSquad}>
              <Plus size={16} className="mr-2" />
              Create First Squad
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 h-auto flex-wrap">
            {squads.map(squad => (
              <TabsTrigger key={squad.id} value={squad.id} className="relative group">
                {squad.name}
                <div className="hidden group-hover:flex absolute -right-2 -top-2 space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSquad(squad);
                    }}
                  >
                    <PenSquare size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full bg-red-100 text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSquad(squad.id);
                    }}
                  >
                    <Trash size={12} />
                  </Button>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {squads.map(squad => (
            <TabsContent key={squad.id} value={squad.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{squad.name}</CardTitle>
                      {squad.description && <p className="text-gray-500 mt-1">{squad.description}</p>}
                    </div>
                    <Button variant="outline" onClick={() => handleEditSquad(squad)}>
                      <PenSquare size={16} className="mr-2" />
                      Edit Squad
                    </Button>
                  </div>
                </CardHeader>
              </Card>
              
              <SquadPlayers squad={squad} onRefreshRequest={refreshSquads} />
            </TabsContent>
          ))}
        </Tabs>
      )}
      
      <SquadDialog
        squad={selectedSquad}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveSquad}
      />
    </div>
  );
};

export default SquadsManager;


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Save, Download, Share2, Trash, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useSquadStore } from '@/services/squadService';
import { useTeamStore } from '@/services/teamService';
import { TeamMember } from '@/types/team';
import { FormationTemplate, FormationPosition } from '@/types/squad';
import { DndContext, DragEndEvent, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useDraggable, useDroppable } from '@dnd-kit/core';

interface PlayerDraggableProps {
  player: TeamMember;
  index: number;
}

const PlayerDraggable: React.FC<PlayerDraggableProps> = ({ player, index }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `player-${player.id}`,
    data: { player }
  });
  
  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    zIndex: 999
  } : undefined;
  
  return (
    <div 
      ref={setNodeRef} 
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 cursor-move bg-white border rounded-md mb-1 flex items-center" 
    >
      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2 flex-shrink-0">
        {player.image_url && (
          <img src={player.image_url} alt={player.name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="overflow-hidden">
        <p className="font-medium truncate">{player.name}</p>
        <p className="text-xs text-gray-500 truncate">
          {player.position} {player.jersey_number ? `#${player.jersey_number}` : ''}
        </p>
      </div>
    </div>
  );
};

interface PositionDroppableProps {
  position: FormationPosition;
  assignedPlayer?: TeamMember;
  onRemovePlayer: (positionId: string) => void;
}

const PositionDroppable: React.FC<PositionDroppableProps> = ({ position, assignedPlayer, onRemovePlayer }) => {
  const { setNodeRef } = useDroppable({
    id: `position-${position.id}`,
    data: { position }
  });
  
  return (
    <div
      ref={setNodeRef}
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
      }}
    >
      {assignedPlayer ? (
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 bg-white rounded-full overflow-hidden shadow-md border-2 border-green-500">
            {assignedPlayer.image_url ? (
              <img src={assignedPlayer.image_url} alt={assignedPlayer.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="font-bold text-gray-500">
                  {assignedPlayer.jersey_number || '?'}
                </span>
              </div>
            )}
          </div>
          <button 
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
            onClick={() => onRemovePlayer(position.id)}
            title="Remove player"
          >
            ×
          </button>
          <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded">
            {assignedPlayer.name}
          </div>
        </div>
      ) : (
        <div className="w-14 h-14 bg-gray-200 bg-opacity-70 rounded-full flex items-center justify-center shadow border border-dashed border-gray-400">
          <div className="text-xs text-center text-gray-500">
            <div>{position.position}</div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SaveFormationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  existingName?: string;
}

const SaveFormationDialog: React.FC<SaveFormationDialogProps> = ({ open, onClose, onSave, existingName }) => {
  const [name, setName] = useState(existingName || '');
  
  useEffect(() => {
    if (open) {
      setName(existingName || '');
    }
  }, [open, existingName]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Formation name is required');
      return;
    }
    
    onSave(name);
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existingName ? 'Update Formation' : 'Save Formation'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="formation-name">Formation Name</Label>
              <Input
                id="formation-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g. First Team 4-4-2"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">{existingName ? 'Update' : 'Save'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface ShareFormationDialogProps {
  open: boolean;
  onClose: () => void;
  imageUrl?: string;
}

const ShareFormationDialog: React.FC<ShareFormationDialogProps> = ({ open, onClose, imageUrl }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Formation</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {imageUrl ? (
            <>
              <div className="border rounded-md overflow-hidden mb-4">
                <img src={imageUrl} alt="Formation" className="w-full" />
              </div>
              <div className="grid gap-4">
                <div>
                  <Label>Share Options</Label>
                  <div className="flex gap-2 mt-2">
                    <Button className="flex-1" variant="outline">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Image
                    </Button>
                    <Button className="flex-1" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="share-caption" className="mb-2 block">Caption</Label>
                  <Input
                    id="share-caption"
                    placeholder="Add a caption to your formation"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">Generate a formation image first</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const FormationBuilder: React.FC = () => {
  const { players, isLoading: playersLoading } = useTeamStore();
  const { formationTemplates, loadFormationTemplates, saveFormationTemplate, deleteFormationTemplate } = useSquadStore();
  
  const [selectedFormation, setSelectedFormation] = useState('4-4-2');
  const [selectedTemplate, setSelectedTemplate] = useState<FormationTemplate | null>(null);
  const [positions, setPositions] = useState<FormationPosition[]>([]);
  const [playerAssignments, setPlayerAssignments] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | undefined>();
  
  // Load templates
  useEffect(() => {
    setIsLoading(true);
    loadFormationTemplates().finally(() => setIsLoading(false));
  }, [loadFormationTemplates]);
  
  // Set up formations
  useEffect(() => {
    if (selectedTemplate) {
      // Use the selected template's formation and positions
      setSelectedFormation(selectedTemplate.formation);
      setPositions(selectedTemplate.positions.map(pos => ({ ...pos })));
      
      // Set up player assignments if the template has any
      const assignments: Record<string, string> = {};
      selectedTemplate.positions.forEach(pos => {
        if (pos.player_id) {
          assignments[pos.id] = pos.player_id;
        }
      });
      setPlayerAssignments(assignments);
    } else {
      // Use the default formations
      const defaultFormations: Record<string, FormationPosition[]> = {
        '4-4-2': [
          { id: '1', x: 50, y: 90, position: 'Goalkeeper' },
          { id: '2', x: 20, y: 70, position: 'Right Back' },
          { id: '3', x: 40, y: 70, position: 'Center Back' },
          { id: '4', x: 60, y: 70, position: 'Center Back' },
          { id: '5', x: 80, y: 70, position: 'Left Back' },
          { id: '6', x: 20, y: 50, position: 'Right Midfielder' },
          { id: '7', x: 40, y: 50, position: 'Central Midfielder' },
          { id: '8', x: 60, y: 50, position: 'Central Midfielder' },
          { id: '9', x: 80, y: 50, position: 'Left Midfielder' },
          { id: '10', x: 40, y: 30, position: 'Striker' },
          { id: '11', x: 60, y: 30, position: 'Striker' },
        ],
        '4-3-3': [
          { id: '1', x: 50, y: 90, position: 'Goalkeeper' },
          { id: '2', x: 20, y: 70, position: 'Right Back' },
          { id: '3', x: 40, y: 70, position: 'Center Back' },
          { id: '4', x: 60, y: 70, position: 'Center Back' },
          { id: '5', x: 80, y: 70, position: 'Left Back' },
          { id: '6', x: 30, y: 50, position: 'Defensive Midfielder' },
          { id: '7', x: 50, y: 50, position: 'Central Midfielder' },
          { id: '8', x: 70, y: 50, position: 'Central Midfielder' },
          { id: '9', x: 20, y: 30, position: 'Right Winger' },
          { id: '10', x: 50, y: 30, position: 'Striker' },
          { id: '11', x: 80, y: 30, position: 'Left Winger' },
        ],
        '3-5-2': [
          { id: '1', x: 50, y: 90, position: 'Goalkeeper' },
          { id: '2', x: 30, y: 70, position: 'Center Back' },
          { id: '3', x: 50, y: 70, position: 'Center Back' },
          { id: '4', x: 70, y: 70, position: 'Center Back' },
          { id: '5', x: 15, y: 50, position: 'Right Wing Back' },
          { id: '6', x: 35, y: 50, position: 'Central Midfielder' },
          { id: '7', x: 50, y: 50, position: 'Defensive Midfielder' },
          { id: '8', x: 65, y: 50, position: 'Central Midfielder' },
          { id: '9', x: 85, y: 50, position: 'Left Wing Back' },
          { id: '10', x: 40, y: 30, position: 'Striker' },
          { id: '11', x: 60, y: 30, position: 'Striker' },
        ],
      };
      
      setPositions(defaultFormations[selectedFormation] || []);
      setPlayerAssignments({});
    }
  }, [selectedFormation, selectedTemplate]);
  
  const availablePlayers = players.filter(player => 
    player.member_type === 'player' && 
    !Object.values(playerAssignments).includes(player.id)
  );
  
  const getPlayerForPosition = (positionId: string): TeamMember | undefined => {
    const playerId = playerAssignments[positionId];
    if (!playerId) return undefined;
    
    return players.find(player => player.id === playerId);
  };
  
  const handleRemovePlayer = (positionId: string) => {
    setPlayerAssignments(prev => {
      const newAssignments = { ...prev };
      delete newAssignments[positionId];
      return newAssignments;
    });
  };
  
  const handleDragStart = (event: DragStartEvent) => {
    // Optional: Add visual effects or state changes when dragging starts
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    // Extract the data from the drag operation
    const isPlayerDrag = active.id.toString().startsWith('player-');
    const isPositionDrop = over.id.toString().startsWith('position-');
    
    if (isPlayerDrag && isPositionDrop) {
      const activeId = active.id.toString().replace('player-', '');
      const overId = over.id.toString().replace('position-', '');
      
      // Get the position data
      const position = positions.find(p => p.id === overId);
      if (!position) return;
      
      // Update player assignments
      setPlayerAssignments(prev => ({
        ...prev,
        [overId]: activeId
      }));
    }
  };
  
  const handleSaveFormation = (name: string) => {
    const positionsWithPlayers = positions.map(pos => ({
      ...pos,
      player_id: playerAssignments[pos.id]
    }));
    
    const template: Omit<FormationTemplate, 'id'> = {
      name,
      formation: selectedFormation,
      positions: positionsWithPlayers
    };
    
    saveFormationTemplate(template).then(newTemplate => {
      if (newTemplate) {
        setSelectedTemplate(newTemplate);
        toast.success('Formation saved successfully');
      }
      setSaveDialogOpen(false);
    });
  };
  
  const handleDeleteTemplate = () => {
    if (!selectedTemplate) return;
    
    if (confirm(`Are you sure you want to delete the "${selectedTemplate.name}" formation?`)) {
      deleteFormationTemplate(selectedTemplate.id).then(() => {
        setSelectedTemplate(null);
        toast.success('Formation deleted successfully');
      });
    }
  };
  
  const handleLoadTemplate = (templateId: string) => {
    const template = formationTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
    }
  };
  
  const handleShareFormation = () => {
    // In a real application, we would capture the formation as an image here
    // For this demo, we'll simulate it with a mock image URL
    setShareImageUrl('/lovable-uploads/banks-o-dee-logo.png');
    setShareDialogOpen(true);
  };
  
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  }));
  
  const formationOptions = [
    { value: '4-4-2', label: '4-4-2' },
    { value: '4-3-3', label: '4-3-3' },
    { value: '3-5-2', label: '3-5-2' }
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Formation Builder</h2>
          <p className="text-gray-500">Create, save and share team formations</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar with players */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Available Players</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px] overflow-y-auto">
              {playersLoading ? (
                <div className="text-center py-8">Loading players...</div>
              ) : availablePlayers.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <div>
                    {availablePlayers.map((player, index) => (
                      <PlayerDraggable
                        key={player.id}
                        player={player}
                        index={index}
                      />
                    ))}
                  </div>
                </DndContext>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">All players have been assigned</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t bg-gray-50/50 justify-between">
              <div>
                <p className="text-sm text-gray-500">{availablePlayers.length} players available</p>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Main formation area */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <Card className="mb-6">
            <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center">
              <CardTitle className="text-lg">
                {selectedTemplate ? selectedTemplate.name : `Formation: ${selectedFormation}`}
              </CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <Select 
                  value={selectedFormation} 
                  onValueChange={setSelectedFormation}
                  disabled={!!selectedTemplate}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Select formation" />
                  </SelectTrigger>
                  <SelectContent>
                    {formationOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant={selectedTemplate ? "default" : "outline"} 
                  onClick={() => setSaveDialogOpen(true)}
                  title={selectedTemplate ? "Update formation" : "Save formation"}
                >
                  <Save size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div 
                  className="relative h-[500px] bg-gradient-to-b from-green-500 to-green-700"
                  style={{
                    backgroundImage: `
                      linear-gradient(to bottom, #4ade80, #16a34a),
                      repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.15) 50px, rgba(255,255,255,0.15) 52px),
                      repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.15) 50px, rgba(255,255,255,0.15) 52px)
                    `,
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)'
                  }}
                >
                  {/* Center Circle */}
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white border-opacity-50 rounded-full"
                  ></div>
                  
                  {/* Goal Areas */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 border-b-2 border-l-2 border-r-2 border-white border-opacity-50"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-6 border-t-2 border-l-2 border-r-2 border-white border-opacity-50"></div>
                  
                  {/* Position markers */}
                  {positions.map(position => (
                    <PositionDroppable
                      key={position.id}
                      position={position}
                      assignedPlayer={getPlayerForPosition(position.id)}
                      onRemovePlayer={handleRemovePlayer}
                    />
                  ))}
                </div>
              </DndContext>
            </CardContent>
            <CardFooter className="border-t bg-gray-50/50 justify-between">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleShareFormation}
                  className="text-sm"
                >
                  <Share2 size={14} className="mr-1" />
                  Share
                </Button>
                {selectedTemplate && (
                  <Button 
                    variant="outline" 
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 text-sm"
                    onClick={handleDeleteTemplate}
                  >
                    <Trash size={14} className="mr-1" />
                    Delete
                  </Button>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Drag players onto positions
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right sidebar with saved formations */}
        <div className="lg:col-span-1 order-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Saved Formations</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px] overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">Loading formations...</div>
              ) : formationTemplates.length > 0 ? (
                <div className="space-y-2">
                  {formationTemplates.map(template => (
                    <div 
                      key={template.id} 
                      className={`p-3 rounded-md cursor-pointer border transition-all ${
                        selectedTemplate?.id === template.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                      onClick={() => handleLoadTemplate(template.id)}
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-gray-500">Formation: {template.formation}</div>
                      <div className="text-xs text-gray-500">
                        {template.positions.filter(p => p.player_id).length} players assigned
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No saved formations yet</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSaveDialogOpen(true)}
                  >
                    <Plus size={14} className="mr-1" />
                    Save Current Formation
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t bg-gray-50/50 justify-between">
              <div>
                <p className="text-sm text-gray-500">{formationTemplates.length} saved formation{formationTemplates.length !== 1 ? 's' : ''}</p>
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTemplate(null);
                  setSelectedFormation('4-4-2');
                }}
                disabled={!selectedTemplate}
              >
                Create New
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <SaveFormationDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={handleSaveFormation}
        existingName={selectedTemplate?.name}
      />
      
      <ShareFormationDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        imageUrl={shareImageUrl}
      />
    </div>
  );
};

export default FormationBuilder;

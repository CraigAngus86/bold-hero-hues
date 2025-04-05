
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Trash, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { TeamMember, useTeamStore } from '@/services/teamService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const positions = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
const memberTypes = ["player", "management", "official"];

const TeamManager = () => {
  const { toast } = useToast();
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useTeamStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState<"player" | "management" | "official">("player");
  
  const filteredMembers = teamMembers.filter(m => m.type === activeTab);
  
  const openNewDialog = () => {
    setCurrentMember({
      id: teamMembers.length > 0 ? Math.max(...teamMembers.map(item => item.id)) + 1 : 1,
      name: '',
      position: activeTab === 'player' ? 'Midfielder' : undefined,
      role: activeTab !== 'player' ? '' : undefined,
      number: activeTab === 'player' ? 0 : undefined,
      image: '',
      biography: activeTab === 'player' ? '' : undefined,
      bio: activeTab !== 'player' ? '' : undefined,
      type: activeTab,
      stats: activeTab === 'player' ? { appearances: 0, goals: 0, assists: 0 } : undefined,
      experience: activeTab !== 'player' ? '' : undefined
    });
    setDialogOpen(true);
  };
  
  const openEditDialog = (member: TeamMember) => {
    setCurrentMember(member);
    setDialogOpen(true);
  };
  
  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentMember(null);
  };
  
  const handleDelete = (id: number) => {
    deleteTeamMember(id);
    toast({
      title: "Member deleted",
      description: "The team member has been successfully removed.",
    });
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMember) return;
    
    if (teamMembers.some(item => item.id === currentMember.id)) {
      // Update existing
      updateTeamMember(currentMember);
      toast({
        title: "Member updated",
        description: "The team member information has been successfully updated."
      });
    } else {
      // Add new
      addTeamMember(currentMember);
      toast({
        title: "Member added",
        description: "A new team member has been successfully added."
      });
    }
    
    closeDialog();
  };
  
  return (
    <div>
      <Tabs defaultValue="player" onValueChange={(value) => setActiveTab(value as "player" | "management" | "official")}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="player">Players</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="official">Club Officials</TabsTrigger>
          </TabsList>
          <Button onClick={openNewDialog} className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add {activeTab === 'player' ? 'Player' : activeTab === 'management' ? 'Staff' : 'Official'}
          </Button>
        </div>
        
        <TabsContent value="player">
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
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>{member.number}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(member)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(member.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="management">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(member)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(member.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="official">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(member)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(member.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {currentMember?.id && teamMembers.some(item => item.id === currentMember.id) 
                ? `Edit ${activeTab === 'player' ? 'Player' : activeTab === 'management' ? 'Staff Member' : 'Club Official'}` 
                : `Add ${activeTab === 'player' ? 'Player' : activeTab === 'management' ? 'Staff Member' : 'Club Official'}`}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium">Name</label>
                <Input
                  id="name"
                  value={currentMember?.name || ''}
                  onChange={(e) => setCurrentMember(prev => prev ? {...prev, name: e.target.value} : null)}
                  className="col-span-3"
                  required
                />
              </div>
              
              {activeTab === 'player' ? (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="position" className="text-right text-sm font-medium">Position</label>
                    <Select 
                      value={currentMember?.position}
                      onValueChange={(value) => setCurrentMember(prev => prev ? {...prev, position: value} : null)}
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
                      value={currentMember?.number || ''}
                      onChange={(e) => setCurrentMember(prev => prev ? {...prev, number: parseInt(e.target.value)} : null)}
                      className="col-span-3"
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="role" className="text-right text-sm font-medium">Role</label>
                  <Input
                    id="role"
                    value={currentMember?.role || ''}
                    onChange={(e) => setCurrentMember(prev => prev ? {...prev, role: e.target.value} : null)}
                    className="col-span-3"
                    required
                  />
                </div>
              )}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="image" className="text-right text-sm font-medium">Image URL</label>
                <Input
                  id="image"
                  value={currentMember?.image || ''}
                  onChange={(e) => setCurrentMember(prev => prev ? {...prev, image: e.target.value} : null)}
                  className="col-span-3"
                  required
                />
              </div>
              
              {activeTab === 'player' ? (
                <div className="grid grid-cols-4 items-start gap-4">
                  <label htmlFor="biography" className="text-right text-sm font-medium">Biography</label>
                  <Textarea
                    id="biography"
                    value={currentMember?.biography || ''}
                    onChange={(e) => setCurrentMember(prev => prev ? {...prev, biography: e.target.value} : null)}
                    className="col-span-3"
                    rows={3}
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <label htmlFor="bio" className="text-right text-sm font-medium">Biography</label>
                    <Textarea
                      id="bio"
                      value={currentMember?.bio || ''}
                      onChange={(e) => setCurrentMember(prev => prev ? {...prev, bio: e.target.value} : null)}
                      className="col-span-3"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="experience" className="text-right text-sm font-medium">Experience</label>
                    <Input
                      id="experience"
                      value={currentMember?.experience || ''}
                      onChange={(e) => setCurrentMember(prev => prev ? {...prev, experience: e.target.value} : null)}
                      className="col-span-3"
                      required
                    />
                  </div>
                </>
              )}
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

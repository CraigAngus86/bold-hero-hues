
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTeamStore, TeamMember, MemberType } from '@/services/teamService';
import { createTeamMember, updateTeamMember, deleteTeamMember, getAllTeamMembers } from '@/services/teamDbService';
import PlayerImageUploader from './PlayerImageUploader';

const TeamMembersManager = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { loadTeamMembers } = useTeamStore();
  
  useEffect(() => {
    loadTeamMemberData();
  }, []);
  
  const loadTeamMemberData = async () => {
    setLoading(true);
    try {
      const response = await getAllTeamMembers();
      if (response.success) {
        setTeamMembers(response.data);
      } else {
        toast.error("Failed to load team members");
      }
    } catch (error) {
      console.error("Error loading team members:", error);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };
  
  const openNewDialog = () => {
    setCurrentMember({
      id: '',
      name: '',
      member_type: 'player',
      position: '',
      image_url: '',
      bio: '',
      nationality: '',
      jersey_number: 0,
      previous_clubs: [],
      experience: '',
      is_active: true,
      stats: {}
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
  
  // Function to handle member deletion
  const handleDeleteMember = async (id: string) => {
    try {
      const response = await deleteTeamMember(id);
      if (response.success) {
        await loadTeamMemberData();
        await loadTeamMembers();
        toast.success("Team member deleted successfully");
      } else {
        toast.error("Failed to delete team member");
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member");
    }
  };
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMember) return;
    
    try {
      if (currentMember.id) {
        // Update existing member
        const response = await updateTeamMember(currentMember.id, currentMember);
        if (response.success) {
          toast.success("Team member updated successfully");
        } else {
          toast.error("Failed to update team member");
        }
      } else {
        // Add new member
        const response = await createTeamMember(currentMember);
        if (response.success) {
          toast.success("Team member added successfully");
        } else {
          toast.error("Failed to add team member");
        }
      }
      
      await loadTeamMemberData();
      await loadTeamMembers();
      closeDialog();
    } catch (error) {
      console.error("Error saving team member:", error);
      toast.error("Failed to save team member");
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Team Members</h3>
        <Button onClick={openNewDialog} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.member_type}</TableCell>
                <TableCell>{member.position}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(member)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteMember(member.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentMember?.id ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-sm font-medium">Name</Label>
                <Input
                  id="name"
                  value={currentMember?.name || ''}
                  onChange={(e) => setCurrentMember(prev => prev ? {...prev, name: e.target.value} : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right text-sm font-medium">Type</Label>
                <Select 
                  value={currentMember?.member_type}
                  onValueChange={(value) => setCurrentMember(prev => prev ? {...prev, member_type: value as MemberType} : null)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="player">Player</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="official">Official</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right text-sm font-medium">Position</Label>
                <Input
                  id="position"
                  value={currentMember?.position || ''}
                  onChange={(e) => setCurrentMember(prev => prev ? {...prev, position: e.target.value} : null)}
                  className="col-span-3"
                />
              </div>
              
              {/* Player Image Upload */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="image" className="text-right text-sm font-medium">Profile Photo</label>
                <div className="col-span-3">
                  <PlayerImageUploader 
                    initialImageUrl={currentMember?.image_url || ''} 
                    onUpload={(url) => setCurrentMember(prev => prev ? {...prev, image_url: url} : null)}
                    playerName={currentMember?.name || 'Team Member'} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="bio" className="text-right text-sm font-medium">Bio</Label>
                <Input
                  id="bio"
                  value={currentMember?.bio || ''}
                  onChange={(e) => setCurrentMember(prev => prev ? {...prev, bio: e.target.value} : null)}
                  className="col-span-3"
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

export default TeamMembersManager;

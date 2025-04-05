import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Users, UserPlus, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { TeamMember } from '@/types/team';
import { getAllTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '@/services/teamDbService';
import { convertToDBTeamMember } from '@/types/team';

const TeamMembersManager = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMember, setCurrentMember] = useState<Partial<TeamMember> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await getAllTeamMembers();
      if (response.success && response.data) {
        setMembers(response.data);
      } else {
        console.error('Error fetching team members:', response.error);
        toast.error('Failed to load team members');
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setCurrentMember({
      type: 'player',
      name: '',
      image: '',
      position: '',
    });
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (member: TeamMember) => {
    setCurrentMember(member);
    setDialogOpen(true);
  };

  const handleConfirmDelete = (member: TeamMember) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;

    try {
      const response = await deleteTeamMember(memberToDelete.id.toString());
      if (response.success) {
        setMembers(members.filter(m => m.id !== memberToDelete.id));
        toast.success(`${memberToDelete.name} has been removed`);
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
    }
  };

  const handleSave = async () => {
    if (!currentMember) return;

    try {
      const dbMember = convertToDBTeamMember(currentMember as TeamMember);

      let response;
      
      if (currentMember.id) {
        // Update existing member
        response = await updateTeamMember(currentMember.id.toString(), dbMember);
        if (response.success && response.data) {
          setMembers(members.map(m => m.id === response.data?.id ? response.data : m));
          toast.success(`${response.data.name} has been updated`);
        }
      } else {
        // Create new member
        response = await createTeamMember(dbMember as any);
        if (response.success && response.data) {
          setMembers([...members, response.data]);
          toast.success(`${response.data.name} has been added`);
        }
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error('Failed to save team member');
    }
  };

  const playerMembers = members.filter(m => m.type === 'player');
  const managementMembers = members.filter(m => m.type === 'management');
  const officialMembers = members.filter(m => m.type === 'official');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Team Members</h3>
        <Button onClick={handleOpenAddDialog}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px space-x-8" aria-label="Tabs">
          {['Players', 'Management', 'Officials'].map((tab) => (
            <button
              key={tab}
              className="px-1 py-4 text-sm font-medium border-b-2 border-blue-500"
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Position/Role</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                {loading ? 'Loading team members...' : 'No team members found'}
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.position || member.role || '-'}</TableCell>
                <TableCell className="capitalize">{member.type}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(member)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleConfirmDelete(member)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentMember?.id ? 'Edit' : 'Add'} Team Member</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right text-sm font-medium">Type</label>
              <Select
                value={currentMember?.type}
                onValueChange={(value) => setCurrentMember(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="player">Player</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="official">Official</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">Name</label>
              <Input
                id="name"
                value={currentMember?.name || ''}
                onChange={(e) => setCurrentMember(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
              />
            </div>

            {currentMember?.type === 'player' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="position" className="text-right text-sm font-medium">Position</label>
                  <Input
                    id="position"
                    value={currentMember?.position || ''}
                    onChange={(e) => setCurrentMember(prev => ({ ...prev, position: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="number" className="text-right text-sm font-medium">Number</label>
                  <Input
                    id="number"
                    type="number"
                    value={currentMember?.number || ''}
                    onChange={(e) => setCurrentMember(prev => ({ ...prev, number: parseInt(e.target.value) || undefined }))}
                    className="col-span-3"
                  />
                </div>
              </>
            )}

            {(currentMember?.type === 'management' || currentMember?.type === 'official') && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="role" className="text-right text-sm font-medium">Role</label>
                <Input
                  id="role"
                  value={currentMember?.role || ''}
                  onChange={(e) => setCurrentMember(prev => ({ ...prev, role: e.target.value }))}
                  className="col-span-3"
                />
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="image" className="text-right text-sm font-medium">Image URL</label>
              <Input
                id="image"
                value={currentMember?.image || ''}
                onChange={(e) => setCurrentMember(prev => ({ ...prev, image: e.target.value }))}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="bio" className="text-right text-sm font-medium">Bio</label>
              <Textarea
                id="bio"
                value={currentMember?.bio || ''}
                onChange={(e) => setCurrentMember(prev => ({ ...prev, bio: e.target.value }))}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete {memberToDelete?.name}? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamMembersManager;

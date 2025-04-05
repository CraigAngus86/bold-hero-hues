
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { LastUpdatedInfo } from '@/components/admin/data/table-components/LastUpdatedInfo';
import { PlayerImageUploader } from '@/components/admin/common/PlayerImageUploader';
import { TeamMember, MemberType } from '@/types/team';
import { getAllTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '@/services/teamService';

export default function TeamMembersManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<TeamMember>>({
    name: '',
    member_type: 'player',
    position: '',
    image_url: '',
    is_active: true,
    bio: '',
    nationality: '',
    jersey_number: undefined,
    previous_clubs: []
  });
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [previousClubs, setPreviousClubs] = useState<string>('');
  
  useEffect(() => {
    fetchTeamMembers();
  }, []);
  
  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const result = await getAllTeamMembers();
      if (result.success && result.data) {
        setMembers(result.data);
        
        // Set the last updated timestamp from the most recently updated member
        if (result.data.length > 0) {
          const sortedByDate = [...result.data].sort((a, b) => {
            return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
          });
          setLastUpdated(sortedByDate[0].updated_at || null);
        }
      } else {
        toast.error('Failed to load team members');
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenDialog = (member?: TeamMember) => {
    if (member) {
      setCurrentMember(member);
      setPreviousClubs(member.previous_clubs?.join(', ') || '');
    } else {
      setCurrentMember({
        name: '',
        member_type: 'player',
        position: '',
        image_url: '',
        is_active: true,
        bio: '',
        nationality: '',
        jersey_number: undefined,
        previous_clubs: []
      });
      setPreviousClubs('');
    }
    setDialogOpen(true);
  };
  
  const handleSave = async () => {
    try {
      if (!currentMember.name) {
        toast.error('Name is required');
        return;
      }
      
      // Format previous clubs from comma-separated string to array
      const formattedMember = {
        ...currentMember,
        previous_clubs: previousClubs ? previousClubs.split(',').map(club => club.trim()) : []
      };
      
      let result;
      if ('id' in formattedMember && formattedMember.id) {
        result = await updateTeamMember(formattedMember as TeamMember);
      } else {
        result = await createTeamMember(formattedMember as Omit<TeamMember, 'id'>);
      }
      
      if (result.success) {
        toast.success(`Team member ${formattedMember.id ? 'updated' : 'created'} successfully`);
        setDialogOpen(false);
        fetchTeamMembers(); // Refresh the list
      } else {
        toast.error(`Failed to ${formattedMember.id ? 'update' : 'create'} team member`);
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error(`Failed to ${currentMember.id ? 'update' : 'create'} team member`);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      try {
        const result = await deleteTeamMember(id);
        if (result.success) {
          toast.success('Team member deleted successfully');
          fetchTeamMembers(); // Refresh the list
        } else {
          toast.error('Failed to delete team member');
        }
      } catch (error) {
        console.error('Error deleting team member:', error);
        toast.error('Failed to delete team member');
      }
    }
  };
  
  const handleImageUploaded = (url: string) => {
    setCurrentMember(prev => ({ ...prev, image_url: url }));
  };
  
  const getMemberTypeLabel = (type: MemberType) => {
    switch (type) {
      case 'player': return 'Player';
      case 'management': return 'Management';
      case 'official': return 'Club Official';
      default: return type;
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Team Members</h2>
        <Button onClick={() => handleOpenDialog()}>Add New Member</Button>
      </div>
      
      <LastUpdatedInfo lastUpdated={lastUpdated} />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Photo</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">Loading team members...</TableCell>
            </TableRow>
          ) : members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">No team members found.</TableCell>
            </TableRow>
          ) : (
            members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  {member.name}
                  {member.member_type === 'player' && member.jersey_number && (
                    <span className="ml-2 text-xs bg-team-blue text-white px-1.5 py-0.5 rounded-sm">
                      #{member.jersey_number}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {member.image_url ? (
                    <img 
                      src={member.image_url} 
                      alt={member.name} 
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No image</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    member.member_type === 'player' ? 'bg-blue-100 text-blue-800' : 
                    member.member_type === 'management' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {getMemberTypeLabel(member.member_type)}
                  </span>
                </TableCell>
                <TableCell>{member.position || '—'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    member.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {member.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleOpenDialog(member)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(member.id)}
                    className="text-red-500"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentMember.id ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">Name</label>
              <Input
                id="name"
                value={currentMember.name || ''}
                onChange={(e) => setCurrentMember(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                placeholder="Full name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right text-sm font-medium">Type</label>
              <Select 
                value={currentMember.member_type || 'player'}
                onValueChange={(value) => setCurrentMember(prev => ({ ...prev, member_type: value as MemberType }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select member type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="player">Player</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="official">Club Official</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="position" className="text-right text-sm font-medium">Position</label>
              <Input
                id="position"
                value={currentMember.position || ''}
                onChange={(e) => setCurrentMember(prev => ({ ...prev, position: e.target.value }))}
                className="col-span-3"
                placeholder="e.g. Forward, Manager, Chairman"
              />
            </div>
            
            {currentMember.member_type === 'player' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="jersey" className="text-right text-sm font-medium">Jersey #</label>
                <Input
                  id="jersey"
                  type="number"
                  value={currentMember.jersey_number || ''}
                  onChange={(e) => setCurrentMember(prev => ({ 
                    ...prev, 
                    jersey_number: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  className="col-span-3"
                  placeholder="Jersey number"
                />
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="nationality" className="text-right text-sm font-medium">Nationality</label>
              <Input
                id="nationality"
                value={currentMember.nationality || ''}
                onChange={(e) => setCurrentMember(prev => ({ ...prev, nationality: e.target.value }))}
                className="col-span-3"
                placeholder="e.g. Scottish"
              />
            </div>
            
            {currentMember.member_type === 'player' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="previous" className="text-right text-sm font-medium">Previous Clubs</label>
                <Input
                  id="previous"
                  value={previousClubs}
                  onChange={(e) => setPreviousClubs(e.target.value)}
                  className="col-span-3"
                  placeholder="Comma-separated list of clubs"
                />
              </div>
            )}
            
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="bio" className="text-right text-sm font-medium pt-2">Bio</label>
              <Textarea
                id="bio"
                value={currentMember.bio || ''}
                onChange={(e) => setCurrentMember(prev => ({ ...prev, bio: e.target.value }))}
                className="col-span-3"
                placeholder="Brief biography or information"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <label className="text-right text-sm font-medium pt-2">Photo</label>
              <div className="col-span-3">
                <PlayerImageUploader
                  currentImage={currentMember.image_url}
                  onUpload={handleImageUploaded}
                  playerName={currentMember.name || 'New Member'}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right text-sm font-medium">Status</label>
              <Select 
                value={currentMember.is_active ? 'active' : 'inactive'}
                onValueChange={(value) => setCurrentMember(prev => ({ ...prev, is_active: value === 'active' }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

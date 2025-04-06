import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash, Loader2, Search, Filter, UserCircle, Database } from 'lucide-react';
import { toast } from 'sonner';
import { useTeamStore, TeamMember, MemberType } from '@/services/teamService';
import { createTeamMember, updateTeamMember, deleteTeamMember, getAllTeamMembers } from '@/services/teamDbService';
import { seedTeamData } from '@/services/teamSeedData';

interface TeamMembersManagerProps {
  onEditMember?: (member: TeamMember) => void;
}

const TeamMembersManager: React.FC<TeamMembersManagerProps> = ({ onEditMember }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all-types');
  const [statusFilter, setStatusFilter] = useState<string>('all-statuses');
  const [seeding, setSeeding] = useState(false);
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

  const handleSeedData = async () => {
    if (confirm("This will replace all existing team members with sample data. Continue?")) {
      setSeeding(true);
      try {
        await seedTeamData();
        await loadTeamMemberData();
        await loadTeamMembers();
        toast.success("Team data seeded successfully!");
      } catch (error) {
        console.error("Error seeding team data:", error);
        toast.error("Failed to seed team data");
      } finally {
        setSeeding(false);
      }
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
      stats: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    if (onEditMember) {
      onEditMember(currentMember!);
    } else {
      setDialogOpen(true);
    }
  };
  
  const openEditDialog = (member: TeamMember) => {
    setCurrentMember(member);
    if (onEditMember) {
      onEditMember(member);
    } else {
      setDialogOpen(true);
    }
  };
  
  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentMember(null);
  };
  
  const handleDeleteMember = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this team member?")) {
        const response = await deleteTeamMember(id);
        if (response.success) {
          await loadTeamMemberData();
          await loadTeamMembers();
          toast.success("Team member deleted successfully");
        } else {
          toast.error("Failed to delete team member");
        }
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
        const response = await updateTeamMember(currentMember.id, currentMember);
        if (response.success) {
          toast.success("Team member updated successfully");
        } else {
          toast.error("Failed to update team member");
        }
      } else {
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

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = searchTerm 
      ? member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.position?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      : true;
      
    const matchesType = typeFilter === 'all-types'
      ? true
      : member.member_type === typeFilter;
      
    const matchesStatus = statusFilter === 'all-statuses'
      ? true
      : (statusFilter === 'active' ? member.is_active : !member.is_active);
      
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const getMemberTypeLabel = (type: string): string => {
    switch (type) {
      case 'player': return 'Player';
      case 'management': return 'Management';
      case 'official': return 'Official';
      default: return type;
    }
  };
  
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">All Types</SelectItem>
                  <SelectItem value="player">Players</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="official">Officials</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => openNewDialog()} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
              <Button 
                onClick={handleSeedData} 
                variant="outline" 
                disabled={seeding} 
                className="w-full sm:w-auto"
              >
                {seeding ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Database className="h-4 w-4 mr-2" />
                )}
                Seed Sample Data
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No team members found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                {member.image_url ? (
                                  <img 
                                    src={member.image_url} 
                                    alt={member.name} 
                                    className="h-full w-full object-cover" 
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center bg-gray-200">
                                    <UserCircle className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                {member.member_type === 'player' && member.jersey_number && (
                                  <div className="text-xs text-gray-500">#{member.jersey_number}</div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getMemberTypeLabel(member.member_type)}
                            </Badge>
                          </TableCell>
                          <TableCell>{member.position || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={member.is_active ? "success" : "secondary"}>
                              {member.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => openEditDialog(member)} title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteMember(member.id)}
                                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                title="Delete"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 text-sm text-gray-500 text-right">
                Showing {filteredMembers.length} of {teamMembers.length} team members
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {!onEditMember && dialogOpen && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{currentMember?.id ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave}>
              <div className="grid gap-4 py-4">
                {/* Basic form fields for inline editing */}
                {/* In a real implementation, this would include more fields similar to TeamMemberEditor */}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TeamMembersManager;

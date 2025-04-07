
import React, { useState, useEffect } from 'react';
import { TeamMember, MemberType } from '@/types/team';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const TeamMembersManager: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [name, setName] = useState('');
  const [memberType, setMemberType] = useState<MemberType>('player');
  const [position, setPosition] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState<number | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState('');
  const [bio, setBio] = useState('');
  const [nationality, setNationality] = useState('');
  const [experience, setExperience] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockTeamMembers: TeamMember[] = [
      {
        id: '1',
        name: 'Lionel Messi',
        member_type: 'player',
        position: 'Forward',
        jersey_number: 10,
        image_url: '/assets/players/messi.jpg',
        bio: 'The GOAT',
        nationality: 'Argentinian',
        experience: '20+ years',
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'Cristiano Ronaldo',
        member_type: 'player',
        position: 'Forward',
        jersey_number: 7,
        image_url: '/assets/players/ronaldo.jpg',
        bio: 'SIUUUUUU',
        nationality: 'Portuguese',
        experience: '20+ years',
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
    ];
    setTeamMembers(mockTeamMembers);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    clearForm();
  };

  const clearForm = () => {
    setName('');
    setMemberType('player');
    setPosition('');
    setJerseyNumber(undefined);
    setImageUrl('');
    setBio('');
    setNationality('');
    setExperience('');
    setIsActive(true);
    setEditingMember(null);
  };

  const handleSave = () => {
    if (!name || !memberType) {
      toast.error('Please fill out all required fields');
      return;
    }

    const newMember: TeamMember = {
      id: editingMember?.id || Date.now().toString(),
      name,
      member_type: memberType,
      position,
      jersey_number: jerseyNumber,
      image_url: imageUrl,
      bio,
      nationality,
      experience,
      is_active: isActive,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (editingMember) {
      // Update existing member
      const updatedMembers = teamMembers.map((member) =>
        member.id === editingMember.id ? newMember : member
      );
      setTeamMembers(updatedMembers);
      toast.success('Team member updated successfully');
    } else {
      // Add new member
      setTeamMembers([...teamMembers, newMember]);
      toast.success('Team member added successfully');
    }

    closeModal();
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setMemberType(member.member_type);
    setPosition(member.position || '');
    setJerseyNumber(member.jersey_number);
    setImageUrl(member.image_url || '');
    setBio(member.bio || '');
    setNationality(member.nationality || '');
    setExperience(member.experience || '');
    setIsActive(member.is_active);
    openModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      const updatedMembers = teamMembers.filter((member) => member.id !== id);
      setTeamMembers(updatedMembers);
      toast.success('Team member deleted successfully');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button onClick={openModal}>
            <Plus className="mr-2 h-4 w-4" /> Add Team Member
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 bg-gray-50"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.member_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.is_active ? 'Active' : 'Inactive'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                      className="ml-2"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                  </h3>
                  <div className="mt-2">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="memberType">Member Type *</Label>
                        <Select
                          value={memberType}
                          onValueChange={(value) => setMemberType(value as MemberType)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a member type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="player">Player</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="coach">Coach</SelectItem>
                            <SelectItem value="official">Official</SelectItem>
                            <SelectItem value="management">Management</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="position">Position</Label>
                        <Input
                          type="text"
                          id="position"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="jerseyNumber">Jersey Number</Label>
                        <Input
                          type="number"
                          id="jerseyNumber"
                          value={jerseyNumber !== undefined ? jerseyNumber.toString() : ''}
                          onChange={(e) => setJerseyNumber(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input
                          type="text"
                          id="imageUrl"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="nationality">Nationality</Label>
                        <Input
                          type="text"
                          id="nationality"
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="experience">Experience</Label>
                        <Input
                          type="text"
                          id="experience"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isActive"
                          checked={isActive}
                          onCheckedChange={() => setIsActive(!isActive)}
                        />
                        <Label htmlFor="isActive">Is Active</Label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Button
                    onClick={handleSave}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamMembersManager;

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { TeamMember } from '@/types/team';
import { useTeamStore } from '@/services/teamService';
import PlayerImageUploader from './PlayerImageUploader';

interface StaffEditorProps {
  staff: TeamMember;
  onBack: () => void;
}

const StaffEditor: React.FC<StaffEditorProps> = ({ staff, onBack }) => {
  const { addTeamMember, updateTeamMember } = useTeamStore((state) => ({
    addTeamMember: state.addTeamMember,
    updateTeamMember: state.updateTeamMember,
  }));

  const [name, setName] = useState(staff.name);
  const [position, setPosition] = useState(staff.position || '');
  const [nationality, setNationality] = useState(staff.nationality || '');
  const [bio, setBio] = useState(staff.bio || '');
  const [experience, setExperience] = useState(staff.experience || '');
  const [isActive, setIsActive] = useState(staff.is_active);
  const [imageUrl, setImageUrl] = useState(staff.image_url || '');
  const [isSaving, setIsSaving] = useState(false);

  // Handle image upload completion
  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  // Save staff data
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedStaff = {
        ...staff,
        name,
        position,
        nationality,
        bio,
        experience,
        is_active: isActive,
        image_url: imageUrl,
        created_at: staff.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (staff.id) {
        await updateTeamMember(updatedStaff);
      } else {
        await addTeamMember(updatedStaff, 'staff');
      }
      
      onBack();
    } catch (error) {
      console.error('Error saving staff member:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle>{staff.id ? 'Edit Staff Member' : 'Add New Staff Member'}</CardTitle>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <span className="flex items-center">
              <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save Staff Member
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Staff Name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Position/Role</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Position or Role"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="Nationality"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Staff biography"
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Experience"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active-status"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="active-status">Active Staff Member</Label>
            </div>
          </div>
          
          <div>
            <Label className="block mb-2">Staff Photo</Label>
            <PlayerImageUploader 
              currentUrl={imageUrl} 
              onUpload={handleImageUpload}
              playerName={name}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffEditor;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useTeamStore } from '@/services/teamStore';
import { MemberType } from '@/types/team';

interface StaffEditorProps {
  staffId?: string;
  memberType: 'staff' | 'coach' | 'official' | 'management';
  onSaved: () => void;
  onCancel: () => void;
}

const StaffEditor: React.FC<StaffEditorProps> = ({ staffId, memberType, onSaved, onCancel }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addTeamMember } = useTeamStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create a new staff member with required is_active field
      const staffData = {
        name,
        position,
        bio,
        experience,
        member_type: memberType as MemberType,
        image_url: image ? URL.createObjectURL(image) : undefined,
        is_active: true, // Add required field 
        nationality: '' // Add other required fields with defaults
      };
      
      // Pass both the data and the memberType to the addTeamMember function
      addTeamMember(staffData, memberType);
      
      setIsSubmitting(false);
      onSaved();
    } catch (error) {
      console.error(`Error saving ${memberType}:`, error);
      setIsSubmitting(false);
    }
  };

  const getMemberTypeTitle = () => {
    switch (memberType) {
      case 'coach':
        return 'Coach';
      case 'staff':
        return 'Staff Member';
      case 'official':
        return 'Club Official';
      case 'management':
        return 'Management Team Member';
      default:
        return 'Team Member';
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Add New {getMemberTypeTitle()}</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="position">Position/Role</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="bio">Bio/Description</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="experience">Experience</Label>
            <Textarea
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="image">Photo</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }}
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-6 space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : `Save ${getMemberTypeTitle()}`}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default StaffEditor;

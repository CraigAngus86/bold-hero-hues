import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTeamStore } from '@/services/teamStore';
import { TeamMember } from '@/types/team';

interface TeamMemberEditorProps {
  member?: TeamMember;
  onSave: () => void;
  onCancel: () => void;
}

const TeamMemberEditor: React.FC<TeamMemberEditorProps> = ({ member, onSave, onCancel }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TeamMember>({
    defaultValues: member,
  });
  const { createTeamMember, updateTeamMember } = useTeamStore();
  const [isNewMember, setIsNewMember] = useState(!member);

  useEffect(() => {
    if (member) {
      Object.keys(member).forEach(key => {
        setValue(key as keyof TeamMember, member[key as keyof TeamMember]);
      });
    }
  }, [member, setValue]);

  const onSubmit = async (data: TeamMember) => {
    try {
      if (isNewMember) {
        const success = await createTeamMember(data);
        if (success) {
          onSave();
        }
      } else {
        if (member) {
          const success = await updateTeamMember(member.id, data);
          if (success) {
            onSave();
          }
        }
      }
    } catch (error) {
      console.error("Error saving team member:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNewMember ? 'Add Team Member' : 'Edit Team Member'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" {...register("name", { required: 'Name is required' })} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <Input id="position" type="text" {...register("position")} />
          </div>
          <div>
            <Label htmlFor="member_type">Member Type</Label>
            <Select>
              <SelectTrigger className="w-full">
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
            <Label htmlFor="image_url">Image URL</Label>
            <Input id="image_url" type="text" {...register("image_url")} />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Input id="bio" type="text" {...register("bio")} />
          </div>
          <div>
            <Label htmlFor="is_active">Is Active</Label>
            <Input id="is_active" type="checkbox" {...register("is_active")} />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit">{isNewMember ? 'Create' : 'Update'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TeamMemberEditor;

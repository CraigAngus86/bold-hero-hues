
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TeamMember } from '@/types/team';
import { useForm } from 'react-hook-form';
import { createTeamMember, updateTeamMember } from '@/services/teamService';
import { toast } from 'sonner';

interface StaffEditorProps {
  staff?: TeamMember;
  onSave: () => void;
  onCancel: () => void;
}

const StaffEditor = ({ staff, onSave, onCancel }: StaffEditorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [staffType, setStaffType] = useState<'staff' | 'coach' | 'official' | 'management'>(
    (staff?.member_type as any) || 'staff'
  );
  const isEditing = !!staff;

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: staff || {
      name: '',
      position: '',
      bio: '',
      experience: '',
      member_type: staffType,
      image_url: '',
      is_active: true
    }
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const staffData: Omit<TeamMember, 'id'> = {
        name: data.name,
        position: data.position,
        bio: data.bio,
        experience: data.experience,
        member_type: staffType,
        image_url: data.image_url,
        is_active: true
      };

      if (isEditing && staff) {
        await updateTeamMember(staff.id, staffData);
        toast.success('Staff member updated successfully');
      } else {
        await createTeamMember(staffData);
        toast.success('Staff member created successfully');
      }
      onSave();
    } catch (error) {
      console.error('Error saving staff:', error);
      toast.error('Failed to save staff member');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name', { required: true })} />
        {errors.name && <span className="text-red-500 text-sm">This field is required</span>}
      </div>

      <div>
        <Label htmlFor="member_type">Staff Type</Label>
        <Select
          value={staffType}
          onValueChange={(value: 'staff' | 'coach' | 'official' | 'management') => setStaffType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select staff type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="coach">Coach</SelectItem>
            <SelectItem value="official">Official</SelectItem>
            <SelectItem value="management">Management</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="position">Position</Label>
        <Input id="position" {...register('position', { required: true })} />
        {errors.position && <span className="text-red-500 text-sm">This field is required</span>}
      </div>

      <div>
        <Label htmlFor="experience">Experience</Label>
        <Textarea id="experience" {...register('experience')} />
      </div>

      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input id="image_url" {...register('image_url')} />
      </div>

      <div>
        <Label htmlFor="bio">Biography</Label>
        <Textarea id="bio" {...register('bio')} />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : isEditing ? 'Update Staff' : 'Add Staff'}
        </Button>
      </div>
    </form>
  );
};

export default StaffEditor;

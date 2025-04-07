
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TeamMember } from '@/types/team';
import { useForm } from 'react-hook-form';
import { createTeamMember, updateTeamMember } from '@/services/teamService';
import { toast } from 'sonner';

interface PlayerEditorProps {
  player?: TeamMember;
  onSave: () => void;
  onCancel: () => void;
}

const PlayerEditor = ({ player, onSave, onCancel }: PlayerEditorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!player;

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: player || {
      name: '',
      position: '',
      jersey_number: undefined,
      bio: '',
      member_type: 'player',
      image_url: '',
      nationality: '',
      experience: '',
      is_active: true
    }
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const playerData: Omit<TeamMember, 'id'> = {
        name: data.name,
        position: data.position,
        jersey_number: parseInt(data.jersey_number),
        bio: data.bio,
        member_type: 'player' as const,
        image_url: data.image_url,
        is_active: true,
        nationality: data.nationality,
        experience: data.experience
      };

      if (isEditing && player) {
        await updateTeamMember(player.id, playerData);
        toast.success('Player updated successfully');
      } else {
        await createTeamMember(playerData);
        toast.success('Player created successfully');
      }
      onSave();
    } catch (error) {
      console.error('Error saving player:', error);
      toast.error('Failed to save player');
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
        <Label htmlFor="position">Position</Label>
        <Input id="position" {...register('position', { required: true })} />
        {errors.position && <span className="text-red-500 text-sm">This field is required</span>}
      </div>

      <div>
        <Label htmlFor="jersey_number">Jersey Number</Label>
        <Input id="jersey_number" type="number" {...register('jersey_number')} />
      </div>

      <div>
        <Label htmlFor="nationality">Nationality</Label>
        <Input id="nationality" {...register('nationality')} />
      </div>

      <div>
        <Label htmlFor="experience">Experience</Label>
        <Input id="experience" {...register('experience')} />
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
          {isLoading ? 'Saving...' : isEditing ? 'Update Player' : 'Add Player'}
        </Button>
      </div>
    </form>
  );
};

export default PlayerEditor;

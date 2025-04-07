
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createTeamMember, updateTeamMember, TeamMember } from '@/services/teamService';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  position: z.string().min(1, "Position is required"),
  jersey_number: z.coerce.number().int().min(1).max(99),
  bio: z.string().optional(),
  nationality: z.string().optional(),
  experience: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
});

type PlayerFormValues = z.infer<typeof formSchema>;

interface PlayerEditorProps {
  player?: TeamMember;
  onSave: () => void;
  onCancel: () => void;
}

const PlayerEditor: React.FC<PlayerEditorProps> = ({ player, onSave, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: player?.name || '',
      position: player?.position || '',
      jersey_number: player?.jersey_number || 1,
      bio: player?.bio || '',
      nationality: player?.nationality || '',
      experience: player?.experience || '',
      image_url: player?.image_url || '',
    }
  });
  
  const handleSubmit = async (values: PlayerFormValues) => {
    setIsSubmitting(true);
    
    const playerData = {
      name: values.name,
      position: values.position,
      jersey_number: values.jersey_number,
      bio: values.bio || '',
      member_type: 'player' as const, // explicitly set the member type
      image_url: values.image_url || '',
      is_active: true,
      nationality: values.nationality || '',
      experience: values.experience || '',
    };
    
    try {
      if (player?.id) {
        await updateTeamMember(player.id, playerData);
      } else {
        await createTeamMember(playerData);
      }
      
      setIsSubmitting(false);
      onSave();
    } catch (error) {
      console.error('Error saving player:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-4 bg-white rounded-md">
      <h2 className="text-xl font-semibold mb-4">{player ? 'Edit Player' : 'Add New Player'}</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Player name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="jersey_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jersey Number</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={1} max={99} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                      <SelectItem value="Defender">Defender</SelectItem>
                      <SelectItem value="Midfielder">Midfielder</SelectItem>
                      <SelectItem value="Forward">Forward</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Scottish" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., 5 years" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Player Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="Enter player biography and career highlights"
                    className="min-h-[120px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : player ? 'Update Player' : 'Add Player'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PlayerEditor;

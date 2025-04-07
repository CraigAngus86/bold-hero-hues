
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createTeamMember, updateTeamMember, MemberType } from '@/services/teamService';
import type { TeamMember } from '@/types/team';

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  position: z.string().min(1, "Position is required"),
  bio: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  experience: z.string().optional(),
});

type StaffFormValues = z.infer<typeof formSchema>;

interface StaffEditorProps {
  staff?: TeamMember;
  onSave: () => void;
  onCancel: () => void;
}

const StaffEditor: React.FC<StaffEditorProps> = ({ staff, onSave, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: staff?.name || '',
      position: staff?.position || '',
      bio: staff?.bio || '',
      image_url: staff?.image_url || '',
      experience: staff?.experience || '',
    }
  });
  
  const handleSubmit = async (values: StaffFormValues) => {
    setIsSubmitting(true);
    
    const staffData = {
      name: values.name,
      position: values.position,
      bio: values.bio || '',
      member_type: staff?.member_type || 'staff' as MemberType,
      image_url: values.image_url || '',
      is_active: true,
      experience: values.experience || '',
    };
    
    try {
      if (staff?.id) {
        await updateTeamMember(staff.id, staffData);
      } else {
        await createTeamMember(staffData);
      }
      
      setIsSubmitting(false);
      onSave();
    } catch (error) {
      console.error('Error saving staff member:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-md">
      <h2 className="text-xl font-semibold mb-4">{staff?.id ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
      
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
                    <Input {...field} placeholder="Staff member name" />
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
                  <FormControl>
                    <Input {...field} placeholder="e.g., Head Coach" />
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
                    <Input {...field} placeholder="e.g., 10+ years" />
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
                <FormLabel>Biography</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="Enter staff member biography and career highlights"
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
              {isSubmitting ? 'Saving...' : staff?.id ? 'Update Staff Member' : 'Add Staff Member'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StaffEditor;

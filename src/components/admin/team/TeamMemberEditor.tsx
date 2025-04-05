
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, UserCircle, Calendar, Flag, Award, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { createTeamMember, updateTeamMember } from '@/services/teamDbService';
import { useTeamStore } from '@/services/teamService';
import { TeamMember, MemberType } from '@/types/team';
import PlayerImageUploader from '@/components/admin/team/PlayerImageUploader';

interface TeamMemberEditorProps {
  member?: TeamMember | null;
  onClose: () => void;
}

const defaultMember: Partial<TeamMember> = {
  name: '',
  member_type: 'player',
  position: '',
  image_url: '',
  bio: '',
  nationality: '',
  jersey_number: undefined,
  previous_clubs: [],
  experience: '',
  is_active: true
};

const TeamMemberEditor: React.FC<TeamMemberEditorProps> = ({ member, onClose }) => {
  const { loadTeamMembers } = useTeamStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(member?.image_url || '');
  
  const isEditMode = !!member?.id;
  
  const form = useForm<TeamMember>({
    defaultValues: member || defaultMember as TeamMember
  });
  
  const memberType = form.watch('member_type');
  
  const handleSubmit = async (data: TeamMember) => {
    try {
      setIsSubmitting(true);
      
      // Include the uploaded image URL if available
      if (imageUrl) {
        data.image_url = imageUrl;
      }
      
      if (isEditMode) {
        await updateTeamMember(member!.id, data);
        toast.success("Team member updated successfully");
      } else {
        await createTeamMember(data);
        toast.success("Team member created successfully");
      }
      
      await loadTeamMembers();
      onClose();
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error("Failed to save team member");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{isEditMode ? 'Edit Team Member' : 'Create New Team Member'}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column - Basic info */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserCircle className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                          <Input placeholder="Full name" className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="member_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select member type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="player">Player</SelectItem>
                          <SelectItem value="management">Management</SelectItem>
                          <SelectItem value="official">Official</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <Input placeholder="Position or role" {...field} />
                      </FormControl>
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
                        <div className="relative">
                          <Flag className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                          <Input placeholder="Country" className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {memberType === 'player' && (
                  <FormField
                    control={form.control}
                    name="jersey_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jersey Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Hash className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input 
                              type="number" 
                              placeholder="Jersey #" 
                              className="pl-8" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          Is this team member currently active?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Middle column - Profile photo and bio */}
              <div className="space-y-4">
                <FormItem>
                  <FormLabel>Profile Photo</FormLabel>
                  <PlayerImageUploader
                    initialImageUrl={imageUrl}
                    onUpload={(url) => setImageUrl(url)}
                    playerName={form.getValues('name')}
                  />
                </FormItem>
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biography</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief biography and career highlights" 
                          className="resize-none h-[200px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Right column - Additional info */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                          <Input placeholder="Years of experience" className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {memberType === 'player' && (
                  <FormField
                    control={form.control}
                    name="previous_clubs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous Clubs</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Award className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input 
                              placeholder="Comma-separated clubs" 
                              className="pl-8"
                              value={field.value?.join(', ') || ''}
                              onChange={(e) => {
                                const clubs = e.target.value
                                  .split(',')
                                  .map(club => club.trim())
                                  .filter(club => club !== '');
                                field.onChange(clubs.length > 0 ? clubs : []);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Enter club names separated by commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {/* Team member preview */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Profile Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-1 pb-3 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-3 bg-gray-100">
                        {imageUrl ? (
                          <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-200">
                            <UserCircle className="text-gray-400 w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{form.watch('name') || 'Name'}</p>
                        <p className="text-sm text-gray-500">{form.watch('position') || 'Position'}</p>
                        {memberType === 'player' && form.watch('jersey_number') && (
                          <div className="mt-1 inline-block px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-md">
                            #{form.watch('jersey_number')}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50/50 border-t flex justify-between">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditMode ? 'Update' : 'Save'} Team Member
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default TeamMemberEditor;

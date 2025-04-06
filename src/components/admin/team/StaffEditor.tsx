
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import { TeamMember } from '@/types/team';
import { toast } from 'sonner';
import PlayerImageUploader from './PlayerImageUploader';

interface StaffEditorProps {
  staff: TeamMember;
  onBack: () => void;
}

const StaffEditor: React.FC<StaffEditorProps> = ({ staff, onBack }) => {
  const [formData, setFormData] = useState<TeamMember>({
    ...staff,
    created_at: staff.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_active: checked
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      image_url: url
    }));
    toast.success('Image uploaded successfully');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would typically call an API to save the staff data
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Staff member ${staff.id ? 'updated' : 'created'} successfully`);
      onBack();
    } catch (error) {
      toast.error('Failed to save staff information');
      console.error('Error saving staff member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle>{staff.id ? 'Edit Staff Member' : 'Add New Staff Member'}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="position">Position</Label>
                <Input 
                  id="position" 
                  name="position" 
                  value={formData.position} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Input 
                  id="nationality" 
                  name="nationality" 
                  value={formData.nationality} 
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input 
                  id="experience" 
                  name="experience" 
                  value={formData.experience} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is_active" 
                  checked={formData.is_active}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Staff Image</Label>
                <div className="mt-2">
                  <PlayerImageUploader 
                    currentImage={formData.image_url} 
                    onUpload={handleImageUpload} 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleChange}
                  rows={5}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Staff Member
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StaffEditor;


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Save, X } from 'lucide-react';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
}

interface StaffFormProps {
  isEditing: boolean;
  formData: Omit<StaffMember, 'id'>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const StaffForm = ({
  isEditing,
  formData,
  onInputChange,
  onSave,
  onCancel
}: StaffFormProps) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-8">
      <h3 className="text-lg font-medium mb-4">
        {isEditing ? 'Edit Staff Member' : 'Add Staff Member'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <Label htmlFor="name">Name*</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={onInputChange} 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="role">Role*</Label>
            <Input 
              id="role" 
              name="role" 
              value={formData.role} 
              onChange={onInputChange} 
              placeholder="e.g. Manager, Coach, Physiotherapist"
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input 
              id="image" 
              name="image" 
              value={formData.image || ''} 
              onChange={onInputChange} 
              placeholder="https://example.com/image.jpg" 
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="bio">Biography</Label>
            <Textarea 
              id="bio" 
              name="bio" 
              value={formData.bio} 
              onChange={onInputChange}
              className="min-h-[178px]"
              placeholder="Staff member biography and career information..."
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        
        {isEditing ? (
          <Button onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        ) : (
          <Button onClick={onSave}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        )}
      </div>
    </div>
  );
};

export default StaffForm;

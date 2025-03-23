
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Save, X } from 'lucide-react';

export interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  age: number;
  height: string;
  previousClubs: string;
  bio: string;
  image?: string;
}

const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

interface PlayerFormProps {
  isEditing: boolean;
  formData: Omit<Player, 'id'>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const PlayerForm = ({
  isEditing,
  formData,
  onInputChange,
  onSelectChange,
  onSave,
  onCancel
}: PlayerFormProps) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-8">
      <h3 className="text-lg font-medium mb-4">
        {isEditing ? 'Edit Player' : 'Add Player'}
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
            <Label htmlFor="position">Position*</Label>
            <Select value={formData.position} onValueChange={onSelectChange}>
              <SelectTrigger id="position">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {POSITIONS.map(pos => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="number">Jersey Number</Label>
              <Input 
                id="number" 
                name="number" 
                type="number" 
                value={formData.number} 
                onChange={onInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age" 
                name="age" 
                type="number" 
                value={formData.age} 
                onChange={onInputChange} 
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="height">Height</Label>
            <Input 
              id="height" 
              name="height" 
              value={formData.height} 
              onChange={onInputChange} 
              placeholder="5'10\""
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="previousClubs">Previous Clubs</Label>
            <Input 
              id="previousClubs" 
              name="previousClubs" 
              value={formData.previousClubs} 
              onChange={onInputChange} 
              placeholder="Aberdeen, Cove Rangers"
            />
          </div>
          
          <div>
            <Label htmlFor="bio">Biography</Label>
            <Textarea 
              id="bio" 
              name="bio" 
              value={formData.bio} 
              onChange={onInputChange}
              className="min-h-[120px]"
              placeholder="Player biography and career highlights..."
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
            Add Player
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlayerForm;

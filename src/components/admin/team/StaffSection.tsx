
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ManagementList } from './ManagementList';
import StaffForm, { StaffMember } from './StaffForm';
import { useTeam } from './contexts/TeamContext';
import { toast } from 'sonner';

const StaffSection = () => {
  const { staff, setStaff } = useTeam();
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [isEditingStaff, setIsEditingStaff] = useState<StaffMember | null>(null);
  
  const [newStaffData, setNewStaffData] = useState<Omit<StaffMember, 'id'>>({
    name: '',
    role: '',
    bio: '',
    image: ''
  });
  
  const handleAddStaff = () => {
    setIsAddingStaff(true);
    setIsEditingStaff(null);
    setNewStaffData({
      name: '',
      role: '',
      bio: '',
      image: ''
    });
  };
  
  const handleEditStaff = (member: StaffMember) => {
    setIsAddingStaff(false);
    setIsEditingStaff(member);
    setNewStaffData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: member.image
    });
  };
  
  const handleStaffInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewStaffData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveStaff = () => {
    if (isEditingStaff) {
      // Update existing staff member
      setStaff(staff.map(member => 
        member.id === isEditingStaff.id 
          ? { ...member, ...newStaffData } 
          : member
      ));
      toast.success(`Staff member ${newStaffData.name} updated successfully`);
    } else {
      // Add new staff member
      const newMember: StaffMember = {
        id: Date.now().toString(),
        ...newStaffData
      };
      setStaff([...staff, newMember]);
      toast.success(`Staff member ${newStaffData.name} added successfully`);
    }
    
    setIsAddingStaff(false);
    setIsEditingStaff(null);
  };
  
  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter(member => member.id !== id));
    toast.success('Staff member removed successfully');
  };
  
  const handleCancelStaffForm = () => {
    setIsAddingStaff(false);
    setIsEditingStaff(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Management & Staff</h3>
        
        {!isAddingStaff && !isEditingStaff && (
          <Button onClick={handleAddStaff} className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        )}
      </div>
      
      {(isAddingStaff || isEditingStaff) && (
        <StaffForm
          isEditing={!!isEditingStaff}
          formData={newStaffData}
          onInputChange={handleStaffInputChange}
          onSave={handleSaveStaff}
          onCancel={handleCancelStaffForm}
        />
      )}
      
      <ManagementList 
        staff={staff}
        onEdit={handleEditStaff}
        onDelete={handleDeleteStaff}
      />
    </>
  );
};

export default StaffSection;

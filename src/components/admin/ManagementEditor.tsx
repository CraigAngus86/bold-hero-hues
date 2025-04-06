import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock management data for demonstration
const initialStaff = [
  {
    id: 1,
    name: "David Wilson",
    role: "Head Coach",
    bio: "Former professional player with over 10 years of coaching experience",
    image: "/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Assistant Coach",
    bio: "Specializes in player development and tactical analysis",
    image: "/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png"
  }
];

interface StaffMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const ManagementEditor = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
  
  const openNewDialog = () => {
    setCurrentStaff({
      id: staff.length > 0 ? Math.max(...staff.map(item => item.id)) + 1 : 1,
      name: '',
      role: '',
      bio: '',
      image: ''
    });
    setDialogOpen(true);
  };
  
  const openEditDialog = (staffMember: StaffMember) => {
    setCurrentStaff(staffMember);
    setDialogOpen(true);
  };
  
  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentStaff(null);
  };
  
  const handleDelete = (id: number) => {
    const updatedStaff = staff.filter(item => item.id !== id);
    setStaff(updatedStaff);
    toast({
      title: "Staff member deleted",
      description: "The staff member has been successfully removed.",
    });
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentStaff) return;
    
    if (staff.some(item => item.id === currentStaff.id)) {
      // Update existing
      setStaff(staff.map(item => item.id === currentStaff.id ? currentStaff : item));
      toast({
        title: "Staff member updated",
        description: "The staff member information has been successfully updated."
      });
    } else {
      // Add new
      setStaff([...staff, currentStaff]);
      toast({
        title: "Staff member added",
        description: "A new staff member has been successfully added."
      });
    }
    
    closeDialog();
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Management Staff</h3>
        <Button onClick={openNewDialog} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((staffMember) => (
            <TableRow key={staffMember.id}>
              <TableCell className="font-medium">{staffMember.name}</TableCell>
              <TableCell>{staffMember.role}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(staffMember)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(staffMember.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentStaff?.id && staff.some(item => item.id === currentStaff.id) ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium">Name</label>
                <Input
                  id="name"
                  value={currentStaff?.name || ''}
                  onChange={(e) => setCurrentStaff(prev => prev ? {...prev, name: e.target.value} : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="role" className="text-right text-sm font-medium">Role</label>
                <Input
                  id="role"
                  value={currentStaff?.role || ''}
                  onChange={(e) => setCurrentStaff(prev => prev ? {...prev, role: e.target.value} : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="image" className="text-right text-sm font-medium">Image URL</label>
                <Input
                  id="image"
                  value={currentStaff?.image || ''}
                  onChange={(e) => setCurrentStaff(prev => prev ? {...prev, image: e.target.value} : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <label htmlFor="bio" className="text-right text-sm font-medium">Biography</label>
                <Textarea
                  id="bio"
                  value={currentStaff?.bio || ''}
                  onChange={(e) => setCurrentStaff(prev => prev ? {...prev, bio: e.target.value} : null)}
                  className="col-span-3"
                  rows={3}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={closeDialog}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagementEditor;


import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, Save, X } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  category: 'coaching' | 'medical' | 'administrative';
  bio?: string;
  image?: string;
  email?: string;
  phone?: string;
}

const CATEGORIES = [
  { value: 'coaching', label: 'Coaching Staff' },
  { value: 'medical', label: 'Medical Staff' },
  { value: 'administrative', label: 'Administrative Staff' }
];

const MANAGEMENT_STORAGE_KEY = 'banks_o_dee_management';

const ManagementManager = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem(MANAGEMENT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<StaffMember, 'id'>>({
    name: '',
    role: '',
    category: 'coaching',
    bio: '',
    image: '',
    email: '',
    phone: ''
  });
  
  const saveToLocalStorage = (data: StaffMember[]) => {
    localStorage.setItem(MANAGEMENT_STORAGE_KEY, JSON.stringify(data));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      category: value as 'coaching' | 'medical' | 'administrative' 
    }));
  };
  
  const handleAddStaff = () => {
    if (!formData.name || !formData.role || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newStaffMember: StaffMember = {
      ...formData,
      id: Date.now().toString()
    };
    
    const updatedStaff = [...staffMembers, newStaffMember];
    setStaffMembers(updatedStaff);
    saveToLocalStorage(updatedStaff);
    
    setFormData({
      name: '',
      role: '',
      category: 'coaching',
      bio: '',
      image: '',
      email: '',
      phone: ''
    });
    
    setIsAdding(false);
    toast.success('Staff member added successfully');
  };
  
  const handleStartEdit = (member: StaffMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      category: member.category,
      bio: member.bio || '',
      image: member.image || '',
      email: member.email || '',
      phone: member.phone || ''
    });
  };
  
  const handleSaveEdit = (id: string) => {
    if (!formData.name || !formData.role || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const updatedStaff = staffMembers.map(member => 
      member.id === id ? { ...formData, id } : member
    );
    
    setStaffMembers(updatedStaff);
    saveToLocalStorage(updatedStaff);
    setEditingId(null);
    toast.success('Staff member updated successfully');
  };
  
  const handleDelete = (id: string) => {
    const updatedStaff = staffMembers.filter(member => member.id !== id);
    setStaffMembers(updatedStaff);
    saveToLocalStorage(updatedStaff);
    toast.success('Staff member deleted successfully');
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      name: '',
      role: '',
      category: 'coaching',
      bio: '',
      image: '',
      email: '',
      phone: ''
    });
  };
  
  const filteredStaffMembers = selectedCategory 
    ? staffMembers.filter(member => member.category === selectedCategory)
    : staffMembers;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Management Team</CardTitle>
        <CardDescription>Add, edit, or delete staff members</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="category-filter">Filter by Category:</Label>
            <Select value={selectedCategory || ''} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category-filter" className="w-40">
                <SelectValue placeholder="All Staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Staff</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {!isAdding && (
            <Button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Staff Member</span>
            </Button>
          )}
        </div>
        
        {(isAdding || editingId) && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-medium mb-4">
              {editingId ? 'Edit Staff Member' : 'Add Staff Member'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Name*</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Role/Position*</Label>
                  <Input 
                    id="role" 
                    name="role" 
                    value={formData.role} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Head Coach"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category*</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input 
                    id="image" 
                    name="image" 
                    value={formData.image} 
                    onChange={handleInputChange} 
                    placeholder="https://example.com/image.jpg" 
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="bio">Biography</Label>
                  <Input 
                    id="bio" 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="john.doe@example.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="+44 1234 567890"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              
              {editingId ? (
                <Button onClick={() => handleSaveEdit(editingId)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              ) : (
                <Button onClick={handleAddStaff}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              )}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaffMembers.length === 0 ? (
            <div className="col-span-full text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No staff members found.</p>
            </div>
          ) : (
            filteredStaffMembers.map(member => (
              <Card key={member.id} className={editingId === member.id ? 'border-blue-500' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleStartEdit(member)}
                        disabled={!!editingId}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(member.id)}
                        disabled={!!editingId}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-16 h-16 object-cover rounded-full" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div className="text-sm">
                      {member.bio && <p>{member.bio}</p>}
                      {member.email && <p className="mt-1"><span className="font-medium">Email:</span> {member.email}</p>}
                      {member.phone && <p><span className="font-medium">Phone:</span> {member.phone}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-sm text-gray-500">
          Total staff members: {staffMembers.length}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ManagementManager;


import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PlusCircle, Trash2, Edit, Shield, ShieldAlert, UserPlus } from 'lucide-react';

// Mock user data
const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@banksofdee.com', role: 'admin', lastLogin: '2023-10-15 10:23' },
  { id: 2, name: 'Content Editor', email: 'editor@banksofdee.com', role: 'editor', lastLogin: '2023-10-14 16:45' },
  { id: 3, name: 'Social Media Manager', email: 'social@banksofdee.com', role: 'editor', lastLogin: '2023-10-12 09:17' },
  { id: 4, name: 'Team Manager', email: 'manager@banksofdee.com', role: 'editor', lastLogin: '2023-10-10 11:32' },
];

type UserRole = 'admin' | 'editor' | 'viewer';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  lastLogin: string;
}

const AdminUsersSection = () => {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'editor' as UserRole,
    password: '',
    confirmPassword: '',
  });
  
  const handleAddUser = () => {
    // Validation
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Add new user
    const newId = Math.max(...users.map(u => u.id)) + 1;
    const userToAdd = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      lastLogin: 'Never'
    };
    
    setUsers([...users, userToAdd]);
    setIsAddUserOpen(false);
    toast.success(`User ${newUser.name} added successfully`);
    
    // Reset form
    setNewUser({
      name: '',
      email: '',
      role: 'editor',
      password: '',
      confirmPassword: '',
    });
  };
  
  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success('User deleted successfully');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">User Management</CardTitle>
          <Button onClick={() => setIsAddUserOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="px-0 pb-0">
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {user.role === 'admin' ? (
                        <ShieldAlert className="h-4 w-4 mr-1 text-red-500" />
                      ) : (
                        <Shield className="h-4 w-4 mr-1 text-blue-500" />
                      )}
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="text-sm font-medium mb-2">Access Levels</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start">
              <ShieldAlert className="h-4 w-4 mr-2 text-red-500 mt-0.5" />
              <div>
                <span className="font-medium">Admin:</span> 
                <span className="text-gray-600 ml-1">Full access to all website areas, user management, database, and configuration.</span>
              </div>
            </div>
            <div className="flex items-start">
              <Shield className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
              <div>
                <span className="font-medium">Editor:</span> 
                <span className="text-gray-600 ml-1">Can edit content, manage news, players, fixtures, and results. Cannot manage users or settings.</span>
              </div>
            </div>
            <div className="flex items-start">
              <Shield className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
              <div>
                <span className="font-medium">Viewer:</span> 
                <span className="text-gray-600 ml-1">Read-only access to admin panel. Cannot make changes to any content.</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with appropriate permissions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name*</label>
              <Input 
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email*</label>
              <Input 
                name="email"
                type="email"
                value={newUser.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select 
                value={newUser.role} 
                onValueChange={(value: UserRole) => setNewUser({...newUser, role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Password*</label>
              <Input 
                name="password"
                type="password"
                value={newUser.password}
                onChange={handleInputChange}
                placeholder="Create password"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password*</label>
              <Input 
                name="confirmPassword"
                type="password"
                value={newUser.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddUser}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminUsersSection;

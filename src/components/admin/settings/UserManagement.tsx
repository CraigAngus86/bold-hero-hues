
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CircleEllipsis, 
  PlusCircle, 
  UserPlus, 
  ShieldAlert, 
  Key, 
  UserCog,
  Trash2,
  Ban
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define form schema for new user
const userFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  role: z.string(),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  isActive: z.boolean().default(true)
});

type UserFormValues = z.infer<typeof userFormSchema>;

// Mock user data
const mockUsers = [
  { id: '1', name: 'John Smith', email: 'john@banksofdee.com', role: 'Admin', isActive: true },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@banksofdee.com', role: 'Editor', isActive: true },
  { id: '3', name: 'Mike Wilson', email: 'mike@banksofdee.com', role: 'Viewer', isActive: false },
];

const UserManagement = () => {
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [users, setUsers] = useState(mockUsers);

  // Setup form with validation
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      role: 'editor',
      password: '',
      isActive: true
    },
  });

  // Handle form submission
  const onSubmit = (values: UserFormValues) => {
    // In a real implementation, this would call an API
    console.log(values);
    
    // Add user to the list (mock implementation)
    setUsers([
      ...users, 
      {
        id: (users.length + 1).toString(),
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        role: values.role.charAt(0).toUpperCase() + values.role.slice(1),
        isActive: values.isActive
      }
    ]);
    
    toast({
      title: "User created",
      description: `${values.firstName} ${values.lastName} has been added as a ${values.role}`,
    });
    
    setIsCreateUserOpen(false);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage admin users, roles, and permissions
            </CardDescription>
          </div>
          <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user with appropriate role and permissions
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="email@example.com"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="••••••••" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Password must be at least 8 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This determines what actions the user can perform
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Active Status</FormLabel>
                          <FormDescription>
                            User can access the system immediately if active
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
                  
                  <DialogFooter className="pt-4">
                    <Button variant="outline" type="button" onClick={() => setIsCreateUserOpen(false)}>Cancel</Button>
                    <Button type="submit">Create User</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.role === 'Admin' ? 'default' : 
                             (user.role === 'Editor' ? 'outline' : 'secondary')}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <CircleEllipsis className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <UserCog className="mr-2 h-4 w-4" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ShieldAlert className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Key className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className={user.isActive ? "text-amber-600" : "text-emerald-600"}>
                          <Ban className="mr-2 h-4 w-4" />
                          {user.isActive ? 'Deactivate' : 'Activate'} User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>Define role permissions and access levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Role permissions layout */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Admin Role Permissions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['News Management', 'Team Management', 'Fixtures', 'League Table', 
                  'Media Gallery', 'Sponsors', 'Tickets', 'Fans', 'Settings'].map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox id={`admin-${area.toLowerCase().replace(' ', '-')}`} defaultChecked />
                    <label htmlFor={`admin-${area.toLowerCase().replace(' ', '-')}`}>
                      {area}
                    </label>
                  </div>
                ))}
              </div>
              
              <h4 className="text-sm font-semibold mt-4">Editor Role Permissions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['News Management', 'Team Management', 'Fixtures', 'League Table', 
                  'Media Gallery', 'Sponsors', 'Tickets', 'Fans', 'Settings'].map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`editor-${area.toLowerCase().replace(' ', '-')}`} 
                      defaultChecked={['News Management', 'Team Management', 'Media Gallery'].includes(area)}
                    />
                    <label htmlFor={`editor-${area.toLowerCase().replace(' ', '-')}`}>
                      {area}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;

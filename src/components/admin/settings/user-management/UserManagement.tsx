
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { userFormSchema, UserFormValues } from './UserFormSchema';
import { getUsers, createUser } from '@/services/userManagementService';
import CreateUserDialog from './CreateUserDialog';
import UsersTable from './UsersTable';
import UserRolePermissions from './UserRolePermissions';
import UserActivityLogs from './UserActivityLogs';
import TwoFactorSetup from './TwoFactorSetup';

// Define the User type that's specific to this component
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string; // Required in this context
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

const UserManagement = () => {
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Load users when component mounts
  useEffect(() => {
    loadUsers();
  }, []);

  // Function to load users from API
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const loadedUsers = await getUsers();
      // Map the loaded users to the component-specific User type
      const mappedUsers: User[] = loadedUsers.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        role: user.role || 'user',
        isActive: user.isActive !== false,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt || new Date().toISOString()
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error loading users",
        description: "There was a problem loading the user list.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (values: UserFormValues) => {
    try {
      const { user, error } = await createUser(
        values.email, 
        values.password, 
        values.role,
        {
          firstName: values.firstName,
          lastName: values.lastName,
          isActive: values.isActive
        }
      );

      if (error) {
        throw new Error(error);
      }

      if (user) {
        // Add new user to the list with the needed name property
        const newUser: User = {
          id: user.id,
          email: user.email,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
          role: user.role || 'user',
          isActive: user.isActive !== false,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt || new Date().toISOString()
        };
        
        setUsers(prevUsers => [...prevUsers, newUser]);
        
        toast({
          title: "User created",
          description: `${values.firstName} ${values.lastName} has been added as a ${values.role}`,
        });
        
        setIsCreateUserOpen(false);
        form.reset();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error creating user",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
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
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={loadUsers} 
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={() => setIsCreateUserOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <UsersTable 
            users={users}
            onUserUpdated={loadUsers}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserRolePermissions />
        <TwoFactorSetup />
      </div>
      
      <UserActivityLogs />
      
      <CreateUserDialog 
        isOpen={isCreateUserOpen} 
        onOpenChange={setIsCreateUserOpen}
        form={form}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default UserManagement;

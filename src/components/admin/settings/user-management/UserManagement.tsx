
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { userFormSchema, UserFormValues, mockUsers } from './UserFormSchema';
import CreateUserDialog from './CreateUserDialog';
import UsersTable from './UsersTable';
import UserRolePermissions from './UserRolePermissions';

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
          <Button onClick={() => setIsCreateUserOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <UsersTable users={users} />
        </CardContent>
      </Card>

      <UserRolePermissions />
      
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

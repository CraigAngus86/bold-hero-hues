import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/types/auth';
import UsersTable from './UsersTable';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Function to generate a display name from user data
  const getDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.name) {
      return user.name;
    } else {
      return user.email;
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Mock user data for demonstration
      const mockUsers: User[] = [
        {
          id: uuidv4(),
          email: 'admin@example.com',
          name: 'Admin User',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          isActive: true,
          avatarUrl: 'https://avatar.example.com/admin.jpg',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        },
        {
          id: uuidv4(),
          email: 'editor@example.com',
          name: 'Editor User',
          firstName: 'Editor',
          lastName: 'User',
          role: 'editor',
          isActive: true,
          avatarUrl: 'https://avatar.example.com/editor.jpg',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        },
        {
          id: uuidv4(),
          email: 'viewer@example.com',
          name: 'Viewer User',
          firstName: 'Viewer',
          lastName: 'User',
          role: 'viewer',
          isActive: false,
          avatarUrl: 'https://avatar.example.com/viewer.jpg',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Function to handle user creation
  const handleCreateUser = async (userData: any) => {
    try {
      setIsLoading(true);
      
      // Add missing fields to match User interface
      const newUser: User = {
        id: uuidv4(),
        email: userData.email,
        name: userData.name || `${userData.firstName} ${userData.lastName}`,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        role: userData.role,
        isActive: true,
        avatarUrl: userData.avatarUrl || '',
        createdAt: new Date().toISOString(),
        lastLogin: ''
      };
      
      // Update state with new user
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      toast.success(`User ${getDisplayName(newUser)} created successfully`);
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      setIsLoading(true);
      
      // Update state with updated user
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      
      toast.success(`User ${getDisplayName(updatedUser)} updated successfully`);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Update state by removing the user
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage system users and their permissions
            </CardDescription>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <UsersTable 
            users={users} 
            isLoading={isLoading}
            onUserUpdated={fetchUsers} 
          />
        </CardContent>
      </Card>
      
      {showCreateDialog && (
        <div>
          {/* Mock Create User Dialog */}
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Create New User</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Mock user creation form. In a real application, this would be a fully functional form.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

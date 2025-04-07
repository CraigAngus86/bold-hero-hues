
import React, { useState, useEffect } from 'react';
import { User } from '@/types/User';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Mock user data for demonstration
      const mockUsers = [
        {
          id: uuidv4(),
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          name: 'Admin User',
          role: 'admin',
          isActive: true,
          avatarUrl: 'https://avatar.example.com/admin.jpg',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          banned_until: null
        },
        {
          id: uuidv4(),
          email: 'editor@example.com',
          firstName: 'Editor',
          lastName: 'User',
          name: 'Editor User',
          role: 'editor',
          isActive: true,
          avatarUrl: 'https://avatar.example.com/editor.jpg',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          banned_until: null
        },
        {
          id: uuidv4(),
          email: 'viewer@example.com',
          firstName: 'Viewer',
          lastName: 'User',
          name: 'Viewer User',
          role: 'viewer',
          isActive: false,
          avatarUrl: 'https://avatar.example.com/viewer.jpg',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          banned_until: null
        }
      ];
      
      // Cast to User[] to satisfy the type system
      setUsers(mockUsers as User[]);
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

  return (
    <div>
      <h1>User Management</h1>
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <div>
          {users.length > 0 ? (
            <ul>
              {users.map(user => (
                <li key={user.id}>{user.name} - {user.role}</li>
              ))}
            </ul>
          ) : (
            <p>No users found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserManagement;

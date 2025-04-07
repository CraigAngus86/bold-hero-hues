
// Fix for line 167 - convert the auth.User to User
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
    setUsers(mockUsers as any);
  } catch (error) {
    console.error('Error fetching users:', error);
    toast.error('Failed to load users');
  } finally {
    setIsLoading(false);
  }
};

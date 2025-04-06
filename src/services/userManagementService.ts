
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  name?: string;
  avatarUrl?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

/**
 * Get all users
 */
export async function getUsers(): Promise<User[]> {
  try {
    // First get auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;

    // Then get user_roles
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');
    
    if (rolesError) throw rolesError;

    // Convert auth users to our User interface and combine with roles data
    const users: User[] = authUsers.users.map(authUser => {
      const userRole = rolesData?.find(role => role.user_id === authUser.id);
      
      return {
        id: authUser.id,
        email: authUser.email || '',
        role: userRole?.role || 'user',
        isActive: !authUser.banned_until,
        lastLogin: authUser.last_sign_in_at,
        createdAt: authUser.created_at,
        name: authUser.user_metadata?.name as string | undefined,
        avatarUrl: authUser.user_metadata?.avatar_url as string | undefined,
      };
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    // Get auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(id);
    
    if (authError) throw authError;
    if (!authUser) return null;

    // Get user role
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', id)
      .single();
    
    if (roleError && roleError.code !== 'PGRST116') throw roleError;

    // Return user with role information
    return {
      id: authUser.user.id,
      email: authUser.user.email || '',
      role: userRole?.role || 'user',
      isActive: !authUser.user.banned_until,
      lastLogin: authUser.user.last_sign_in_at,
      createdAt: authUser.user.created_at,
      name: authUser.user.user_metadata?.name as string | undefined,
      avatarUrl: authUser.user.user_metadata?.avatar_url as string | undefined,
    };
  } catch (error) {
    console.error(`Error fetching user by ID (${id}):`, error);
    return null;
  }
}

/**
 * Create a new user
 */
export async function createUser(email: string, password: string, roleType: string, userData: {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}): Promise<{ user: User | null; error: string | null }> {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: userData.firstName && userData.lastName 
          ? `${userData.firstName} ${userData.lastName}`
          : undefined
      }
    });
    
    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');
    
    // Add role to user
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: roleType
      });
    
    if (roleError) throw roleError;
    
    // If user should be inactive, ban them
    if (userData.isActive === false) {
      await supabase.auth.admin.updateUserById(authData.user.id, {
        ban_duration: '876000h', // 100 years
      });
    }
    
    // Return created user
    return {
      user: await getUserById(authData.user.id),
      error: null
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      user: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Update user
 */
export async function updateUser(id: string, updates: {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}): Promise<{ success: boolean; error: string | null }> {
  try {
    const updateData: any = {};
    
    // Update user metadata if name changed
    if (updates.firstName || updates.lastName) {
      const { data: currentUser } = await supabase.auth.admin.getUserById(id);
      const currentName = currentUser?.user.user_metadata?.name || '';
      const firstName = updates.firstName || currentName.split(' ')[0] || '';
      const lastName = updates.lastName || currentName.split(' ').slice(1).join(' ') || '';
      
      updateData.user_metadata = {
        ...currentUser?.user.user_metadata,
        name: `${firstName} ${lastName}`.trim()
      };
    }
    
    // Update email if changed
    if (updates.email) {
      updateData.email = updates.email;
    }
    
    // Update active status
    if (updates.isActive !== undefined) {
      if (!updates.isActive) {
        // Ban user (make inactive)
        updateData.ban_duration = '876000h'; // 100 years
      } else {
        // Remove ban (make active)
        updateData.ban_duration = null;
      }
    }
    
    // Apply auth user updates if any
    if (Object.keys(updateData).length > 0) {
      const { error: authError } = await supabase.auth.admin.updateUserById(id, updateData);
      if (authError) throw authError;
    }
    
    // Update role if changed
    if (updates.role) {
      // Delete existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', id);
      
      // Insert new role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: id,
          role: updates.role
        });
      
      if (roleError) throw roleError;
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error updating user (${id}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.auth.admin.deleteUser(id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting user (${id}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Reset user password
 */
export async function resetUserPassword(email: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/auth/reset-password'
    });
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error resetting password for user (${email}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Log user activity
 */
export async function logUserActivity(
  userId: string,
  action: string,
  details: string,
  metadata?: Record<string, any>
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('user_activity_logs')
      .insert({
        user_id: userId,
        action,
        details,
        ip_address: metadata?.ipAddress,
        user_agent: metadata?.userAgent,
        metadata
      });
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error logging user activity:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Get user activity logs
 */
export async function getUserActivityLogs(
  userId?: string,
  limit = 50,
  offset = 0
): Promise<{ logs: UserActivity[]; count: number }> {
  try {
    let query = supabase
      .from('user_activity_logs')
      .select('*', { count: 'exact' })
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, count, error } = await query;
    
    if (error) throw error;
    
    return {
      logs: (data || []) as unknown as UserActivity[],
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching user activity logs:', error);
    return { logs: [], count: 0 };
  }
}

/**
 * Get available roles
 */
export async function getRoles(): Promise<Role[]> {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data as Role[];
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
}

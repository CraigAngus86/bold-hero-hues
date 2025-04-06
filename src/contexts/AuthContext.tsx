
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define UserRole type
export type UserRole = 'admin' | 'editor' | 'user';

// User profile types
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  roles?: UserRole[];
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
}

// Initialize with default values
const defaultAuthContext: AuthContextType = {
  user: null,
  profile: null,
  isLoading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  hasRole: () => false,
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Handle session changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      handleAuthChange(session);
    });

    // Initial session check
    const initialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleAuthChange(session);
    };
    
    initialSession();

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Handle auth change and fetch related data
  const handleAuthChange = async (session: Session | null) => {
    setIsLoading(true);
    
    if (!session || !session.user) {
      setUser(null);
      setProfile(null);
      setUserRoles([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setUser(session.user);
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else if (profileData) {
        setProfile({
          id: profileData.id,
          email: profileData.email,
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at
        });
      }
      
      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);
        
      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
      } else if (rolesData) {
        const roles = rolesData.map(role => role.role as UserRole);
        setUserRoles(roles);
        
        // Update profile with roles
        if (profile) {
          setProfile({
            ...profile,
            roles
          });
        }
      }
    } catch (error) {
      console.error('Session handling error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        return { error };
      }
      toast.success('Signed in successfully');
      return {};
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      toast.success('Sign up successful! Check your email for verification.');
      return {};
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to sign up');
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has specific role
  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };

  // Provide auth context
  const value = {
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

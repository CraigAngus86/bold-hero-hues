
import React, { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { useSimulatedAuth, SimulatedUser, SimulatedProfile } from '@/hooks/useSimulatedAuth';

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
  user: User | SimulatedUser | null;
  profile: UserProfile | SimulatedProfile | null;
  isLoading: boolean;
  signIn: (email?: string, password?: string) => Promise<{ error?: any }>;
  signUp: (email?: string, password?: string, metadata?: any) => Promise<{ error?: any }>;
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
  // Using our simulated auth for testing purposes
  const auth = useSimulatedAuth();
  
  return (
    <AuthContext.Provider value={auth as AuthContextType}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

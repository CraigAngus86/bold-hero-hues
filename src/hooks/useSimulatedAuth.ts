
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';

export interface SimulatedUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
  };
}

export interface SimulatedProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  roles: string[];
}

export const useSimulatedAuth = () => {
  const [user, setUser] = useState<User | SimulatedUser | null>(null);
  const [profile, setProfile] = useState<SimulatedProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate authentication on component mount
  useEffect(() => {
    // Create simulated user and profile for testing
    const simulatedUser: SimulatedUser = {
      id: 'test-user-id',
      email: 'admin@test.com',
      user_metadata: {
        full_name: 'Test Admin',
      }
    };

    const simulatedProfile: SimulatedProfile = {
      id: 'test-user-id',
      email: 'admin@test.com',
      full_name: 'Test Admin',
      avatar_url: null,
      roles: ['admin', 'editor']
    };

    // Set simulated user and profile
    setUser(simulatedUser);
    setProfile(simulatedProfile);
    setIsLoading(false);
  }, []);

  // Simulate sign in (always succeeds in test mode)
  const signIn = async () => {
    return { error: null };
  };

  // Simulate sign up (always succeeds in test mode)
  const signUp = async () => {
    return { error: null };
  };

  // Simulate sign out
  const signOut = async () => {
    // In a real app, this would clear the session
    console.log('Simulated sign out');
  };

  // Check if user has a specific role
  const hasRole = (role: string) => {
    return profile?.roles?.includes(role) || false;
  };

  return {
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    hasRole
  };
};

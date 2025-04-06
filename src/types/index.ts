
import { User } from '@supabase/supabase-js';

// System log types
export type LogType = 'error' | 'warning' | 'info' | 'debug';

export interface SystemLog {
  id: string | number;
  timestamp: string;
  type: LogType;
  source: string;
  message: string;
}

// User profile types
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// User role types
export type UserRole = 'admin' | 'editor' | 'user';

// Auth context types
export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
}

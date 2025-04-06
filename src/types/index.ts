
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

// News types
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  slug: string;
  category: string;
  author?: string;
  image_url?: string;
  publish_date: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNewsArticleData {
  title: string;
  content: string;
  slug: string;
  category: string;
  author?: string;
  image_url?: string;
  is_featured?: boolean;
}

export interface UpdateNewsArticleData {
  title?: string;
  content?: string;
  slug?: string;
  category?: string;
  author?: string;
  image_url?: string;
  is_featured?: boolean;
}

export interface NewsQueryOptions {
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  page?: number;
}

// Fixture types
export interface Fixture {
  id: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  venue?: string;
  isCompleted: boolean;
  homeScore?: number;
  awayScore?: number;
  source?: string;
  ticketLink?: string;
}

// Team types
export interface TeamStats {
  wins: number;
  losses: number;
  draws: number;
  goalsScored: number;
  goalsConceded: number;
}


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
  roles?: string[];
}

// User role types
export type UserRole = 'admin' | 'editor' | 'user';

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
  publish_date?: string;
}

export interface UpdateNewsArticleData {
  title?: string;
  content?: string;
  slug?: string;
  category?: string;
  author?: string;
  image_url?: string;
  is_featured?: boolean;
  publish_date?: string;
}

export interface NewsQueryOptions {
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: string;
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
  id: string;
  team: string;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  wins: number;
  losses: number;
  draws: number;
  goalsScored: number;
  goalsConceded: number;
}

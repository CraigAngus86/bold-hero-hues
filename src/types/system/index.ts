
// Re-export types from the system directory
export * from './status';

// Define BucketType enum here to resolve import issues
export enum BucketType {
  IMAGES = 'images',
  VIDEOS = 'videos',
  DOCUMENTS = 'documents',
  AVATARS = 'avatars',
  POSTS = 'posts',
  PRODUCTS = 'products',
  GENERAL = 'general',
  MEDIA = 'media',
  SPONSORS = 'sponsors',
  PLAYERS = 'players',
  PUBLIC = 'public',
  TEAMS = 'teams'
}

// SystemLog type definition
export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'debug';
  message: string;
  source: string;
  level?: string; // Added to match expected type
}

export interface SystemLogResponse {
  success: boolean;
  data?: SystemLog[];
  error?: string;
}

export interface ClearSystemLogsResponse {
  success: boolean;
  message?: string;
  error?: string;
}

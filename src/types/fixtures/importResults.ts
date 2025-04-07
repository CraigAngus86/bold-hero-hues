
import { Fixture } from '@/types/fixtures';

export interface ImportResult {
  success: boolean;
  added: number;
  updated: number;
  message: string;
  validFixtures?: Fixture[];
}

export interface ScraperLog {
  id?: string;
  source: string;
  items_found?: number;
  items_added?: number;
  items_updated?: number;
  status: 'success' | 'error' | 'warning';
  error_message?: string;
  created_at?: string;
}

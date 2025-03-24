
import { ScrapedFixture, DBFixture } from '@/types/fixtures';

export interface ImportResult {
  success: boolean;
  message: string;
  added: number;
  updated: number;
}

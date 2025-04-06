
import { Fixture, ScrapedFixture } from '@/types/fixtures';

export interface ImportResult {
  success: boolean;
  message: string;
  added: number;
  updated: number;
  valid?: boolean;
  validFixtures?: ScrapedFixture[];
}

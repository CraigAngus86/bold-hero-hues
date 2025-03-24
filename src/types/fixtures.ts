
/**
 * Represents a fixture scraped from external sources
 */
export interface ScrapedFixture {
  id?: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  competition: string;
  venue: string;
  isCompleted?: boolean;
  homeScore?: number | null;
  awayScore?: number | null;
}

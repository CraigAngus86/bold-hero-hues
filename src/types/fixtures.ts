
// Moving fixture types to a dedicated type file
import { Match } from "@/components/fixtures/types";

// Adding Fixture export to fix the import error
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
  ticketLink?: string; // Adding ticket link field
}

export interface ScrapedFixture {
  id?: string; // Make id optional as it might be generated later
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
  ticketLink?: string; // Adding ticket link field
}

export interface DBFixture {
  id: string;
  date: string;
  time: string;
  home_team: string;
  away_team: string;
  competition: string;
  venue?: string;
  is_completed: boolean;
  home_score?: number;
  away_score?: number;
  source?: string;
  created_at?: string;
  updated_at?: string;
  ticket_link?: string; // Adding ticket link field
}

// This function converts database fixtures to the Match type used in the UI components
export function convertToMatches(fixtures: DBFixture[]): Match[] {
  return fixtures.map(fixture => ({
    id: fixture.id,
    date: fixture.date,
    time: fixture.time,
    homeTeam: fixture.home_team,
    awayTeam: fixture.away_team,
    competition: fixture.competition,
    venue: fixture.venue || 'TBD',
    isCompleted: fixture.is_completed,
    homeScore: fixture.home_score,
    awayScore: fixture.away_score,
    ticketLink: fixture.ticket_link // Include ticket link in the converted data
  }));
}

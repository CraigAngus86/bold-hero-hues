
import { format } from 'date-fns';

// Define key types for fixtures components
export interface Match {
  id: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  venue: string;
  isCompleted: boolean;
  homeScore?: number;
  awayScore?: number;
  season?: string;
  ticketLink?: string;
  source?: string;
  match_report?: string;
  attendance?: number;
  referee?: string;
  media?: MatchMedia[];
  hasMatchPhotos?: boolean;
}

export interface MatchMedia {
  id: string;
  matchId: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
  isFeatured?: boolean;
  dateAdded: string;
  addedBy?: string;
  credit?: string;
  tags?: string[];
}

// Options for filtering fixtures
export interface FixturesDisplayOptions {
  competition?: string;
  season?: string;
  limit?: number;
  showCompleted?: boolean;
}

// Group fixtures by month
export interface MatchGroup {
  month: string;
  matches: Match[];
}

// Function to group matches by month for display
export function groupMatchesByMonth(matches: Match[]): MatchGroup[] {
  const groups: Record<string, Match[]> = {};
  
  matches.forEach(match => {
    const date = new Date(match.date);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const monthName = format(date, 'MMMM yyyy');
    
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    
    groups[monthKey].push(match);
  });
  
  return Object.keys(groups).map(key => ({
    month: groups[key][0] ? format(new Date(groups[key][0].date), 'MMMM yyyy') : key,
    matches: groups[key]
  })).sort((a, b) => {
    const dateA = new Date(a.matches[0]?.date || a.month);
    const dateB = new Date(b.matches[0]?.date || b.month);
    return dateA.getTime() - dateB.getTime();
  });
}

// Get list of available months from matches
export function getAvailableMonths(matches: Match[]): string[] {
  const months = new Set<string>();
  
  matches.forEach(match => {
    const date = new Date(match.date);
    const monthName = format(date, 'MMMM yyyy');
    months.add(monthName);
  });
  
  return Array.from(months);
}

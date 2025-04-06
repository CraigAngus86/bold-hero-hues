
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

export interface MatchFilters {
  competition?: string;
  team?: string;
  venue?: string;
  season?: string;
  startDate?: string;
  endDate?: string;
}

export interface MatchSummary {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  competition: string;
}

export type MatchSortField = 'date' | 'competition' | 'homeTeam' | 'awayTeam';
export type SortDirection = 'asc' | 'desc';

export interface MatchGroup {
  month: string;
  matches: Match[];
}

// Helper function to format date string
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Helper function to group matches by month
export function groupMatchesByMonth(matches: Match[]): MatchGroup[] {
  const groups: Record<string, Match[]> = {};
  
  matches.forEach(match => {
    const date = new Date(match.date);
    const monthYear = date.toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric'
    });
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    
    groups[monthYear].push(match);
  });
  
  // Convert the object to an array of groups
  return Object.entries(groups).map(([month, matches]) => ({
    month,
    matches
  }));
}

// Helper function to get available months from matches
export function getAvailableMonths(matches: Match[]): string[] {
  const months = new Set<string>();
  
  matches.forEach(match => {
    const date = new Date(match.date);
    const monthYear = date.toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric'
    });
    months.add(monthYear);
  });
  
  return Array.from(months);
}

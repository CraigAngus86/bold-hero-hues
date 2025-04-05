
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
}

export interface MatchGroup {
  month: string;
  matches: Match[];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { 
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

export function groupMatchesByMonth(matches: Match[]): MatchGroup[] {
  const groupedMatches: { [month: string]: Match[] } = {};
  
  matches.forEach(match => {
    const date = new Date(match.date);
    const month = date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long' });
    
    if (!groupedMatches[month]) {
      groupedMatches[month] = [];
    }
    
    groupedMatches[month].push(match);
  });
  
  return Object.entries(groupedMatches).map(([month, matches]) => ({
    month,
    matches
  }));
}

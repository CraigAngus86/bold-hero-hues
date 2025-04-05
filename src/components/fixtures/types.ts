
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
  hasMatchPhotos?: boolean;
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

export function getAvailableMonths(matches: Match[]): string[] {
  const months = new Set<string>();
  
  matches.forEach(match => {
    const date = new Date(match.date);
    const monthYear = date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long' });
    months.add(monthYear);
  });
  
  return Array.from(months).sort((a, b) => {
    // Convert to Date objects for comparison
    const dateA = new Date(a.split(' ')[0] + ' 1, ' + a.split(' ')[1]);
    const dateB = new Date(b.split(' ')[0] + ' 1, ' + b.split(' ')[1]);
    return dateA.getTime() - dateB.getTime();
  });
}

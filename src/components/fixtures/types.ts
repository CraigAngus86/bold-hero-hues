export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  competition: string;
  isCompleted: boolean;
  venue: string;
}

export interface TeamStats {
  id?: number;
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[];
  logo: string;
}

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

export const groupMatchesByMonth = (matches: Match[]) => {
  const grouped = matches.reduce<Record<string, Match[]>>((acc, match) => {
    const date = new Date(match.date);
    const monthYear = date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    
    acc[monthYear].push(match);
    return acc;
  }, {});
  
  // Sort matches within each month
  Object.keys(grouped).forEach(month => {
    grouped[month].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });
  
  return grouped;
};

// Get unique months from the match data
export const getAvailableMonths = (matches: Match[]) => {
  const months = matches.map(match => {
    const date = new Date(match.date);
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  });
  return ["All Months", ...Array.from(new Set(months))];
};


// Types for fixtures data
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
  ticketLink?: string;
}

// Format date in a consistent way: "Sat, 15 Apr 2023"
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  };
  
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

// Format time in consistent way: "15:00"
export const formatTime = (timeString: string): string => {
  // If time is already in format "15:00", return as is
  if (/^\d{1,2}:\d{2}$/.test(timeString)) {
    return timeString;
  }
  
  // Try to parse and format other time formats
  try {
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  } catch (e) {
    return timeString; // Return original if parsing fails
  }
};

// Interface for grouped matches by month
export interface MatchGroup {
  month: string;
  matches: Match[];
}

// Group matches by month
export const groupMatchesByMonth = (matches: Match[]): MatchGroup[] => {
  const grouped: Record<string, Match[]> = {};
  
  // Sort matches by date
  const sortedMatches = [...matches].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Group matches by month
  sortedMatches.forEach(match => {
    const date = new Date(match.date);
    const monthYear = date.toLocaleDateString('en-GB', { 
      month: 'long', 
      year: 'numeric' 
    });
    
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    
    grouped[monthYear].push(match);
  });
  
  // Convert the grouped object to an array
  return Object.entries(grouped).map(([month, matches]) => ({
    month,
    matches
  }));
};

// Get available months from matches
export const getAvailableMonths = (matches: Match[]): string[] => {
  const months = new Set<string>();
  
  matches.forEach(match => {
    const date = new Date(match.date);
    const monthYear = date.toLocaleDateString('en-GB', { 
      month: 'long', 
      year: 'numeric' 
    });
    months.add(monthYear);
  });
  
  // Convert to array and sort chronologically
  return Array.from(months).sort((a, b) => {
    const dateA = new Date(a.replace(/(January|February|March|April|May|June|July|August|September|October|November|December)\s/, '$1 1, '));
    const dateB = new Date(b.replace(/(January|February|March|April|May|June|July|August|September|October|November|December)\s/, '$1 1, '));
    return dateA.getTime() - dateB.getTime();
  });
};

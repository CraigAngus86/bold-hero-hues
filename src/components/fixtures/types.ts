
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

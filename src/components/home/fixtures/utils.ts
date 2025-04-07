
// Helper functions for fixtures

// Format the match date in a nice format (e.g. "Sat, 15 May")
export const formatMatchDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString('en-GB', { weekday: 'short' })}, ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
};

// Check if a team is Banks o' Dee (used for styling)
export const isBanksODee = (teamName: string) => {
  return teamName.toLowerCase().includes('banks o\' dee');
};

// Format time (e.g. "15:00" to "3:00 PM")
export const formatMatchTime = (timeString: string) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

// Calculate days remaining until match
export const getDaysUntilMatch = (dateString: string) => {
  const matchDate = new Date(dateString);
  const today = new Date();
  
  // Reset time part for accurate day calculation
  matchDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = matchDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Get result text (Win, Loss, Draw) from a Banks o' Dee perspective
export const getMatchResult = (homeTeam: string, awayTeam: string, homeScore?: number | null, awayScore?: number | null) => {
  if (homeScore === undefined || awayScore === undefined) return null;
  
  const isBODHome = isBanksODee(homeTeam);
  
  if (homeScore === awayScore) return 'Draw';
  
  if (isBODHome) {
    return homeScore > awayScore ? 'Win' : 'Loss';
  } else {
    return awayScore > homeScore ? 'Win' : 'Loss';
  }
};

// Get result color class for styling
export const getResultColorClass = (result: string | null) => {
  if (!result) return '';
  
  switch (result) {
    case 'Win':
      return 'text-green-600 bg-green-50';
    case 'Loss':
      return 'text-red-600 bg-red-50';
    case 'Draw':
      return 'text-amber-600 bg-amber-50';
    default:
      return '';
  }
};

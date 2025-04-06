
// Format date for display (e.g., "Sat, 11 Jun")
export const formatMatchDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
};

// Check if the provided team is Banks o' Dee
export const isBanksODee = (team: string): boolean => {
  return team.toLowerCase().includes('banks') && team.toLowerCase().includes('dee');
};

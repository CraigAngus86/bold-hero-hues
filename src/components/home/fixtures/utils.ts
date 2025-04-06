
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

// Format date for display with year (e.g., "11 Jun 2025")
export const formatDateWithYear = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount);
};

// Format date range (e.g., "Jun 2023 - Present")
export const formatDateRange = (startDate: string, endDate?: string): string => {
  const start = new Date(startDate);
  const startFormatted = start.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric'
  });
  
  if (!endDate) {
    return `${startFormatted} - Present`;
  }
  
  const end = new Date(endDate);
  const endFormatted = end.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric'
  });
  
  return `${startFormatted} - ${endFormatted}`;
};

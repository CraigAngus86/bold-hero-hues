// Helper function to format date for display
export const formatDate = (dateString: string): string => {
  // Check if the date is already in a display format (e.g., "April 18, 2023")
  if (/[A-Za-z]/.test(dateString)) {
    return dateString;
  }
  
  // Otherwise, assume it's a date string that needs formatting
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to get formatted date for database
export const getDbDateFormat = (displayDate: string): string => {
  // If it's already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(displayDate)) {
    return displayDate;
  }
  
  // Try to parse the display date
  const date = new Date(displayDate);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

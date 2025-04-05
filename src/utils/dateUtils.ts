
/**
 * Format a date string into a human-readable format
 * @param dateString Date string in YYYY-MM-DD format
 * @returns Formatted date string (e.g., "Mon, 1 Jan")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { 
    weekday: 'short',
    day: 'numeric', 
    month: 'short' 
  });
};

/**
 * Get month name from a date string
 * @param dateString Date string in YYYY-MM-DD format
 * @returns Month name with year (e.g., "January 2023")
 */
export const getMonthName = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { 
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Group an array of objects by month based on a date property
 * @param items Array of objects with a date property
 * @param dateProperty Name of the date property
 * @returns Object with month names as keys and arrays of items as values
 */
export const groupByMonth = <T extends { [key: string]: any }>(
  items: T[],
  dateProperty: keyof T
): { [month: string]: T[] } => {
  const grouped: { [month: string]: T[] } = {};
  
  items.forEach(item => {
    const dateString = item[dateProperty] as string;
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-GB', { 
      year: 'numeric',
      month: 'long'
    });
    
    if (!grouped[month]) {
      grouped[month] = [];
    }
    
    grouped[month].push(item);
  });
  
  return grouped;
};

/**
 * Check if a date is in the past
 * @param dateString Date string in YYYY-MM-DD format
 * @returns True if the date is in the past
 */
export const isPastDate = (dateString: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  
  return date < today;
};

/**
 * Get an array of month names from an array of dates
 * @param dates Array of date strings in YYYY-MM-DD format
 * @returns Array of month names with year (e.g., ["January 2023", "February 2023"])
 */
export const getMonthsFromDates = (dates: string[]): string[] => {
  const months = new Set<string>();
  
  dates.forEach(dateString => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-GB', { 
      year: 'numeric',
      month: 'long'
    });
    
    months.add(month);
  });
  
  return Array.from(months).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });
};


/**
 * Format a date string or Date object to a localized string format
 * @param date The date to format (ISO string or Date object)
 * @param options Optional Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date | undefined,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  return dateObj.toLocaleDateString(undefined, options);
};

/**
 * Format a date string to ISO format (YYYY-MM-DD)
 * @param date The date to format
 * @returns Formatted ISO date string
 */
export const formatDateISO = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return dateObj.toISOString().split('T')[0];
};

/**
 * Format a datetime string to a readable format
 * @param datetime The datetime to format
 * @returns Formatted datetime string
 */
export const formatDateTime = (
  datetime: string | Date | undefined
): string => {
  if (!datetime) return 'N/A';
  
  const dateObj = typeof datetime === 'string' ? new Date(datetime) : datetime;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  return dateObj.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get a relative time string (e.g., "2 hours ago", "yesterday")
 * @param date The date to format
 * @returns Relative time string
 */
export const getRelativeTimeString = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return 'yesterday';
  
  return formatDate(dateObj);
};

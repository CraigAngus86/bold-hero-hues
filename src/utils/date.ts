
/**
 * Format a date or timestamp as a relative time ago string
 * @param date Date to format
 * @returns String like "5 minutes ago" or "2 hours ago"
 */
export function formatTimeAgo(date: Date | string): string {
  if (!date) return 'unknown';
  
  const now = new Date();
  const pastDate = typeof date === 'string' ? new Date(date) : date;
  
  // If date is in the future or invalid
  if (isNaN(pastDate.getTime()) || pastDate > now) {
    return 'just now';
  }
  
  const seconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);
  
  // Less than a minute
  if (seconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  
  // Less than a day
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  // Less than a week
  if (seconds < 604800) {
    const days = Math.floor(seconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  // Format as regular date for older dates
  return pastDate.toLocaleDateString();
}

/**
 * Format a date as YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parse a date string into a Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Format a date in a human-readable format
 * @param date Date to format
 * @param includeTime Whether to include time component
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, includeTime: boolean = false): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return dateObj.toLocaleDateString(undefined, options);
}

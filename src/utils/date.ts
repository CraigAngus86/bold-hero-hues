
/**
 * Formats a date or timestamp into a human-readable time ago string
 * @param date The date to format (Date object or timestamp string)
 * @returns A human-readable string (e.g., "5 minutes ago", "2 hours ago", etc.)
 */
export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Time difference in milliseconds
  const diff = now.getTime() - dateObj.getTime();
  
  // Convert to various time units
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) {
    return years === 1 ? '1 year ago' : `${years} years ago`;
  } else if (months > 0) {
    return months === 1 ? '1 month ago' : `${months} months ago`;
  } else if (days > 0) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  } else {
    return seconds <= 10 ? 'just now' : `${seconds} seconds ago`;
  }
}

/**
 * Format a date as a localized date string (e.g., "Mar 15, 2023")
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date as a localized time string (e.g., "14:30")
 * @param date The date to format
 * @returns Formatted time string
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a date as both date and time (e.g., "Mar 15, 2023 at 14:30")
 * @param date The date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(dateObj)} at ${formatTime(dateObj)}`;
}

/**
 * Format a duration in seconds to a human-readable string
 * @param seconds Duration in seconds
 * @returns Formatted duration string (e.g., "2h 30m")
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours < 24) {
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}m` 
      : `${hours}h`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 
    ? `${days}d ${remainingHours}h` 
    : `${days}d`;
}

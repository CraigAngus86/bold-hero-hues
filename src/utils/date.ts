
import { format, parseISO } from 'date-fns';

/**
 * Formats a date string into a readable format
 * @param dateString ISO date string
 * @param formatString Optional format string (defaults to 'PPP')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, formatString: string = 'PPP') => {
  try {
    const date = parseISO(dateString);
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Formats a date to show how long ago it was
 * @param dateString ISO date string
 * @returns Time ago string (e.g. "3 days ago")
 */
export const timeAgo = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval === 1 ? '1 year ago' : `${interval} years ago`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval === 1 ? '1 month ago' : `${interval} months ago`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? '1 day ago' : `${interval} days ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
    }
    
    return seconds <= 5 ? 'just now' : `${Math.floor(seconds)} seconds ago`;
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return 'recently';
  }
};

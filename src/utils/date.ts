
import { format, formatDistance, formatRelative, formatDistanceToNow } from 'date-fns';

/**
 * Format a date to a string representation
 */
export const formatDate = (date: Date | string | number, formatString: string = 'PPP'): string => {
  if (!date) return '';
  
  try {
    const dateObject = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;
    
    return format(dateObject, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};

/**
 * Format a date to a relative time string (e.g., "2 days ago")
 */
export const formatTimeAgo = (date: Date | string | number): string => {
  if (!date) return '';
  
  try {
    const dateObject = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;
    
    return formatDistanceToNow(dateObject, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting time ago:', error);
    return String(date);
  }
};

/**
 * Format a date to an ISO string (YYYY-MM-DD)
 */
export const formatDateISO = (date: Date | string | number): string => {
  if (!date) return '';
  
  try {
    const dateObject = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;
    
    return dateObject.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting ISO date:', error);
    return String(date);
  }
};

/**
 * Format date as a localized string
 */
export const formatLocalizedDate = (
  date: Date | string | number, 
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
): string => {
  if (!date) return '';
  
  try {
    const dateObject = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;
    
    return dateObject.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting localized date:', error);
    return String(date);
  }
};

/**
 * Parse a string date into a Date object
 */
export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  try {
    return new Date(dateString);
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

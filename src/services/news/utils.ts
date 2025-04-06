
import { format, parseISO } from 'date-fns';

/**
 * Format a date string to a human-readable format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    return format(date, 'MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a date to database format (YYYY-MM-DD)
 */
export const getDbDateFormat = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Format a date to ISO string with local timezone
 */
export const getISODateString = (date: Date): string => {
  return date.toISOString();
};

/**
 * Create an excerpt from HTML content
 * @param html HTML content
 * @param length Maximum length of the excerpt
 */
export const createExcerpt = (html: string, length = 150): string => {
  // Remove HTML tags
  const text = html.replace(/<\/?[^>]+(>|$)/g, '');
  
  // Truncate text to desired length
  if (text.length <= length) return text;
  
  // Find the last space before the cutoff
  const cutoff = text.lastIndexOf(' ', length);
  
  // Return the truncated text with ellipsis
  return `${text.substring(0, cutoff >= 0 ? cutoff : length)}...`;
};

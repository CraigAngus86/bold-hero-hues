
import { format, parseISO } from 'date-fns';

/**
 * Format a date string using date-fns
 * 
 * @param dateString - The date string to format (ISO format)
 * @param formatStr - The format string to use (date-fns format)
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, formatStr: string = 'PPP') => {
  if (!dateString) return '';
  
  try {
    return format(parseISO(dateString), formatStr);
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return dateString;
  }
};

/**
 * Get a relative date description (today, yesterday, tomorrow, or formatted date)
 * 
 * @param dateString - The date string to format (ISO format)
 * @returns Formatted relative date string
 */
export const getRelativeDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Strip time information for comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    
    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return 'Yesterday';
    } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
      return 'Tomorrow';
    }
    
    return format(date, 'EEE, MMM d');
  } catch (error) {
    console.error(`Error formatting relative date: ${dateString}`, error);
    return dateString;
  }
};

/**
 * Convert a date string to ISO format (YYYY-MM-DD)
 * 
 * @param dateString - The date string to convert
 * @returns ISO formatted date string
 */
export const toISODateString = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error(`Error converting to ISO date: ${dateString}`, error);
    return dateString;
  }
};

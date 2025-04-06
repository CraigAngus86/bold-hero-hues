
import { format, formatDistanceToNow, isToday, parseISO } from 'date-fns';

/**
 * Format a date string into a user-friendly format
 * @param dateString - ISO date string
 * @param formatString - Optional date-fns format string
 * @returns Formatted date string
 */
export function formatDate(dateString: string, formatString: string = 'dd MMM yyyy'): string {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original if parsing fails
  }
}

/**
 * Format a date to display in a relative format (e.g., "3 days ago")
 * @param dateString - ISO date string
 * @returns Relative time description
 */
export function formatTimeAgo(dateString: string): string {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown time';
  }
}

/**
 * Format a time string from 24h to 12h format
 * @param timeString - Time string in 24h format (HH:MM)
 * @returns Time string in 12h format with AM/PM
 */
export function formatTime(timeString: string): string {
  try {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${String(minutes).padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString; // Return original if parsing fails
  }
}

/**
 * Check if a date is today
 * @param dateString - ISO date string
 * @returns Boolean indicating if date is today
 */
export function isDateToday(dateString: string): boolean {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return isToday(date);
  } catch (error) {
    console.error('Error checking if date is today:', error);
    return false;
  }
}

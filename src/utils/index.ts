
// Utility functions
export { cn, createSlug, getOrdinalSuffix } from '@/lib/utils';

// Export necessary functions from ErrorHandling
export { handleApiError, showErrorToUser, createAppError, safeAsync } from './errorHandling';

/**
 * Formats a date string into a more readable format
 * @param dateString - The date string to format
 * @param options - Formatting options
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
): string => {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-GB', options);
  } catch (e) {
    console.error('Error formatting date:', e);
    return String(dateString);
  }
};

// Export functions from other utility files as needed

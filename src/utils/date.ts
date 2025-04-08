
/**
 * Format a date string into a readable format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return dateString;
  }
}

/**
 * Format a date string into a time string
 */
export function formatTime(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error(`Error formatting time: ${dateString}`, error);
    return '';
  }
}

/**
 * Check if a date is in the past
 */
export function isDatePassed(dateString: string): boolean {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    return date < today;
  } catch (error) {
    console.error(`Error checking if date is passed: ${dateString}`, error);
    return false;
  }
}

/**
 * Format a date range (e.g., "15-18 May 2025")
 */
export function formatDateRange(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return '';
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Same month and year
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()}-${end.getDate()} ${start.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`;
    }
    
    // Same year, different month
    if (start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()} ${start.toLocaleDateString('en-GB', { month: 'long' })} - ${end.getDate()} ${end.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`;
    }
    
    // Different years
    return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} - ${end.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  } catch (error) {
    console.error(`Error formatting date range: ${startDate} - ${endDate}`, error);
    return '';
  }
}

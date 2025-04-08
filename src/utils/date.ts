
/**
 * Format a date string to a more readable format
 * @param dateString - The date string to format
 * @returns Formatted date string in the format "DD Month YYYY"
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original string if there's an error
  }
};

/**
 * Format time to 12-hour format with AM/PM
 * @param timeString - Time in 24-hour format (HH:MM)
 * @returns Formatted time in 12-hour format with AM/PM
 */
export const formatTime = (timeString: string): string => {
  if (!timeString) return '';
  
  try {
    // If timeString is already in the right format, just return it
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    
    // Handle "HH:MM" format
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString; // Return original string if there's an error
  }
};

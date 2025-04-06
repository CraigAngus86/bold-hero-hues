
/**
 * Format date for display
 * @param dateString ISO date string
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

/**
 * Format date for DB storage
 * @param dateString Date string in any format
 */
export const getDbDateFormat = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  } catch (e) {
    return dateString;
  }
};

/**
 * Get ISO date string
 * @param date Optional date object, defaults to current date
 */
export const getISODateString = (date = new Date()): string => {
  return date.toISOString();
};

/**
 * Create a short excerpt from content
 * @param content HTML content string
 * @param maxLength Maximum length of excerpt
 */
export const createExcerpt = (content: string, maxLength = 150): string => {
  if (!content) return '';
  
  // Strip HTML tags
  const strippedContent = content.replace(/<[^>]*>/g, ' ');
  
  // Trim and limit length
  if (strippedContent.length <= maxLength) {
    return strippedContent.trim();
  }
  
  return strippedContent.substring(0, maxLength).trim() + '...';
};

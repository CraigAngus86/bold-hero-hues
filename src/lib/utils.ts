
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

/**
 * A utility function that combines multiple class names using clsx and tailwind-merge
 */ 
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Add the createSlug function to utils
export const createSlug = (text) => {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

// Format date utility function
export const formatDate = (dateString: string, formatStr: string = 'PPP') => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), formatStr);
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return dateString;
  }
};

// Export the slugify function from stringUtils as an alias for backward compatibility
export { slugify } from './stringUtils';

// Add getOrdinalSuffix utility for dashboard components
export function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}


/**
 * Helper utilities to make Supabase queries more robust and handle type issues
 */

/**
 * Ensures a response has a count property, adding one if missing
 */
export const ensureResponseWithCount = (response: any): { data: any[]; error: any; count: number } => {
  if (!response) {
    return { data: [], error: null, count: 0 };
  }
  
  return {
    ...response,
    count: response.count || (response.data ? response.data.length : 0)
  };
};

/**
 * Safely unwraps a promise to handle both promise and non-promise returns from Supabase
 */
export const unwrapPromise = async <T>(promise: Promise<T> | T): Promise<T> => {
  try {
    return await Promise.resolve(promise);
  } catch (error) {
    console.error('Error unwrapping promise:', error);
    throw error;
  }
};

/**
 * Adds count property to a response if missing
 */
export const addCountProperty = <T extends { data: any[]; error: any }>(response: T): T & { count: number } => {
  return {
    ...response,
    count: response.data ? response.data.length : 0
  };
};

/**
 * Converts unknown arrays to string arrays safely
 */
export const safeStringArray = (arr: unknown[]): string[] => {
  if (!arr) return [];
  return arr.map(item => String(item));
};

/**
 * Ensures a value is a string
 */
export const ensureString = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

/**
 * Converts array of unknown to array of strings
 */
export const convertToStringArray = (arr: unknown[]): string[] => {
  if (!arr) return [];
  return arr.map(item => ensureString(item));
};


/**
 * Helper functions to work with Supabase responses
 */

// Helper to get around the TypeScript issue with Supabase client chain methods
// This fixes the "Type of 'await' operand must either be a valid promise or must not contain a callable 'then' member" error
export const unwrapPromise = async <T>(promise: Promise<{ data: T; error: any }> | any): Promise<{ data: T; error: any; count?: number }> => {
  try {
    // Handle both Promise objects and Supabase chainable query builders
    if (promise && typeof promise === 'object') {
      // For chainable objects with a then method (Supabase queries)
      if (typeof promise.then === 'function') {
        const result = await Promise.resolve(promise);
        return {
          ...result,
          count: result.count !== undefined ? result.count : (Array.isArray(result.data) ? result.data.length : 0)
        };
      }
      
      // If it's already a data object, just return it
      if ('data' in promise) {
        return {
          ...promise,
          count: promise.count !== undefined ? promise.count : (Array.isArray(promise.data) ? promise.data.length : 0)
        };
      }
    }
    
    // For standard promises
    if (promise instanceof Promise) {
      const result = await promise;
      return {
        ...result,
        count: result.count !== undefined ? result.count : (Array.isArray(result.data) ? result.data.length : 0)
      };
    }
    
    // Fallback case
    return { 
      data: null as T, 
      error,
      count: 0 
    };
  } catch (error) {
    return { 
      data: null as T, 
      error,
      count: 0 
    };
  }
};

// Cast unknown type to string safely
export const safeString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

// Cast unknown[] to string[] safely
export const safeStringArray = (values: unknown[] | null): string[] => {
  if (!values) return [];
  return values.map(safeString);
};

// Add a polyfill for the missing count property
export const addCountProperty = <T>(response: { data: T[]; error: any }): { data: T[]; error: any; count: number } => {
  return {
    ...response,
    count: Array.isArray(response.data) ? response.data.length : 0
  };
};

// Helper for safely processing unknown response to string[]
export function processResponseToStringArray(response: { data: unknown; error: any }): string[] {
  if (!response.data) return [];
  
  try {
    const dataArray = Array.isArray(response.data) ? response.data : [];
    return dataArray.map(item => typeof item === 'string' ? item : String(item));
  } catch (error) {
    console.error('Error processing response to string array:', error);
    return [];
  }
}

// Helper to standardize Supabase client method calls and ensure proper types
export async function executeSupabaseQuery<T>(queryPromise: any): Promise<{ data: T[]; error: any; count: number }> {
  try {
    // Use the unwrapPromise helper to handle both Promise and chainable objects
    const result = await unwrapPromise<T[]>(queryPromise);
    
    // Always ensure count property exists
    return {
      data: Array.isArray(result.data) ? result.data : [],
      error: result.error,
      count: result.count !== undefined ? result.count : (Array.isArray(result.data) ? result.data.length : 0)
    };
  } catch (error) {
    console.error('Supabase query execution error:', error);
    return { data: [], error, count: 0 };
  }
}

// Type-safe string conversion helper
export function ensureString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

// Type-safe conversion from unknown[] to string[]
export function convertToStringArray(values: unknown[] | null | undefined): string[] {
  if (!values || !Array.isArray(values)) return [];
  return values.map(ensureString);
}

// Safely convert any database response to include count
export function ensureResponseWithCount<T>(response: { data: T[]; error: any; count?: number }): { data: T[]; error: any; count: number } {
  return {
    data: Array.isArray(response.data) ? response.data : [],
    error: response.error,
    count: response.count !== undefined ? response.count : (Array.isArray(response.data) ? response.data.length : 0)
  };
}

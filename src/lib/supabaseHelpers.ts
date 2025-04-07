
/**
 * Helper functions to work with Supabase responses
 */

// Helper to get around the TypeScript issue with Supabase client chain methods
// This fixes the "Type of 'await' operand must either be a valid promise or must not contain a callable 'then' member" error
export const unwrapPromise = async <T>(promise: Promise<{ data: T; error: any }> | any): Promise<{ data: T; error: any; count?: number }> => {
  try {
    // Convert the promise-like object to a proper Promise first
    const promiseResult = Promise.resolve(promise);
    const result = await promiseResult;
    
    // If the result is not in the expected format, wrap it
    if (result && typeof result === 'object') {
      if (!('data' in result)) {
        return { data: result as T, error: null };
      }
      return result;
    }
    
    // Fallback case
    return { data: null as T, error: new Error('Invalid response format') };
  } catch (error) {
    return { data: null as T, error };
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
    count: response.data?.length || 0
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
export async function executeSupabaseQuery<T>(queryPromise: any): Promise<{ data: T[]; error: any; count?: number }> {
  try {
    // Ensure we're working with a proper promise
    const result = await Promise.resolve(queryPromise);
    return {
      data: Array.isArray(result.data) ? result.data : [],
      error: result.error,
      count: result.count !== undefined ? result.count : (Array.isArray(result.data) ? result.data.length : 0)
    };
  } catch (error) {
    console.error('Supabase query execution error:', error);
    return { data: [], error };
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

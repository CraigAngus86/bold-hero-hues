
import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Error classification types for better handling
 */
export enum ErrorType {
  NETWORK = 'network',
  DATABASE = 'database',
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  INTERNAL = 'internal',
  UNKNOWN = 'unknown',
}

/**
 * Extended error interface with additional metadata
 */
export interface AppError extends Error {
  type?: ErrorType;
  originalError?: unknown;
  context?: Record<string, unknown>;
}

/**
 * Creates a standardized application error
 */
export function createAppError(
  message: string, 
  type: ErrorType = ErrorType.UNKNOWN, 
  originalError?: unknown,
  context?: Record<string, unknown>
): AppError {
  const error = new Error(message) as AppError;
  error.type = type;
  error.originalError = originalError;
  error.context = context;
  return error;
}

/**
 * Handles API errors consistently throughout the application
 */
export function handleApiError(error: unknown): AppError {
  console.error('API Error:', error);
  
  // Handle Supabase errors
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const supabaseError = error as PostgrestError;
    
    // Map Supabase error codes to our error types
    let errorType = ErrorType.DATABASE;
    if (supabaseError.code === 'PGRST116' || supabaseError.code === 'PGRST104') {
      errorType = ErrorType.AUTHENTICATION;
    }
    
    return createAppError(
      supabaseError.message || 'Database operation failed',
      errorType,
      supabaseError
    );
  }
  
  // Handle network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return createAppError(
      'Network error occurred. Please check your connection.',
      ErrorType.NETWORK,
      error
    );
  }
  
  // Handle any other error type
  const message = error instanceof Error 
    ? error.message 
    : 'An unknown error occurred';
    
  return createAppError(message, ErrorType.UNKNOWN, error);
}

/**
 * Shows an appropriate error message to the user
 */
export function showErrorToUser(error: unknown, fallbackMessage = 'An error occurred'): void {
  let message = fallbackMessage;
  let errorType = ErrorType.UNKNOWN;
  
  if (error instanceof Error) {
    message = error.message || fallbackMessage;
    if ('type' in error && typeof error.type === 'string') {
      errorType = error.type as ErrorType;
    }
  }
  
  // Log for debugging
  console.error('Error:', { message, type: errorType, error });
  
  // Show user-friendly message
  toast.error(message);
}

/**
 * Safe wrapper for async operations that provides consistent error handling
 */
export async function safeAsync<T>(
  operation: () => Promise<T>, 
  errorMessage = 'Operation failed'
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (err) {
    const appError = handleApiError(err);
    appError.message = appError.message || errorMessage;
    return { data: null, error: appError };
  }
}

/**
 * Utility function to handle form submission errors
 */
export function handleFormError(error: unknown, formName: string): void {
  const message = error instanceof Error 
    ? error.message 
    : `Error submitting ${formName} form`;
  
  console.error(`${formName} form error:`, error);
  toast.error(message);
}

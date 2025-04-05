
import { PostgrestError } from '@supabase/supabase-js';
import { showErrorToUser, ErrorType, createAppError } from '@/utils/errorHandling';

export interface DbServiceResponse<T> {
  data: T | null;
  error: Error | null;
  isLoading?: boolean;
  success: boolean;
  message?: string;
}

export async function handleDbOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string,
  context?: Record<string, unknown>
): Promise<DbServiceResponse<T>> {
  try {
    const data = await operation();
    return { data, error: null, success: true };
  } catch (error) {
    console.error(`Database operation error: ${errorMessage}`, error);
    
    // Handle Supabase-specific errors
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const pgError = error as PostgrestError;
      const appError = createAppError(
        pgError.message || errorMessage,
        ErrorType.DATABASE,
        error,
        context
      );
      showErrorToUser(appError);
      return { data: null, error: appError, success: false, message: appError.message };
    }
    
    // Handle other error types
    const finalError = error instanceof Error 
      ? error 
      : new Error(errorMessage);
    
    showErrorToUser(finalError, errorMessage);
    return { data: null, error: finalError, success: false, message: finalError.message };
  }
}

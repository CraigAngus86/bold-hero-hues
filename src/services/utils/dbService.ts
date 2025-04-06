
/**
 * Generic response type for database operations
 */
export interface DbServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Helper function to handle database operations and standardize error handling
 */
export async function handleDbOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Database operation failed'
): Promise<DbServiceResponse<T>> {
  try {
    const result = await operation();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : errorMessage
    };
  }
}

/**
 * Convert column names from snake_case to camelCase
 */
export function snakeToCamel<T>(obj: Record<string, any>): T {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = obj[key];
    }
  }
  
  return result as T;
}

/**
 * Convert column names from camelCase to snake_case
 */
export function camelToSnake<T>(obj: Record<string, any>): T {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      result[snakeKey] = obj[key];
    }
  }
  
  return result as T;
}

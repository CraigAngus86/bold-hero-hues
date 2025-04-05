
import { DbServiceResponse } from '@/services/utils/dbService';

/**
 * Hook return type for data fetching with loading and error states
 */
export interface UseDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Mutation result with loading and error states
 */
export interface MutationResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Mutation function type
 */
export type MutationFn<TInput, TOutput> = (input: TInput) => Promise<DbServiceResponse<TOutput>>;

/**
 * Query function type
 */
export type QueryFn<TParams, TOutput> = (params: TParams) => Promise<DbServiceResponse<TOutput>>;

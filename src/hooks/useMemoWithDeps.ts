
import { useMemo, DependencyList, useRef } from 'react';
import { isEqual } from 'lodash';

/**
 * Enhanced version of useMemo that performs deep comparison of dependencies
 * Useful when dependencies are objects or arrays that may have the same values
 * but different references
 * 
 * @param factory The function to memoize
 * @param dependencies The dependencies array to watch for changes
 * @returns Memoized value that only changes when dependencies actually change
 */
function useMemoWithDeps<T>(factory: () => T, dependencies: DependencyList): T {
  // Store the last dependencies
  const depsRef = useRef<DependencyList | null>(null);
  
  // Store the last computed value
  const valueRef = useRef<T | null>(null);
  
  // Check if dependencies changed (deep comparison)
  if (depsRef.current === null || !isEqual(dependencies, depsRef.current)) {
    // Update the refs if they did change
    depsRef.current = dependencies;
    valueRef.current = factory();
  }
  
  // Return memoized value
  return valueRef.current as T;
}

export default useMemoWithDeps;

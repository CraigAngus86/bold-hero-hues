
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  componentName?: string;
}

/**
 * A reusable error fallback component that displays when an error occurs
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary,
  componentName 
}) => {
  const componentLabel = componentName ? ` in ${componentName}` : '';
  
  return (
    <div className="p-6 border border-red-200 rounded-lg bg-red-50">
      <div className="flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="h-10 w-10 text-amber-500" />
        <h2 className="text-xl font-bold text-red-700">Something went wrong{componentLabel}</h2>
        
        <div className="text-sm text-gray-600 max-w-md text-center">
          <p className="mb-2">
            We're sorry, but there was an error loading this component. 
            Please try refreshing the page or contact support if the issue persists.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="my-4 p-3 bg-gray-100 border border-gray-300 rounded text-left overflow-auto">
              <p className="font-mono text-red-600 text-xs whitespace-pre-wrap">
                {error.message}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Refresh Page
          </Button>
          
          <Button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-team-blue text-white rounded-md hover:bg-team-lightBlue hover:text-team-blue transition-colors"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;

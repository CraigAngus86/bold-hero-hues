
import React from 'react';

interface FormDisplayProps {
  form?: string[];
}

/**
 * Component for displaying team form as colored indicators
 */
export const FormDisplay: React.FC<FormDisplayProps> = ({ form }) => {
  if (!form || form.length === 0) {
    return null;
  }

  return (
    <div className="flex space-x-1">
      {form.map((result, i) => (
        <span 
          key={i} 
          className={`inline-block w-5 h-5 text-xs text-center leading-5 rounded-full
            ${result === 'W' ? 'bg-green-500 text-white' : 
              result === 'D' ? 'bg-yellow-500 text-white' : 
              'bg-red-500 text-white'}`}
        >
          {result}
        </span>
      ))}
    </div>
  );
};

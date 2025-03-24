
import React from 'react';

interface FormIndicatorProps {
  result: string;
}

const FormIndicator = ({ result }: FormIndicatorProps) => {
  const getColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-green-500';
      case 'D': return 'bg-yellow-500';
      case 'L': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };
  
  return (
    <span className={`${getColor(result)} text-white text-xs font-bold w-4 h-4 inline-flex items-center justify-center rounded-full`}>
      {result}
    </span>
  );
};

export default FormIndicator;

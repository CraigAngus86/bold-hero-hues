
import React from 'react';

interface FormIndicatorProps {
  result: string;
}

const FormIndicator: React.FC<FormIndicatorProps> = ({ result }) => {
  let bgColor = 'bg-gray-200';
  let textColor = 'text-gray-700';
  let resultChar = '-';

  switch (result.toUpperCase()) {
    case 'W':
      bgColor = 'bg-green-500';
      textColor = 'text-white';
      resultChar = 'W';
      break;
    case 'D':
      bgColor = 'bg-amber-500';
      textColor = 'text-white';
      resultChar = 'D';
      break;
    case 'L':
      bgColor = 'bg-red-500';
      textColor = 'text-white';
      resultChar = 'L';
      break;
  }

  return (
    <div className={`${bgColor} ${textColor} w-5 h-5 flex items-center justify-center text-xs rounded-sm font-bold`}>
      {resultChar}
    </div>
  );
};

export default FormIndicator;

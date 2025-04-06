
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface FormDisplayProps {
  form: string[] | string;
}

export const FormDisplay: React.FC<FormDisplayProps> = ({ form }) => {
  // Convert string to array if it's a string
  const formArray = Array.isArray(form) ? form : (typeof form === 'string' ? form.split('') : []);
  
  return (
    <div className="flex gap-1">
      {formArray.map((result, idx) => {
        let bg = "bg-gray-200";
        if (result === "W") bg = "bg-green-500 text-white";
        if (result === "L") bg = "bg-red-500 text-white";
        if (result === "D") bg = "bg-yellow-500 text-white";
        
        return (
          <Badge 
            key={idx} 
            variant="outline" 
            className={`h-5 min-w-5 p-0 flex items-center justify-center ${bg}`}
          >
            {result}
          </Badge>
        );
      })}
    </div>
  );
};


import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { MediaSelector } from '@/components/admin/common/media-selector';
import { Control } from 'react-hook-form';

interface FormImageFieldProps {
  name: string;
  label: string;
  description?: string;
  control: Control<any>;
  required?: boolean;
}

export const FormImageField: React.FC<FormImageFieldProps> = ({
  name,
  label,
  description,
  control,
  required = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && <span className="text-red-500 ml-1">*</span>}</FormLabel>
          <FormControl>
            <MediaSelector 
              selectedImage={field.value || null} 
              onSelect={(url) => field.onChange(url)} 
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormImageField;

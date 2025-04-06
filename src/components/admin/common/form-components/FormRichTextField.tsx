
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Editor } from '@tinymce/tinymce-react';
import { Control } from 'react-hook-form';

interface FormRichTextFieldProps {
  name: string;
  label: string;
  description?: string;
  control: Control<any>;
  required?: boolean;
  height?: number;
}

export const FormRichTextField: React.FC<FormRichTextFieldProps> = ({
  name,
  label,
  description,
  control,
  required = false,
  height = 400,
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
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY || ''}
              value={field.value || ''}
              init={{
                height,
                menubar: true,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
              onEditorChange={(content) => field.onChange(content)}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormRichTextField;

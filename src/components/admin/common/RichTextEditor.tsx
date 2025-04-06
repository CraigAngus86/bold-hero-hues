
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from 'next-themes';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
  disabled?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  height = 500,
  placeholder = 'Start writing...',
  disabled = false,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const handleEditorChange = (content: string) => {
    onChange(content);
  };
  
  return (
    <Editor
      apiKey="no-api-key" // Replace with your TinyMCE API key in production
      value={value}
      onEditorChange={handleEditorChange}
      disabled={disabled}
      init={{
        height,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
          'autosave', 'directionality', 'visualchars', 'imagetools'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'image media link table | removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        placeholder: placeholder,
        skin: isDarkMode ? 'oxide-dark' : 'oxide',
        content_css: isDarkMode ? 'dark' : 'default',
        promotion: false,
        branding: false,
        browser_spellcheck: true,
        images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            // For demo purposes, we're just embedding the image as base64
            // In production, you would upload this to your server or Supabase storage
            if (e.target?.result) {
              resolve(e.target.result as string);
            } else {
              reject('Failed to read file');
            }
          };
          reader.onerror = () => reject('Failed to read file');
          reader.readAsDataURL(blobInfo.blob());
        }),
        setup: (editor) => {
          editor.on('init', () => {
            // Make sure the editor doesn't start with focus
            editor.getBody().setAttribute('data-placeholder', placeholder);
          });
        },
        image_caption: true,
        table_default_attributes: {
          border: '1'
        },
        table_default_styles: {
          width: '100%'
        }
      }}
    />
  );
};

export default RichTextEditor;

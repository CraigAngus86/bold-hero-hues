
import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: number | string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing...',
  className = '',
  height = 400,
}) => {
  const [editorContent, setEditorContent] = useState<string>(value || '');
  
  // Update internal state when external value changes
  useEffect(() => {
    if (value !== editorContent) {
      setEditorContent(value);
    }
  }, [value]);

  // Handle editor content change
  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    onChange(content);
  };

  return (
    <div className={className}>
      <Editor
        value={editorContent}
        onEditorChange={handleEditorChange}
        init={{
          height: height,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help',
          placeholder: placeholder,
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              font-size: 16px; 
              color: #374151;
            }
          `,
          statusbar: false,
          resize: false,
          branding: false,
        }}
      />
    </div>
  );
};

export default RichTextEditor;

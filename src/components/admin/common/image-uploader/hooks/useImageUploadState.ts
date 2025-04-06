
import { useState } from 'react';

interface UseImageUploadStateProps {
  initialImageUrl: string | null;
  initialAlt: string;
  initialDescription: string;
  initialTags: string[];
}

export function useImageUploadState({
  initialImageUrl,
  initialAlt,
  initialDescription,
  initialTags
}: UseImageUploadStateProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState(initialAlt);
  const [imageDescription, setImageDescription] = useState(initialDescription);
  const [imageTags, setImageTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAltText(initialAlt);
    setImageDescription(initialDescription);
    setImageTags(initialTags);
    setTagInput('');
  };

  return {
    previewUrl,
    setPreviewUrl,
    selectedFile,
    setSelectedFile,
    altText,
    setAltText,
    imageDescription,
    setImageDescription,
    imageTags,
    setImageTags,
    tagInput,
    setTagInput,
    dragActive,
    setDragActive,
    clearSelection
  };
}

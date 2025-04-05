
import { useState } from 'react';

export function useImageDialog() {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Open image in dialog
  const viewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageDialogOpen(true);
  };
  
  return {
    imageDialogOpen,
    setImageDialogOpen,
    selectedImage,
    setSelectedImage,
    viewImage
  };
}

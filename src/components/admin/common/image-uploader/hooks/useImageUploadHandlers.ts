
// Update the onUploadComplete to handle ImageUploadResult
onUploadComplete: (result: any) => {
  if (typeof result === 'string') {
    onUploadComplete?.(result);
  } else if (result && result.data && result.data.url) {
    onUploadComplete?.(result.data.url);
  }
}

// And for the handleUpload function:
const handleUpload = async () => {
  if (!selectedFile) return;
  
  try {
    const uploadOptions = {
      alt: altText || selectedFile.name.split('.')[0],
      description: imageDescription,
      tags: imageTags
    };
    
    const result = await uploadFile(selectedFile, uploadOptions);
    
    if (result.success && result.data) {
      toast.success('Image uploaded successfully');
      clearSelection();
      if (onUploadComplete) {
        if (typeof onUploadComplete === 'function') {
          onUploadComplete(result.data.url);
        }
      }
    }
  } catch (error) {
    console.error('Failed to upload image:', error);
    toast.error('Failed to upload image');
  }
};

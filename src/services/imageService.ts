
// Fix for lines 136 and 138
const uploadImage = async (file: File, metadata?: Partial<ImageMetadata>): Promise<ImageUploadResult> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const uniqueId = Math.random().toString(36).substring(2, 9);
  const timestamp = new Date().toISOString();
  
  // Generate mock data for the upload result
  const result: ImageUploadResult = {
    success: true,
    url: `https://storage.example.com/images/${file.name}`,
    metadata: {
      id: uniqueId,
      file_name: file.name,
      storage_path: `/images/${file.name}`,
      bucket_id: 'images',
      alt_text: metadata?.alt_text || '',
      description: metadata?.description || '',
      tags: metadata?.tags || [],
      created_by: 'current-user',
      created_at: timestamp,
      updated_at: timestamp,
      dimensions: {
        width: 1200,
        height: 800
      }
    }
  };
  
  return result;
};


import { BucketType } from '@/types/system/images';
import { ImageMetadata, ImageUploadResult, StoredImageMetadata } from '@/types/system/images';

// Mock data for folders
const mockFolders = [
  { id: '1', name: 'Photos', path: '/photos', parent_id: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', name: 'Documents', path: '/documents', parent_id: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', name: 'Team Photos', path: '/photos/team', parent_id: '1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

// Mock data for images
const mockImages = [
  { id: '101', file_name: 'team1.jpg', url: '/assets/images/team1.jpg', storage_path: '/photos/team/team1.jpg', bucket_id: 'photos', alt_text: 'Team photo', description: 'First team photo', dimensions: { width: 1200, height: 800 }, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '102', file_name: 'stadium.jpg', url: '/assets/images/stadium.jpg', storage_path: '/photos/stadium.jpg', bucket_id: 'photos', alt_text: 'Stadium', description: 'Our stadium', dimensions: { width: 1600, height: 900 }, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

// Function to get image folders
export const getImageFolders = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockFolders;
};

// Function to get images by folder
export const getImagesByFolder = async (folderPath: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockImages.filter(img => img.storage_path.startsWith(folderPath));
};

// Function to create a new folder
export const createImageFolder = async (name: string, path: string, parentId: string | null = null) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newFolder = {
    id: Math.random().toString(36).substring(2, 9),
    name,
    path,
    parent_id: parentId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // In a real app, this would add to a database
  mockFolders.push(newFolder);
  
  return newFolder;
};

// Function to delete an image
export const deleteImage = async (imageId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would delete from storage and database
  const index = mockImages.findIndex(img => img.id === imageId);
  if (index !== -1) {
    mockImages.splice(index, 1);
    return { success: true };
  }
  
  return { success: false, error: 'Image not found' };
};

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

export { uploadImage };

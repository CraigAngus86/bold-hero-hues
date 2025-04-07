import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Function to create a new folder
export const createFolder = async (bucketName: string, folderPath: string): Promise<void> => {
  try {
    // Create an empty file with the folder name
    const file = new File([''], '.empty', { type: 'text/plain' });
    
    // Construct the full path including the trailing slash
    const fullPath = `${folderPath}/.empty`;
    
    // Upload the empty file to create the folder
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error creating folder:', error);
      toast.error(`Failed to create folder: ${error.message}`);
      throw error;
    }
    
    toast.success('Folder created successfully');
  } catch (error: any) {
    console.error('Unexpected error creating folder:', error);
    toast.error(`Unexpected error creating folder: ${error.message || 'Unknown error'}`);
    throw error;
  }
};

// Function to delete a folder
export const deleteFolder = async (bucketName: string, folderPath: string): Promise<void> => {
  try {
    // List all files within the folder
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list(folderPath);
    
    if (listError) {
      console.error('Error listing files in folder:', listError);
      toast.error(`Failed to list files in folder: ${listError.message}`);
      throw listError;
    }
    
    if (!files || files.length === 0) {
      toast.warning('Folder is empty, nothing to delete');
      return;
    }
    
    // Extract the paths of all files
    const pathsToDelete = files.map(file => `${folderPath}/${file.name}`);
    
    // Delete all files in the folder
    const { error: removeError } = await supabase.storage
      .from(bucketName)
      .remove(pathsToDelete);
    
    if (removeError) {
      console.error('Error deleting files in folder:', removeError);
      toast.error(`Failed to delete files in folder: ${removeError.message}`);
      throw removeError;
    }
    
    toast.success('Folder deleted successfully');
  } catch (error: any) {
    console.error('Unexpected error deleting folder:', error);
    toast.error(`Unexpected error deleting folder: ${error.message || 'Unknown error'}`);
    throw error;
  }
};

// Add this helper function
const blobToFile = (blob: Blob, fileName: string): File => {
  return new File([blob], fileName, { 
    type: blob.type,
    lastModified: new Date().getTime()
  });
};

// Function to upload a file
export const uploadFile = async (bucketName: string, folderPath: string, file: File): Promise<string> => {
  try {
    // Construct the full path
    const fullPath = `${folderPath}/${file.name}`;
    
    // Upload the file
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      toast.error(`Failed to upload file: ${error.message}`);
      throw error;
    }
    
    toast.success('File uploaded successfully');
    return fullPath;
  } catch (error: any) {
    console.error('Unexpected error uploading file:', error);
    toast.error(`Unexpected error uploading file: ${error.message || 'Unknown error'}`);
    throw error;
  }
};

// Function to rename a file
export const renameFile = async (bucketName: string, oldPath: string, newName: string): Promise<void> => {
  try {
    // Get the file from storage as a blob
    const { data: fileBlob, error: getError } = await supabase.storage
      .from(bucketName)
      .download(oldPath);
    
    if (getError) {
      console.error('Error downloading file:', getError);
      toast.error(`Failed to download file: ${getError.message}`);
      throw getError;
    }
    
    if (!fileBlob) {
      toast.error('File not found');
      return;
    }
    
    // Convert Blob to File
    const fileExtension = oldPath.split('.').pop();
    const newFileName = newName.endsWith(`.${fileExtension}`) ? newName : `${newName}.${fileExtension}`;
    const newFile = blobToFile(fileBlob, newFileName);
    
    // Construct the new path
    const pathParts = oldPath.split('/');
    pathParts.pop(); // Remove the old file name
    const newPath = `${pathParts.join('/')}/${newFileName}`;
    
    // Upload the file with the new name
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(newPath, newFile, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Error uploading renamed file:', uploadError);
      toast.error(`Failed to upload renamed file: ${uploadError.message}`);
      throw uploadError;
    }
    
    // Delete the old file
    const { error: removeError } = await supabase.storage
      .from(bucketName)
      .remove([oldPath]);
    
    if (removeError) {
      console.error('Error deleting old file:', removeError);
      toast.error(`Failed to delete old file: ${removeError.message}`);
      throw removeError;
    }
    
    toast.success('File renamed successfully');
  } catch (error: any) {
    console.error('Unexpected error renaming file:', error);
    toast.error(`Unexpected error renaming file: ${error.message || 'Unknown error'}`);
    throw error;
  }
};

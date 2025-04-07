
/**
 * Normalize the inconsistent public URL properties in Supabase storage responses
 * Some functions return publicURL while others return publicUrl
 */
export function normalizePublicUrl(urlObj: any): string {
  if (!urlObj) return '';
  
  if (typeof urlObj === 'string') return urlObj;
  
  // Handle both publicURL and publicUrl formats
  if (urlObj.publicUrl) return urlObj.publicUrl;
  if (urlObj.publicURL) return urlObj.publicURL;
  
  // Handle nested structures
  if (urlObj.data && urlObj.data.publicUrl) return urlObj.data.publicUrl;
  if (urlObj.data && urlObj.data.publicURL) return urlObj.data.publicURL;
  
  return '';
}

/**
 * Helper function to get storage image URL
 */
export function getStorageImageUrl(bucket: string, path: string): string {
  // This would normally use supabase.storage.from(bucket).getPublicUrl(path)
  // But we're just returning a placeholder URL for now
  return `https://example.com/storage/${bucket}/${path}`;
}

/**
 * Parse storage path into bucket and path parts
 */
export function parseStoragePath(fullPath: string): { bucket: string; path: string } {
  if (!fullPath) return { bucket: '', path: '' };
  
  const parts = fullPath.split('/');
  if (parts.length < 2) return { bucket: '', path: fullPath };
  
  const bucket = parts[0];
  const path = parts.slice(1).join('/');
  
  return { bucket, path };
}

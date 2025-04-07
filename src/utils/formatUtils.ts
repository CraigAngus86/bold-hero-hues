
/**
 * Convert a file blob to a File object
 * @param blob Blob to convert
 * @param fileName Name to give the file
 * @returns File object
 */
export function blobToFile(blob: Blob, fileName: string): File {
  const file = new File([blob], fileName, {
    type: blob.type,
    lastModified: new Date().getTime()
  });
  return file;
}

/**
 * Convert a string to a File object (utility for mocking)
 * @param content String content for the file
 * @param fileName Name of the file
 * @param mimeType Mime type of the file
 * @returns File object
 */
export function stringToFile(content: string, fileName: string, mimeType: string = 'text/plain'): File {
  const blob = new Blob([content], { type: mimeType });
  return blobToFile(blob, fileName);
}

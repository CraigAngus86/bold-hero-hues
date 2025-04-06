
// This file re-exports the ImageMetadata type for components that need it
export type { ImageMetadata } from './types';

// Add any additional media-specific types here if needed

// Use `export type` to avoid module isolation issues
export type { ImageDimensions, BucketType, ImageUploadResult } from './types';

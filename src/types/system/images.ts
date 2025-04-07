
export enum BucketType {
  IMAGES = 'images',
  VIDEOS = 'videos',
  DOCUMENTS = 'documents',
  AVATARS = 'avatars',
  POSTS = 'posts',
  PRODUCTS = 'products',
  GENERAL = 'general',
  MEDIA = 'media',
  SPONSORS = 'sponsors',
  PLAYERS = 'players',
  PUBLIC = 'public',
  TEAMS = 'teams',
  NEWS = 'news',
  PROFILES = 'profiles'
}

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

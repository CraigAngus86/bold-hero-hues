
export enum BucketType {
  AVATARS = 'avatars',
  TEAMS = 'teams',
  NEWS = 'news',
  PLAYERS = 'players',
  SPONSORS = 'sponsors',
  GALLERY = 'gallery',
  DOCUMENTS = 'documents',
  MISC = 'misc'
}

export interface StorageItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface StorageFolder {
  id: string;
  name: string;
  path: string;
  created_at: string;
}

export interface StorageItemsResponse {
  items: StorageItem[];
  folders: StorageFolder[];
}

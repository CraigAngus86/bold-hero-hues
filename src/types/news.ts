
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  publish_date: string;
  category: string;
  author?: string;
  is_featured: boolean;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt?: string;
  image_url?: string;
  publish_date: string;
  category: string;
  author?: string;
  is_featured: boolean;
  slug: string;
  date?: string; // Adding date for backward compatibility
  image?: string; // Adding image for backward compatibility
}

export interface NewsQueryOptions {
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  orderBy?: 'newest' | 'oldest' | 'title' | 'publish_date' | 'created_at';
  searchTerm?: string;
  orderDirection?: string;
  page?: number;
}

export interface CreateNewsArticleData {
  title: string;
  content: string;
  category: string;
  slug: string;
  image_url?: string;
  publish_date?: string;
  author?: string;
  is_featured?: boolean;
}

export interface UpdateNewsArticleData {
  title?: string;
  content?: string;
  category?: string;
  slug?: string;
  image_url?: string;
  publish_date?: string;
  author?: string;
  is_featured?: boolean;
}

// Remove duplicate exports

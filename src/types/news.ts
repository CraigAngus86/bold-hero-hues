
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
}

export interface NewsQueryOptions {
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  orderBy?: 'newest' | 'oldest';
}

export interface CreateNewsArticleData {
  title: string;
  content: string;
  category: string; // Make this required
  slug?: string;
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

// Export interfaces for service usage
export {
  NewsArticle,
  NewsItem,
  NewsQueryOptions,
  CreateNewsArticleData,
  UpdateNewsArticleData
};

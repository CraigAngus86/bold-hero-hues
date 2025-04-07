
export interface FeaturedArticle {
  id: string;
  title: string;
  image_url: string;
  category: string;
  publish_date: string;
  excerpt: string;
  author?: string;
}

export interface NewsArticle extends FeaturedArticle {
  content: string;
  slug: string;
  updated_at: string;
  created_at: string;
  is_featured: boolean;
}

// Additional types needed for various components
export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  publish_date: string;
  image_url: string;
  image?: string; // Some components use image instead of image_url
  date?: string; // Some components use date instead of publish_date
  is_featured?: boolean;
  author?: string; // Adding author to NewsItem
  slug?: string; // Adding slug to NewsItem
};

export interface NewsQueryOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  category?: string;
  featured?: boolean;
  searchTerm?: string;
}

export interface CreateNewsArticleData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author?: string;
  image_url?: string;
  publish_date?: string;
  slug?: string;
  is_featured?: boolean;
}

export interface UpdateNewsArticleData {
  title?: string;
  content?: string;
  excerpt?: string;
  category?: string;
  author?: string;
  image_url?: string;
  publish_date?: string;
  slug?: string;
  is_featured?: boolean;
}
